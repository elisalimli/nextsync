package postgres

import (
	"context"
	"fmt"

	"github.com/elisalimli/nextsync/server/graphql/models"
	"github.com/uptrace/bun"
)

type PostsRepo struct {
	DB *bun.DB
}

func (p *PostsRepo) CreatePost(ctx context.Context, post *models.Post) error {
	res, err := p.DB.NewInsert().Model(post).Exec(ctx)

	fmt.Println("create post", res, err)
	return err
}
