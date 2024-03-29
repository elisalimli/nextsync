package migrations

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/elisalimli/nextsync/server/domain"
	"github.com/elisalimli/nextsync/server/graphql/models"
	"github.com/elisalimli/nextsync/server/initializers"
	"github.com/elisalimli/nextsync/server/postgres"
	"github.com/uptrace/bun"
)

type Document struct {
	Text        string  `json:"text"`
	Date        string  `json:"date"`
	FileName    string  `json:"fileName"`
	Variant     *string `json:"variant"`
	CodeVariant *string `json:"code_variant"`
	Grade       *string `json:"grade"`
	CodeGrade   *string `json:"code_grade"`
	Type        *string `json:"type"`
	CodeType    *string `json:"code_type"`
	ContentType string  `json:"contentType"`
	FileSize    int64   `json:"fileSize"`
}

func CreatePostTag(db *bun.DB, ctx context.Context, code string, post *models.Post) {
	tagsRepo := postgres.TagsRepo{DB: db}

	tag, err := tagsRepo.GetTagId(ctx, "code", code)
	if err != nil {
		fmt.Println("Database error get tag", err)
	}
	postTag := models.PostTag{PostId: post.Id, TagId: tag.Id}
	_, err = initializers.DB.NewInsert().Model(&postTag).Returning("NULL").Exec(ctx)

	if err != nil {
		fmt.Println("Error occured", err)
	}
}

func init() {

	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		user := models.User{
			Username:       "admin",
			Email:          os.Getenv("USER_ADMIN_EMAIL"),
			SocialLogin:    false,
			SocialProvider: "Google",
			PhoneNumber:    os.Getenv("USER_ADMIN_PHONE_NUMBER"),
		}
		err := user.HashPassword("admin")
		if err != nil {
			log.Fatalf("error while hashing password: %v", err)
			return nil
		}

		initializers.DB.NewInsert().Model(&user).Returning("*").Exec(ctx)

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
			return nil
		}
		defer file.Close()

		// Create a slice of Person to hold the decoded objects
		var documents []Document

		// Decode the JSON file into the slice of Person objects
		decoder := json.NewDecoder(file)
		err = decoder.Decode(&documents)
		if err != nil {
			fmt.Println("Error decoding JSON:", err)
			return nil
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
				UserId:      user.Id,
			}
			ctx := context.Background()
			_, err = initializers.DB.NewInsert().Model(&post).Returning("id").Exec(ctx)

			if err != nil {
				fmt.Println("Error occured", err)
			}

			if document.CodeGrade != nil && document.Grade != nil {
				CreatePostTag(db, ctx, *document.CodeGrade, &post)
			}

			if document.CodeType != nil && document.Type != nil {
				CreatePostTag(db, ctx, *document.CodeType, &post)
			}

			if document.CodeVariant != nil && document.Variant != nil {
				CreatePostTag(db, ctx, *document.CodeVariant, &post)
			}

			imageUrls := []models.PostFile{{URL: fmt.Sprintf("https://%s.s3.%s.amazonaws.com/", domain.BucketName, domain.BucketRegion) + document.FileName, PostId: post.Id, FileSize: document.FileSize, ContentType: document.ContentType, FileName: "sinaq.pdf"}}
			_, err = initializers.DB.NewInsert().Model(&imageUrls).Returning("NULL").Exec(ctx)
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
