package migrations

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/elisalimli/go_graphql_template/domain"
	"github.com/elisalimli/go_graphql_template/graphql/models"
	"github.com/elisalimli/go_graphql_template/initializers"
	"github.com/uptrace/bun"
)

type Document struct {
	Text        string `json:"text"`
	Variant     string `json:"variant"`
	Date        string `json:"date"`
	FileName    string `json:"fileName"`
	Grade       int    `json:"grade"`
	Type        string `json:"type"`
	ContentType string `json:"contentType"`
	FileSize    int64  `json:"fileSize"`
}

func init() {

	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {

		user := models.User{
			Username:       "admin",
			Email:          os.Getenv("USER_ADMIN_Email"),
			SocialLogin:    false,
			SocialProvider: "Google",
			PhoneNumber:    os.Getenv("USER_ADMIN_PhoneNumber"),
		}
		err := user.HashPassword("admin")
		if err != nil {
			log.Printf("error while hashing password: %v", err)
			return nil
		}

		initializers.DB.NewInsert().Model(&user).Exec(ctx)

		// Open the JSON file for reading
		// using the function
		dir, err := os.Getwd()
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(dir)
		file, err := os.Open(dir + "/migrations/documents.json")
		if err != nil {
			fmt.Println("Error opening JSON file:", err)
			// return
		}
		defer file.Close()

		// Create a slice of Person to hold the decoded objects
		var documents []Document

		// Decode the JSON file into the slice of Person objects
		decoder := json.NewDecoder(file)
		err = decoder.Decode(&documents)
		if err != nil {
			fmt.Println("Error decoding JSON:", err)
			// return
		}
		fmt.Println("bucket name", domain.BucketName)

		// Reverse the order of the documents slice, for simulating createdAt
		for i, j := 0, len(documents)-1; i < j; i, j = i+1, j-1 {
			documents[i], documents[j] = documents[j], documents[i]
		}

		// Print out the name and age of each person
		for _, document := range documents {
			post := models.Post{
				Title:       "Sınaq " + document.Date,
				Description: &document.Text,
				Type:        strings.ToUpper(document.Type),
				Variant:     strings.ToUpper(document.Variant),
				// Files:       imageUrls,
				UserId: user.Id,
			}
			fmt.Println("new post : ", document.Type == "")
			ctx := context.Background()
			err = initializers.DB.NewInsert().Model(&post).Scan(ctx)

			if err != nil {
				fmt.Println("Error occured", err)
			}

			imageUrls := []models.PostFile{{URL: fmt.Sprintf("https://%s.s3.%s.amazonaws.com/", domain.BucketName, domain.BucketRegion) + document.FileName, PostId: post.Id, FileSize: document.FileSize, ContentType: document.ContentType, FileName: "sinaq.pdf"}}
			err = initializers.DB.NewInsert().Model(&imageUrls).Scan(ctx)
			if err != nil {
				log.Fatal("Error occured", err)
			}
		}
		return nil
	}, func(ctx context.Context, db *bun.DB) error {
		fmt.Print(" [down migration] ")
		return nil
	})
}
