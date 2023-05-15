package storage

import (
	"context"
	"fmt"
	"net/http"

	"github.com/elisalimli/go_graphql_template/graphql/models"
	"github.com/graph-gophers/dataloader"
	"github.com/uptrace/bun"
)

//
// import graph gophers with your other imports

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
)

// UserReader reads Users from a database
type UserReader struct {
	conn *bun.DB
}

// GetUsers implements a batch function that can retrieve many users by ID,
// for use in a dataloader
func (u *UserReader) GetUsers(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	// read all requested users in a single query

	var users []*models.User
	userIDs := make([]string, len(keys))
	for ix, key := range keys {
		userIDs[ix] = key.String()
	}
	err := u.conn.NewSelect().Model(&users).Where("id in (?)", bun.In(userIDs)).Scan(context.Background())

	if err != nil {
		return nil
	}

	userById := make(map[string]*models.User, len(users))

	for _, user := range users {
		userById[user.Id] = user
	}

	// return users in the same order requested
	output := make([]*dataloader.Result, len(keys))
	for index, userKey := range keys {
		user, ok := userById[userKey.String()]
		if ok {
			output[index] = &dataloader.Result{Data: user, Error: nil}
		} else {
			err := fmt.Errorf("user not found %s", userKey.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output
}

// Loaders wrap your data loaders to inject via middleware
type Loaders struct {
	UserLoader *dataloader.Loader
}

// NewLoaders instantiates data loaders for the middleware
func NewLoaders(conn *bun.DB) *Loaders {
	// define the data loader
	userReader := &UserReader{conn: conn}
	loaders := &Loaders{
		UserLoader: dataloader.NewBatchedLoader(userReader.GetUsers),
	}
	return loaders
}

// Middleware injects data loaders into the context
func Middleware(loaders *Loaders, next http.Handler) http.Handler {
	// return a middleware that injects the loader to the request context
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nextCtx := context.WithValue(r.Context(), loadersKey, loaders)
		r = r.WithContext(nextCtx)

		next.ServeHTTP(w, r)
	})
}

// For returns the dataloader for a given context
func For(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey).(*Loaders)
}

// GetUser wraps the User dataloader for efficient retrieval by user ID
func GetUser(ctx context.Context, userID string) (*models.User, error) {
	loaders := For(ctx)
	thunk := loaders.UserLoader.Load(ctx, dataloader.StringKey(userID))
	result, err := thunk()
	if err != nil {
		return nil, err
	}
	return result.(*models.User), nil
}
