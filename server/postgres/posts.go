package postgres

import (
	"context"
	"fmt"

	"github.com/elisalimli/nextsync/server/graphql/models"
	"github.com/uptrace/bun"
)

type PostsRepo struct {
	DB *bun.DB
}

// func (u *PostsRepo) GetUserByField(field, value string) (*models.User, error) {
// 	var user models.User
// 	err := u.DB.Where(field+" = ?", value).First(&user).Error
// 	if err != nil {
// 		return nil, err
// 	}
// 	return &user, nil
// }

// func (u *UsersRepo) GetUserByID(id string) (*models.User, error) {
// 	return u.GetUserByField("id", id)
// }

// func (u *UsersRepo) GetUserByEmail(email string) (*models.User, error) {
// 	return u.GetUserByField("email", email)
// }

// func (u *UsersRepo) GetUserByUsername(username string) (*models.User, error) {
// 	return u.GetUserByField("username", username)
// }

func (p *PostsRepo) CreatePost(ctx context.Context, post *models.Post) error {
	res, err := p.DB.NewInsert().Model(post).Exec(ctx)

	fmt.Println("create post", res, err)
	return err
}
