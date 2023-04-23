package graphql

import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql"
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

func (m *mutationResolver) SingleUpload(ctx context.Context, file graphql.Upload) (*models.File, error) {
	accessKey := os.Getenv("S3_ACCESS_KEY")
	secretKey := os.Getenv("S3_SECRET_KEY")
	currentUserId := ctx.Value(customMiddleware.CurrentUserIdKey)

	fileName := fmt.Sprintf("%v-%v", currentUserId, file.Filename)

	s3Config := &aws.Config{
		Credentials: credentials.NewStaticCredentials(accessKey, secretKey, ""),
		Region:      aws.String("eu-central-1"),
	}

	newSession, err := session.NewSession(s3Config)
	if err != nil {
		fmt.Printf("error while creating a new session %v", err)
	}

	s3Client := s3.New(newSession)
	stream, readErr := ioutil.ReadAll(file.File)
	if readErr != nil {
		fmt.Printf("error from file %v", readErr)
	}

	fileErr := ioutil.WriteFile(fileName, stream, 0644)
	if fileErr != nil {
		fmt.Printf("file err %v", fileErr)
	}

	fileD, openErr := os.Open(fileName)
	if openErr != nil {
		fmt.Printf("Error opening file: %v", openErr)
	}

	defer fileD.Close()

	buffer := make([]byte, file.Size)

	_, _ = fileD.Read(buffer)

	fileBytes := bytes.NewReader(buffer)
	fmt.Println("contenttype", fmt.Sprintf("myfiles/%v", fileName))
	object := s3.PutObjectInput{
		Bucket: aws.String("azepdfserver"),
		Key:    aws.String(fmt.Sprintf("myfiles/%v", fileName)),
		Body:   fileBytes,
		ACL:    aws.String("public-read"),
	}

	if _, uploadErr := s3Client.PutObject(&object); uploadErr != nil {
		return nil, fmt.Errorf("error uploading file: %v", uploadErr)
	}

	_ = os.Remove(fileName)

	return &models.File{
		ID:   1,
		Name: file.Filename,
		// Content: string(content),
	}, nil
}

// CurrentTime is the resolver for the currentTime field.
func (r *subscriptionResolver) CurrentTime(ctx context.Context) (<-chan *models.SubTime, error) {
	ch := make(chan *models.SubTime)

	go func() {
		for {
			time.Sleep(1 * time.Second)
			fmt.Println("Tick")

			currentTime := time.Now()

			t := &models.SubTime{
				UnixTime:  int(currentTime.Unix()),
				TimeStamp: currentTime.Format(time.RFC3339),
			}

			select {
			case ch <- t:
				// Our message went through, do nothing
			default:
				fmt.Println("Channel closed.")
				return
			}

		}
	}()
	return ch, nil
}
