package graphql

import (
	"context"
	"errors"
	"fmt"

	"github.com/elisalimli/nextsync/server/domain"
	"github.com/elisalimli/nextsync/server/graphql/models"
)

func (r *queryResolver) Tags(ctx context.Context) ([]*models.Tag, error) {
	tags := make([]*models.Tag, 0)
	q := r.Domain.PostsRepo.DB.NewSelect().Model(&tags).Column(`tag.*`).
		ColumnExpr("json_build_object('id', c.id,'name', c.name,'code', c.code) as catalog").
		Join("LEFT JOIN catalogs c ON tag.catalog_id = c.id")

	err := q.Scan(ctx)

	if err != nil {
		fmt.Println("Error occured:", err)
		return nil, errors.New(domain.ErrSomethingWentWrong)
	}

	return tags, nil
}
