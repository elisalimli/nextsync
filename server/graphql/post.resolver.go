package graphql

import (
	"context"

	"github.com/elisalimli/nextsync/server/domain"
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

func (q *mutationResolver) DeletePost(ctx context.Context, input models.DeletePostInput) (*models.FormResponse, error) {
	isValid, errors := domain.Validation(ctx, input)
	if !isValid {
		return &models.FormResponse{Ok: false, Errors: errors}, nil
	}

	return q.Domain.DeletePost(ctx, input)
}
