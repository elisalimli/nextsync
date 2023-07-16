package domain

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"mime/multipart"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/elisalimli/nextsync/server/graphql/models"
	customMiddleware "github.com/elisalimli/nextsync/server/middleware"
	"github.com/elisalimli/nextsync/server/validator"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"golang.org/x/exp/slices"
)

var (
	BucketName   = os.Getenv("S3_BUCKET_NAME")
	BucketRegion = os.Getenv("S3_BUCKET_REGION")
	SecretKey    = os.Getenv("S3_SECRET_KEY")
	AccessKey    = os.Getenv("S3_ACCESS_KEY")
	PartSize     = 50_000_000
	RETRIES      = 2
)

var S3session *s3.S3

type partUploadResult struct {
	completedPart *s3.CompletedPart
	err           error
}

func init() {

	S3session = s3.New(session.Must(session.NewSession(&aws.Config{
		Region:      aws.String(BucketRegion),
		Credentials: credentials.NewStaticCredentials(AccessKey, SecretKey, ""),
	})))

}

var wg = sync.WaitGroup{}

func (d *Domain) uploadToS3(resp *s3.CreateMultipartUploadOutput, fileBytes []byte, partNum int, wg *sync.WaitGroup, ch chan partUploadResult) {
	defer wg.Done()
	var try int
	fmt.Printf("Uploading %v \n", len(fileBytes))
	for try <= RETRIES {
		uploadRes, err := S3session.UploadPart(&s3.UploadPartInput{
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

func (d *Domain) uploadFiles(ctx context.Context, files []*multipart.FileHeader, imageUrls *[]models.PostFile, postId string) error {
	// Create a new AWS session
	sess := session.Must(session.NewSession(&aws.Config{
		Region:      aws.String(BucketRegion),
		Credentials: credentials.NewStaticCredentials(AccessKey, SecretKey, ""),
	}))
	s3Client := s3.New(sess)

	// Iterate over the uploaded files
	for _, fileHeader := range files {
		// Open the uploaded file
		file, err := fileHeader.Open()
		if err != nil {
			return errors.New("Failed to open file")
		}
		defer file.Close()

		// Remove spaces from the file name
		// Create an S3 service client
		id := uuid.New()

		// Specify the S3 bucket name and file key
		fileName := fmt.Sprintf("%v-%v", id.String(), strings.ReplaceAll(fileHeader.Filename, " ", ""))
		contentType := fileHeader.Header.Get("Content-Type")

		// Upload the file to the S3 bucket
		_, err = s3Client.PutObject(&s3.PutObjectInput{
			Bucket: aws.String(BucketName),
			Key:    aws.String(fileName),
			Body:   file,
		})
		if err != nil {
			return errors.New("Failed to upload file to S3")
		}

		// Generate the S3 URL for the uploaded file
		s3URL := fmt.Sprintf("https://%s.s3.amazonaws.com/%s", BucketName, fileName)
		*imageUrls = append(*imageUrls, models.PostFile{PostId: postId, FileSize: fileHeader.Size, URL: s3URL, FileName: fileName, ContentType: contentType})

	}
	return nil
}

func (d *Domain) CreatePost(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// Parse the multipart form data

	err := r.ParseMultipartForm(32 << 20) // Max 32MB in-memory cache
	if err != nil {
		http.Error(w, "Failed to parse form data", http.StatusBadRequest)
		return
	}

	// fmt.Println("create post", input.SecondLanguage)
	currentUserId, _ := ctx.Value(customMiddleware.CurrentUserIdKey).(string)

	if currentUserId == "TOKEN_EXPIRED" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	title := r.FormValue("title")
	description := r.FormValue("description")
	tagIds := r.MultipartForm.Value["tagIds"]
	input := models.CreatePostInput{Title: title, Description: description}
	isValid, errors := Validation(ctx, input)

	// validating field
	if !isValid {
		// Create the response object
		response := models.CreatePostResponse{
			Ok:     false,
			Errors: errors,
		}
		// Convert the response object to JSON
		jsonResponse, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Failed to marshal response to JSON", http.StatusInternalServerError)
			return
		}
		fmt.Println("error 1")
		// Write the JSON response
		w.WriteHeader(http.StatusForbidden)
		w.Write(jsonResponse)
		return
	}

	// Process the uploaded files
	files := r.MultipartForm.File["files"]

	// Check if file types are supported
	for _, fileHeader := range files {
		contentType := fileHeader.Header.Get("Content-Type")

		supportedFileTypes := []string{"png", "jpg", "jpeg", "pdf"}
		extension := strings.Split(contentType, "/")[1]

		if !slices.Contains(supportedFileTypes, extension) {
			// Create the response object
			response := models.CreatePostResponse{
				Ok:     false,
				Errors: []*validator.FieldError{{Message: "Unsupported file types", Field: "files"}},
			}
			// Convert the response object to JSON
			jsonResponse, err := json.Marshal(response)
			if err != nil {
				http.Error(w, "Failed to marshal response to JSON", http.StatusInternalServerError)
				return
			}
			fmt.Println("error", contentType)

			// Write the JSON response
			w.WriteHeader(http.StatusForbidden)
			w.Write(jsonResponse)
			return
			// return &models.CreatePostResponse{Ok: false, Errors: []*validator.FieldError{{Field: "files", Message: "Unsupported file types"}}}, nil
		}
	}

	imageUrls := *new([]models.PostFile)

	post := &models.Post{
		Title:       input.Title,
		Description: &input.Description,
		UserId:      currentUserId,
	}

	err = d.PostsRepo.CreatePost(ctx, post)
	if err != nil {
		http.Error(w, "Something went wrong!", http.StatusInternalServerError)
		return
	}

	d.uploadFiles(ctx, files, &imageUrls, post.Id)
	if len(imageUrls) > 0 {
		err = d.PostsRepo.DB.NewInsert().Model(&imageUrls).Scan(ctx)

		if err != nil {
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}
	}

	for i := 0; i < len(tagIds); i++ {
		fmt.Println("tagId", len(tagIds), tagIds[i])
		postTag := &models.PostTag{
			PostId: post.Id,
			TagId:  tagIds[i],
		}
		_, err = d.PostsRepo.DB.NewInsert().Model(postTag).Returning("*").Exec(ctx)
		if err != nil {
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Post created successfully"))
}

func (d *Domain) GetPosts(ctx context.Context, input models.PostsInput) (*models.PostsResponse, error) {
	realLimitPlusOne := *input.Limit + 1
	posts := make([]*models.Post, 0)
	q := d.PostsRepo.DB.NewSelect().Model(&posts).
		ColumnExpr("post.id, post.title, post.description, post.html_content, post.user_id, post.created_at, post.updated_at").
		ColumnExpr(`json_agg(json_build_object(
			'id', t.id,
			'name', t.name,
			'code', t.code,
			'catalog', json_build_object('id', c.id,'name', c.name,'code', c.code)
			)) AS tags`).
		Join("LEFT JOIN post_tags pt ON post.id = pt.post_id").
		Join("LEFT JOIN tags t ON t.id = pt.tag_id").
		Join("LEFT JOIN catalogs c ON t.catalog_id = c.id").
		GroupExpr(`post.id, post.title, post.description`).
		Order(`post.created_at DESC`).
		Limit(realLimitPlusOne)

	if input.Cursor != nil {
		q = q.Where("post.created_at < ?", input.Cursor)
	}

	fmt.Println("tag ids ", input.TagIds)
	// filtering by tag ids
	if len(input.TagIds) > 0 {
		subq := d.PostsRepo.DB.NewSelect().Model((*models.PostTag)(nil)).
			ColumnExpr("pt.post_id").
			Where("pt.tag_id IN (?)", bun.In(input.TagIds)).
			Group("pt.post_id").
			Having(fmt.Sprintf("COUNT(DISTINCT pt.tag_id) = %d", len(input.TagIds)))
		q = q.Where("post.id IN (?)", subq)
	}

	// searching posts
	if input.SearchQuery != nil && len(*input.SearchQuery) > 0 {
		q = q.ColumnExpr(fmt.Sprintf(`ts_rank(search, websearch_to_tsquery ('turkish', '%s')) AS rank`, *input.SearchQuery)).
			Where(fmt.Sprintf("search @@ websearch_to_tsquery ('turkish', '%s')", *input.SearchQuery)).Order(`rank DESC`)
	}

	err := q.Scan(ctx)

	if err != nil {
		fmt.Println("Error occured:", err)
		return nil, errors.New(ErrSomethingWentWrong)
	}

	hasMore := len(posts) == realLimitPlusOne
	fmt.Println("has more ", hasMore, len(posts), realLimitPlusOne)
	if hasMore {
		posts = posts[:len(posts)-1]
	}

	// TODO: lice array has more
	return &models.PostsResponse{HasMore: hasMore, Posts: posts}, nil
}

func (d *Domain) GetPost(ctx context.Context, input models.PostInput) (*models.Post, error) {
	post := models.Post{}
	q := d.PostsRepo.DB.NewSelect().Model(&post).
		ColumnExpr("post.id, post.title, post.description, post.html_content, post.user_id, post.created_at, post.updated_at").
		ColumnExpr(`json_agg(json_build_object(
			'id', t.id,
			'name', t.name,
			'code', t.code,
			'catalog', json_build_object('id', c.id,'name', c.name,'code', c.code)
			)) AS tags`).
		Join("LEFT JOIN post_tags pt ON post.id = pt.post_id").
		Join("LEFT JOIN tags t ON t.id = pt.tag_id").
		Join("LEFT JOIN catalogs c ON t.catalog_id = c.id").
		GroupExpr(`post.id, post.title, post.description`).
		Where("post.id = ?", input.ID)

	err := q.Scan(ctx)

	if err != nil {
		fmt.Println("Error occured:", err)
		return nil, errors.New(ErrSomethingWentWrong)
	}

	// TODO: lice array has more
	return &post, nil

}

func (d *Domain) DeletePost(ctx context.Context, input models.DeletePostInput) (*models.FormResponse, error) {
	post := models.Post{Id: input.ID}
	res, err := d.PostsRepo.DB.NewDelete().Model(&post).Where("id = ?", input.ID).Exec(ctx)
	fmt.Println(res, err)

	if err != nil {
		return nil, errors.New(ErrSomethingWentWrong)
	}

	return &models.FormResponse{Ok: true}, nil
}
