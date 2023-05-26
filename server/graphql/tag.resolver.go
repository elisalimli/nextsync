package graphql

import (
	"context"
	"errors"
	"fmt"

	"github.com/elisalimli/go_graphql_template/domain"
	"github.com/elisalimli/go_graphql_template/graphql/models"
)

func (r *queryResolver) Tags(ctx context.Context) ([]*models.Tag, error) {
	tags := make([]*models.Tag, 0)
	q := r.Domain.PostsRepo.DB.NewSelect().Model(&tags).Column(`tag.*`)

	err := q.Scan(ctx)

	if err != nil {
		fmt.Println("Error occured:", err)
		return nil, errors.New(domain.ErrSomethingWentWrong)
	}

	return tags, nil
}
