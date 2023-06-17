package graphql

import (
	"context"
	"errors"
	"fmt"

	"github.com/elisalimli/nextsync/server/domain"
	"github.com/elisalimli/nextsync/server/graphql/models"
	"github.com/elisalimli/nextsync/server/storage"
	"github.com/uptrace/bun"
)

func (m *postResolver) Creator(ctx context.Context, obj *models.Post) (*models.User, error) {
	// return getUserLoader(ctx).Load(obj.UserId)
	return storage.GetUser(ctx, obj.UserId)
}

func (m *postResolver) Files(ctx context.Context, obj *models.Post) ([]*models.PostFile, error) {
	// return getUserLoader(ctx).Load(obj.UserId)
	// return []*models.PostFile{&models.PostFile{Id: "sads"}}, nil

	return storage.GetPostFiles(ctx, obj.Id)
}

func (r *queryResolver) Posts(ctx context.Context, input models.PostsInput) (*models.PostsResponse, error) {
	fmt.Println("posts query trigged!!")
	realLimitPlusOne := *input.Limit + 1
	posts := make([]*models.Post, 0)
	q := r.Domain.PostsRepo.DB.NewSelect().Model(&posts).
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
		subq := r.Domain.PostsRepo.DB.NewSelect().Model((*models.PostTag)(nil)).
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
		return nil, errors.New(domain.ErrSomethingWentWrong)
	}

	hasMore := len(posts) == realLimitPlusOne
	fmt.Println("has more ", hasMore, len(posts), realLimitPlusOne)
	if hasMore {
		posts = posts[:len(posts)-1]
	}

	// TODO: lice array has more
	return &models.PostsResponse{HasMore: hasMore, Posts: posts}, nil
}

func (r *queryResolver) Post(ctx context.Context, input models.PostInput) (*models.Post, error) {
	fmt.Println("posts query trigged!!")
	post := models.Post{}
	q := r.Domain.PostsRepo.DB.NewSelect().Model(&post).
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
		return nil, errors.New(domain.ErrSomethingWentWrong)
	}

	// TODO: lice array has more
	return &post, nil
}
