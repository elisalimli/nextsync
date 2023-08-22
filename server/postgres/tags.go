package postgres

import (
	"context"

	"github.com/elisalimli/nextsync/server/graphql/models"
	"github.com/uptrace/bun"
)

type TagsRepo struct {
	DB *bun.DB
}

func (p *TagsRepo) GetTagByField(ctx context.Context, field, value string) (*models.Tag, error) {
	tag := models.Tag{}
	err := p.DB.NewSelect().Model(&tag).Where("? = ?", bun.Ident(field), value).Scan(ctx)
	if err != nil {
		return nil, err
	}
	return &tag, nil
}

func (p *TagsRepo) GetTagId(ctx context.Context, field, value string) (*models.Tag, error) {
	user := models.Tag{}
	err := p.DB.NewSelect().Model(&user).ColumnExpr("id").Where("? = ?", bun.Ident(field), value).Scan(ctx)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
