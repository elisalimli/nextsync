package graphql

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"sort"
	"sync"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/elisalimli/go_graphql_template/graphql/models"
	customMiddleware "github.com/elisalimli/go_graphql_template/middleware"
	"github.com/elisalimli/go_graphql_template/validator"
)

// func (r *mutationResolver) SingleUpload(ctx context.Context, file graphql.Upload) (*models.File, error) {
// 	content, err := io.ReadAll(file.File)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return &models.File{
// 		ID:      1,
// 		Name:    file.Filename,
// 		Content: string(content),
// 	}, nil
// }

const (
	BucketName = "azepdfserver"
	REGION     = "eu-central-1"
	PartSize   = 50_000_000
	RETRIES    = 2
)

var SecretKey = os.Getenv("S3_SECRET_KEY")
var AccessKey = os.Getenv("S3_ACCESS_KEY")

var s3session *s3.S3

type partUploadResult struct {
	completedPart *s3.CompletedPart
	err           error
}

func init() {
	s3session = s3.New(session.Must(session.NewSession(&aws.Config{
		Region:      aws.String(REGION),
		Credentials: credentials.NewStaticCredentials(AccessKey, SecretKey, ""),
	})))
}

var wg = sync.WaitGroup{}

func uploadToS3(resp *s3.CreateMultipartUploadOutput, fileBytes []byte, partNum int, wg *sync.WaitGroup, ch chan partUploadResult) {
	defer wg.Done()
	var try int
	fmt.Printf("Uploading %v \n", len(fileBytes))
	for try <= RETRIES {
		uploadRes, err := s3session.UploadPart(&s3.UploadPartInput{
			Body:          bytes.NewReader(fileBytes),
			Bucket:        resp.Bucket,
			Key:           resp.Key,
			PartNumber:    aws.Int64(int64(partNum)),
			UploadId:      resp.UploadId,
			ContentLength: aws.Int64(int64(len(fileBytes))),
		})
		if err != nil {
			fmt.Println(err)
			if try == RETRIES {
				ch <- partUploadResult{nil, err}
				return
			} else {
				try++
				time.Sleep(time.Duration(time.Second * 15))
			}
		} else {
			ch <- partUploadResult{
				&s3.CompletedPart{
					ETag:       uploadRes.ETag,
					PartNumber: aws.Int64(int64(partNum)),
				}, nil,
			}
			return
		}
	}
	ch <- partUploadResult{}
}

func uploadFiles(ctx context.Context, resp *[]models.Post_File, req []*models.UploadFile) error {

	for _, file := range req {

		currentUserId := ctx.Value(customMiddleware.CurrentUserIdKey)
		fileName := fmt.Sprintf("%v-%v", currentUserId, file.File.Filename)

		fileSize := file.File.Size

		buffer := make([]byte, fileSize)

		src := file.File.File
		_, _ = src.Read(buffer)

		expiryDate := time.Now().AddDate(0, 0, 1)

		createdResp, err := s3session.CreateMultipartUpload(&s3.CreateMultipartUploadInput{
			Bucket:  aws.String(BucketName),
			Key:     aws.String(fileName),
			Expires: &expiryDate,
		})

		if err != nil {
			fmt.Print(err)
			return err
		}

		var start, currentSize int
		var remaining = int(fileSize)
		var partNum = 1
		var completedParts []*s3.CompletedPart
		var ch = make(chan partUploadResult)
		fmt.Println("uploaded files", remaining, partNum)
		for start = 0; remaining > 0; start += PartSize {
			wg.Add(1)
			if remaining < PartSize {
				currentSize = remaining
			} else {
				currentSize = PartSize
			}
			go uploadToS3(createdResp, buffer[start:start+currentSize], partNum, &wg, ch)

			remaining -= currentSize
			fmt.Printf("Uplaodind of part %v started and remaning is %v \n", partNum, remaining)
			partNum++

		}

		go func() {
			wg.Wait()
			close(ch)
		}()

		for result := range ch {
			if result.err != nil {
				_, err = s3session.AbortMultipartUpload(&s3.AbortMultipartUploadInput{
					Bucket:   aws.String(BucketName),
					Key:      aws.String(fileName),
					UploadId: createdResp.UploadId,
				})
				if err != nil {
					fmt.Print(err)
					return err
					// os.Exit(1)
				}
			}
			fmt.Printf("Uploading of part %v has been finished \n", *result.completedPart.PartNumber)
			completedParts = append(completedParts, result.completedPart)
		}

		// Ordering the array based on the PartNumber as each parts could be uploaded in different order!
		sort.Slice(completedParts, func(i, j int) bool {
			return *completedParts[i].PartNumber < *completedParts[j].PartNumber
		})

		// Signalling AWS S3 that the multiPartUpload is finished
		res, err := s3session.CompleteMultipartUpload(&s3.CompleteMultipartUploadInput{
			Bucket:   createdResp.Bucket,
			Key:      createdResp.Key,
			UploadId: createdResp.UploadId,
			MultipartUpload: &s3.CompletedMultipartUpload{
				Parts: completedParts,
			},
		})

		if err != nil {
			fmt.Print(err)
			return err
		} else {
			*resp = append(*resp, models.Post_File{Url: *res.Location})
			fmt.Println(res.String())
		}
	}
	return nil
}

func (m *postResolver) Files(ctx context.Context, obj *models.Post) ([]string, error) {
	var urls []string

	for _, f := range obj.Files {
		urls = append(urls, f.Url)
	}
	return urls, nil
}

func (m *mutationResolver) CreatePost(ctx context.Context, input models.CreatePostInput) (*models.CreatePostResponse, error) {
	var imageUrls []models.Post_File
	if len(input.Files) == 0 {
		return &models.CreatePostResponse{Ok: false, Errors: []*validator.FieldError{{Field: "general", Message: "Please provide at least a file."}}}, nil
	}

	err := uploadFiles(ctx, &imageUrls, input.Files)
	if err != nil {
		return nil, err
	}
	post := &models.Post{
		Title:       input.Title,
		Description: input.Description,
		Files:       imageUrls,
	}
	fmt.Println(post)
	err = m.Domain.PostsRepo.CreatePost(post)

	if err != nil {
		return nil, err
	}
	return &models.CreatePostResponse{Ok: true, Post: post}, nil
}

func (r *queryResolver) Posts(ctx context.Context) ([]*models.Post, error) {

	var posts []*models.Post

	// rows, _ := r.Domain.PostsRepo.DB.Table("posts").Select("posts.*,json_agg(json_build_object('id', pf.id, 'post_id', pf.post_id, 'url', pf.url)) AS files").Joins("JOIN post_files pf ON pf.post_id = posts.id").Group("posts.id").Rows()
	// for rows.Next() {

	// 	rows.Scan(&posts)
	// 	fmt.Println("rows", posts)
	// }
	// var postsWithFiles []models.Post
	// r.Domain.PostsRepo.DB.Select("posts.*, post_files.*").
	// 	Joins("JOIN post_files ON posts.id = post_files.post_id").
	// 	Find(&postsWithFiles)
	// fmt.Println("posts", postsWithFiles)
	// for _, post := range postsWithFiles {
	// 	fmt.Printf("Post: %s\n", post.Title)
	// 	for _, file := range post.Files {
	// 		fmt.Printf("File: %s\n", file.Url)
	// 	}
	// }

	// fmt.Println("posts", posts[0])
	// if err != nil {
	// return nil, errors.New(domain.ErrSomethingWentWrong)
	// }

	r.Domain.PostsRepo.DB.Raw(`SELECT json_agg(json_build_object('ID', pf.id, 'PostId', pf.post_id, 'Url', pf.url)) AS "Files" FROM "posts" JOIN post_files pf ON pf.post_id = posts.id GROUP BY "posts"."id"`).Find(&posts)
	// r.Domain.PostsRepo.DB.Preload("Files").Find(&posts)
	// r.Domain.PostsRepo.DB.Joins("files").Find(&posts)
	fmt.Println("posts", posts[0])

	// rows, _ := r.Domain.PostsRepo.DB.Model(&models.Post{}).Select(`posts.id as "ID",json_agg(json_build_object('id', pf.id, 'post_id', pf.post_id, 'url', pf.url)) AS "Files"`).Joins("join post_files pf ON pf.post_id = posts.id ").Group("posts.id").Rows()
	// defer rows.Close()
	// for rows.Next() {
	// 	var title models.Post
	// 	rows.Scan(&title)
	// 	fmt.Println("titlet", title)

	// 	// do something
	// }
	return posts, nil
}
