package graphql

import (
	"bytes"
	"context"
	"errors"
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

// var accessKey = os.Getenv("S3_ACCESS_KEY")
// var secretKey = os.Getenv("S3_SECRET_KEY")

// var s3Config = &aws.Config{
// 	Credentials: credentials.NewStaticCredentials(accessKey, secretKey, ""),
// 	Region:      aws.String("eu-central-1"),
// }

// func uploadFile(file graphql.Upload, fileName string) error {
// 	newSession, err := session.NewSession(s3Config)
// 	if err != nil {
// 		fmt.Printf("error while creating a new session %v", err)
// 	}
// 	s3Client := s3.New(newSession)

// 	stream, readErr := ioutil.ReadAll(file.File)
// 	if readErr != nil {
// 		fmt.Printf("error from file %v", readErr)
// 	}

// 	fileErr := ioutil.WriteFile(fileName, stream, 0644)
// 	if fileErr != nil {
// 		fmt.Printf("file err %v", fileErr)
// 	}

// 	fileD, openErr := os.Open(fileName)
// 	if openErr != nil {
// 		fmt.Printf("Error opening file: %v", openErr)
// 	}

// 	defer fileD.Close()

// 	buffer := make([]byte, file.Size)

// 	_, _ = fileD.Read(buffer)

// 	fileBytes := bytes.NewReader(buffer)
// 	fmt.Println("contenttype", fmt.Sprintf("myfiles/%v", fileName))
// 	object := s3.PutObjectInput{
// 		Bucket: aws.String("azepdfserver"),
// 		Key:    aws.String(fmt.Sprintf("myfiles/%v", fileName)),
// 		Body:   fileBytes,
// 		ACL:    aws.String("public-read"),
// 	}

// 	if _, uploadErr := s3Client.PutObject(&object); uploadErr != nil {
// 		return fmt.Errorf("error uploading file: %v", uploadErr)
// 	}

// 	_ = os.Remove(fileName)
// 	return nil
// }

func (m *mutationResolver) MultipleUpload(ctx context.Context, req []*models.UploadFile) ([]*models.File, error) {
	var resp []*models.File
	if len(req) == 0 {
		return nil, errors.New("empty list")
	}
	for i, file := range req {

		currentUserId := ctx.Value(customMiddleware.CurrentUserIdKey)
		fileName := fmt.Sprintf("%v-%v", currentUserId, file.File.Filename)
		// err := uploadFile(file, fileName)
		// if err != nil {
		// 	return nil, err
		// }

		// currentDirectory, _ := os.Getwd()
		// file, _ := os.Open(currentDirectory + "/AWS/S3" + FILE)
		// defer file.Close()

		// stat, _ := file.Stat()
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
			return nil, err
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
					os.Exit(1)
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
		a := res.Location
		resp = append(resp, &models.File{
			ID:      i + 1,
			Name:    fileName,
			Content: *a,
		})

		if err != nil {
			fmt.Print(err)
			return nil, err
		} else {
			fmt.Println(res.String())
		}
	}

	return resp, nil
}
