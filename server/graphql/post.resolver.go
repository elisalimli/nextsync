package graphql

import (
	"context"

	"github.com/elisalimli/nextsync/server/graphql/models"
	"github.com/elisalimli/nextsync/server/storage"
)

func (m *postResolver) Creator(ctx context.Context, obj *models.Post) (*models.User, error) {
	return storage.GetUser(ctx, obj.UserId)
}

func (m *postResolver) Files(ctx context.Context, obj *models.Post) ([]*models.PostFile, error) {
	return storage.GetPostFiles(ctx, obj.Id)
}

func (q *queryResolver) Posts(ctx context.Context, input models.PostsInput) (*models.PostsResponse, error) {
	return q.Domain.GetPosts(ctx, input)
}

func (q *queryResolver) Post(ctx context.Context, input models.PostInput) (*models.Post, error) {
	return q.Domain.GetPost(ctx, input)
}
