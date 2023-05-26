package graphql

import (
	"context"
	"errors"
	"fmt"

	"github.com/99designs/gqlgen/graphql"
	"github.com/elisalimli/go_graphql_template/domain"
	"github.com/elisalimli/go_graphql_template/graphql/models"
	customMiddleware "github.com/elisalimli/go_graphql_template/middleware"
	"github.com/elisalimli/go_graphql_template/storage"
	"github.com/elisalimli/go_graphql_template/validator"
	"github.com/uptrace/bun"
	"github.com/vektah/gqlparser/v2/gqlerror"
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

func (m *mutationResolver) CreatePost(ctx context.Context, input models.CreatePostInput) (*models.CreatePostResponse, error) {
	// fmt.Println("create post", input.SecondLanguage)
	currentUserId, _ := ctx.Value(customMiddleware.CurrentUserIdKey).(string)

	if currentUserId == "TOKEN_EXPIRED" {
		graphql.AddError(ctx, &gqlerror.Error{
			Path:    graphql.GetPath(ctx),
			Message: "Unauthorized: Token has expired",
			Extensions: map[string]interface{}{
				"code": "UNAUTHENTICATED",
			},
		})

		return nil, nil
	}
	isValid, errors := validation(ctx, input)

	if !isValid {
		return &models.CreatePostResponse{Ok: false, Errors: errors}, nil
	}

	for _, k := range input.Files {
		if k.File.ContentType != "application/pdf" && k.File.ContentType != "image/png" && k.File.ContentType != "image/jpeg" {
			return &models.CreatePostResponse{Ok: false, Errors: []*validator.FieldError{{Field: "files", Message: "Unsupported file types"}}}, nil
		}
	}
	return m.Domain.CreatePost(ctx, input)
}
func (r *queryResolver) Posts(ctx context.Context, input models.PostsInput) ([]*models.Post, error) {
	realLimitPlusOne := *input.Limit + 1
	posts := make([]*models.Post, 0)
	q := r.Domain.PostsRepo.DB.NewSelect().Model(&posts).Column("post.*").
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
		Order("post.created_at DESC").
		Limit(realLimitPlusOne)

	if input.Cursor != nil {
		q = q.Where("post.created_at < ?", input.Cursor)
	}
	// filtering by tag ids
	if input.TagIds != nil {
		q = q.Where("pt.tag_id IN (?)", bun.In(input.TagIds)).Having(fmt.Sprintf("COUNT(DISTINCT pt.tag_id) = %d", len(input.TagIds)))
	}

	err := q.Scan(ctx)

	if err != nil {
		fmt.Println("Error occured:", err)
		return nil, errors.New(domain.ErrSomethingWentWrong)
	}

	// TODO: slice array has more
	return posts, nil
}
