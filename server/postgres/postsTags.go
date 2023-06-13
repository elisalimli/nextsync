package postgres

import (
	"context"
	"fmt"

	"github.com/elisalimli/nextsync/server/graphql/models"
	"github.com/elisalimli/nextsync/server/initializers"
	"github.com/uptrace/bun"
)

type PostTagsRepo struct {
	DB *bun.DB
}

func (p *PostTagsRepo) CreatePostTag(ctx context.Context, postTag *models.PostTag) {
	// tag := models.Tag{}
	// err := initializers.DB.NewSelect().ColumnExpr("id").Model(&tag).Where("? = ?", bun.Ident("code"), code).Scan(ctx)
	// if err != nil {
	// 	fmt.Printf("error occured: %v", err)
	// }

	_, err := initializers.DB.NewInsert().Model(&postTag).Returning("NULL").Exec(ctx)

	if err != nil {
		fmt.Println("Error occured", err)
	}
}
