package domain

import (
	"github.com/elisalimli/nextsync/server/graphql/models"
	"github.com/elisalimli/nextsync/server/postgres"
	"github.com/elisalimli/nextsync/server/validator"
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
