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
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (m *postResolver) Creator(ctx context.Context, obj *models.Post) (*models.User, error) {

	// return getUserLoader(ctx).Load(obj.UserId)
	return storage.GetUser(ctx, obj.UserId)

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
	// var result []*models.Post
	posts := make([]*models.Post, 0)
	q := r.Domain.PostsRepo.DB.NewSelect().Model(&posts).ColumnExpr("post.*").ColumnExpr(`json_agg(json_build_object('id', pf.id, 'postId', pf.post_id, 'url', pf.url, 'contentType', pf.content_type,'fileSize', pf.file_size, 'fileName', pf.file_name)) AS "files"`).Join(`JOIN post_files AS pf ON pf.post_id = post.id`).Group(`post.id`).Order("post.created_at DESC").Limit(realLimitPlusOne)
	if input.Cursor != nil {
		q = q.Where("post.created_at < ?", input.Cursor)
	}
	err := q.Scan(ctx)

	if err != nil {
		fmt.Println("Error occured:", err)
		return nil, errors.New(domain.ErrSomethingWentWrong)
	}
	return posts, nil
}
