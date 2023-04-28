package graphql

import (
	"context"
	"errors"

	"github.com/elisalimli/go_graphql_template/domain"
	"github.com/elisalimli/go_graphql_template/graphql/models"
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

	return m.Domain.CreatePost(ctx, input)
}
func (r *queryResolver) Posts(ctx context.Context) ([]*models.Post, error) {
	// var result []*models.Post
	posts := make([]*models.Post, 0)
	rows, err := r.Domain.PostsRepo.DB.QueryContext(ctx, `SELECT p.* ,json_agg(json_build_object('id', pf.id, 'post_id', pf.post_id, 'url', pf.url)) AS "files" FROM "posts" p JOIN post_files pf ON pf.post_id = p.id GROUP BY p."id"`)
	if err != nil {
		panic(err)
	}

	err = r.Domain.PostsRepo.DB.ScanRows(ctx, rows, &posts)
	if err != nil {
		return nil, errors.New(domain.ErrSomethingWentWrong)
	}
	return posts, nil
}
