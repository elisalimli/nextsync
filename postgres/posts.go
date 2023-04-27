package postgres

import (
	"github.com/elisalimli/go_graphql_template/graphql/models"
	"gorm.io/gorm"
)

type PostsRepo struct {
	DB *gorm.DB
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

func (p *PostsRepo) CreatePost(post *(models.Post)) error {
	result := p.DB.Create(post)
	return result.Error
}
