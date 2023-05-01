package graphql

import (
	"context"
	"errors"

	"github.com/elisalimli/go_graphql_template/domain"
	"github.com/elisalimli/go_graphql_template/graphql/models"
	"github.com/elisalimli/go_graphql_template/validator"
)

func (m *postResolver) Creator(ctx context.Context, obj *models.Post) (*models.User, error) {

	user, err := m.Domain.UsersRepo.GetUserByID(ctx, obj.UserId)
	// TODO: add dataloader
	if err != nil {
		return nil, errors.New(domain.ErrSomethingWentWrong)
	}

	return user, nil
}

func (m *mutationResolver) CreatePost(ctx context.Context, input models.CreatePostInput) (*models.CreatePostResponse, error) {
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
func (r *queryResolver) Posts(ctx context.Context) ([]*models.Post, error) {
	// var result []*models.Post
	posts := make([]*models.Post, 0)
	rows, err := r.Domain.PostsRepo.DB.QueryContext(ctx, `SELECT p.* ,json_agg(json_build_object('id', pf.id, 'postId', pf.post_id, 'url', pf.url, 'contentType', pf.content_type)) AS "files" FROM "posts" p JOIN post_files pf ON pf.post_id = p.id GROUP BY p."id"`)
	if err != nil {
		panic(err)
	}

	err = r.Domain.PostsRepo.DB.ScanRows(ctx, rows, &posts)
	if err != nil {
		return nil, errors.New(domain.ErrSomethingWentWrong)
	}
	return posts, nil
}
