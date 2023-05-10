package migrations

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/elisalimli/go_graphql_template/domain"
	"github.com/elisalimli/go_graphql_template/initializers"
	"github.com/elisalimli/go_graphql_template/postgres"
)

type Document struct {
	Text     string `json:"text"`
	Variant  string `json:"variant"`
	Date     string `json:"date"`
	FileName string `json:"fileName"`
	Grade    string `json:"grade"`
	Type     string `json:"type"`
}

var PostsRepo = postgres.PostsRepo{DB: initializers.DB}

func Seed() {
	// Open the JSON file for reading
	file, err := os.Open("/Users/alisalimli/Desktop/projects/pdf_server/server/migrations/documents.json")
	if err != nil {
		fmt.Println("Error opening JSON file:", err)
		return
	}
	defer file.Close()

	// Create a slice of Person to hold the decoded objects
	var documents []Document

	// Decode the JSON file into the slice of Person objects
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&documents)
	if err != nil {
		fmt.Println("Error decoding JSON:", err)
		return
	}

	// Print out the name and age of each person
	for _, document := range documents {
		// fmt.Println(document.Date)
		// post := &models.Post{
		// 	Title: document.Text,
		// 	// Description: input.Description,
		// 	Type: strings.ToUpper(document.Type),
		// 	// Language:    strings.ToUpper(input.Language),
		// 	Variant: strings.ToUpper(document.Variant),
		// 	// Files:   imageUrls,
		// 	UserId:  currentUserId,
		// }
		// fmt.Println(post)
		// ctx := context.Background()
		// err = postsRepo.CreatePost(ctx, post)
		// if err != nil {
		// 	log.Fatal("Error occured", err)
		// }

		// Open the file
		file, err := os.Open("/Users/alisalimli/Desktop/projects/pdf_server/pdf_server_downloader/documents/" + document.FileName)
		if err != nil {
			fmt.Println("Error opening file:", err)
			return
		}
		defer file.Close()

		// Get the file size
		fileInfo, err := file.Stat()
		if err != nil {
			fmt.Println("Error getting file info:", err)
			return
		}
		fileSize := fileInfo.Size()

		// Get the file content type
		buffer := make([]byte, 512)
		_, err = file.Read(buffer)
		if err != nil {
			fmt.Println("Error reading file:", err)
			return
		}
		fileType := http.DetectContentType(buffer)

		bucket := "azepdfserver"
		key := document.FileName

		// Download the object metadata to get the file URL
		headObjectOutput, err := domain.S3session.HeadObject(&s3.HeadObjectInput{
			Bucket: &bucket,
			Key:    &key,
		})
		if err != nil {
			fmt.Println("Error getting object metadata:", err)
			return
		}

		// Construct the file URL
		fileUrl := fmt.Sprintf("https://%s/%s/%s", domain.BucketName, headObjectOutput.SSEKMSKeyId, headObjectOutput.ETag)

		fmt.Println("File URL:", fileUrl)

		fmt.Printf("File type: %s \n", fileType)
		fmt.Printf("File size: %d bytes\n", fileSize)

		// imageUrls := []models.PostFile{models.PostFile{URL:  }}

		// err = postsRepo.DB.NewInsert().Model(&imageUrls).Scan(ctx)
		// if err != nil {
		// return nil, err
		// }
	}
}
