//go:generate go run github.com/99designs/gqlgen -v

package graphql

import (
	"github.com/elisalimli/nextsync/server/domain"
)

type Resolver struct {
	Domain *domain.Domain
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }
func (r *Resolver) Post() PostResolver   { return &postResolver{r} }

type postResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
