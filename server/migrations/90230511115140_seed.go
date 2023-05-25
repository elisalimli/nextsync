package migrations

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/elisalimli/go_graphql_template/domain"
	"github.com/elisalimli/go_graphql_template/graphql/models"
	"github.com/elisalimli/go_graphql_template/initializers"
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

func createTag(name string, code string, post models.Post, ctx context.Context, catalogId string) {

	newTag := models.Tag{Name: name, Code: code, CatalogId: catalogId}
	err := initializers.DB.NewInsert().Model(&post).Scan(ctx)
	if err != sql.ErrNoRows {
		fmt.Println("Error occured", err)
	}
	initializers.DB.NewInsert().Model(&newTag).Scan(ctx)

	newGradePostTag := models.PostTag{PostId: post.Id, TagId: newTag.Id}
	err = initializers.DB.NewInsert().Model(&newGradePostTag).Scan(ctx)
	if err != sql.ErrNoRows {
		fmt.Println("Error occured", err)
	}
	initializers.DB.NewInsert().Model(&newTag).Scan(ctx)

}

func init() {

	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {

		catalogGrade := models.Catalog{}
		err := initializers.DB.NewSelect().Model(&catalogGrade).Where("? = ?", bun.Ident("code"), "grade").Scan(ctx)
		if err != nil {
			log.Fatalf("error occured: %v", err)
			return nil
		}

		catalogVariant := models.Catalog{}
		err = initializers.DB.NewSelect().Model(&catalogGrade).Where("? = ?", bun.Ident("code"), "variant").Scan(ctx)
		if err != nil {
			log.Fatalf("error occured: %v", err)
			return nil
		}

		catalogType := models.Catalog{}
		err = initializers.DB.NewSelect().Model(&catalogGrade).Where("? = ?", bun.Ident("code"), "type").Scan(ctx)
		if err != nil {
			log.Fatalf("error occured: %v", err)
			return nil
		}

		user := models.User{
			Username:       "admin",
			Email:          os.Getenv("USER_ADMIN_Email"),
			SocialLogin:    false,
			SocialProvider: "Google",
			PhoneNumber:    os.Getenv("USER_ADMIN_PhoneNumber"),
		}
		err = user.HashPassword("admin")
		if err != nil {
			log.Fatalf("error while hashing password: %v", err)
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
			err = initializers.DB.NewInsert().Model(&post).Scan(ctx)

			if err != nil {
				fmt.Println("Error occured", err)
			}

			if document.CodeGrade != nil && document.Grade != nil {
				createTag(*document.Grade, *document.CodeGrade, post, ctx, catalogGrade.Id)
			}

			if document.CodeType != nil && document.Type != nil {
				createTag(*document.Type, *document.CodeType, post, ctx, catalogType.Id)
			}

			if document.CodeVariant != nil && document.Variant != nil {
				createTag(*document.Variant, *document.CodeVariant, post, ctx, catalogVariant.Id)
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
