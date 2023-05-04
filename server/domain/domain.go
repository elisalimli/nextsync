package domain

import (
	"github.com/elisalimli/go_graphql_template/graphql/models"
	"github.com/elisalimli/go_graphql_template/postgres"
	"github.com/elisalimli/go_graphql_template/validator"
)

var (
	GeneralErrorFieldCode = "root.serverError"
	ErrBadCredentials     = ("email/password combination don't work")
	ErrSomethingWentWrong = ("something went wrong")
)

type Domain struct {
	UsersRepo postgres.UsersRepo
	PostsRepo postgres.PostsRepo
}

func NewDomain(usersRepo postgres.UsersRepo, postsRepo postgres.PostsRepo) *Domain {
	return &Domain{UsersRepo: usersRepo, PostsRepo: postsRepo}
}

type Ownable interface {
	IsOwner(user *models.User) bool
}

// common graphql error boilerplate
func NewFieldError(err validator.FieldError) *models.AuthResponse {
	return &models.AuthResponse{Ok: false, Errors: []*validator.FieldError{{Message: err.Message, Field: err.Field}}}
}
