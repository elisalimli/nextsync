package postgres

import (
	"context"

	"github.com/elisalimli/nextsync/server/graphql/models"
	"github.com/redis/go-redis/v9"
	"github.com/uptrace/bun"
)

type UsersRepo struct {
	DB          *bun.DB
	RedisClient *redis.Client
}

func (u *UsersRepo) GetUserByField(ctx context.Context, field, value string) (*models.User, error) {
	user := models.User{}
	err := u.DB.NewSelect().Model(&user).Where("? = ?", bun.Ident(field), value).Scan(ctx)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (u *UsersRepo) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	return u.GetUserByField(ctx, "id", id)
}

func (u *UsersRepo) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	return u.GetUserByField(ctx, "email", email)
}

func (u *UsersRepo) GetUserByUsername(ctx context.Context, username string) (*models.User, error) {
	return u.GetUserByField(ctx, "username", username)
}

func (u *UsersRepo) CreateUser(ctx context.Context, user *(models.User)) error {
	_, err := u.DB.NewInsert().Model(user).Exec(ctx)
	return err
}
