package migrations

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/elisalimli/go_graphql_template/graphql/models"
	"github.com/elisalimli/go_graphql_template/initializers"
	"github.com/uptrace/bun"
)

type Document struct {
	Text     string `json:"text"`
	Variant  string `json:"variant"`
	Date     string `json:"date"`
	FileName string `json:"fileName"`
	Grade    int    `json:"grade"`
	Type     string `json:"type"`
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
		file, err := os.Open("/Users/alisalimli/Desktop/projects/pdf_server/server/migrations/documents.json")
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

		// Print out the name and age of each person
		for _, document := range documents {
			file, err := os.Open("/Users/alisalimli/Desktop/projects/pdf_server/pdf_server_downloader/documents/" + document.FileName + ".pdf")
			if err != nil {
				fmt.Println("Error opening file:", err)
				// return
			}
			defer file.Close()

			// Get the file size
			fileInfo, err := file.Stat()
			if err != nil {
				fmt.Println("Error getting file info:", err)
				// return
			}
			fileSize := fileInfo.Size()
			// Get the file content type
			buffer := make([]byte, 512)
			_, err = file.Read(buffer)
			if err != nil {
				fmt.Println("Error reading file:", err)
				// return
			}
			fileType := http.DetectContentType(buffer)
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

			imageUrls := []models.PostFile{{URL: "https://azepdfserver.s3.eu-central-1.amazonaws.com/" + document.FileName + ".pdf", PostId: post.Id, FileSize: fileSize, ContentType: fileType}}
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
