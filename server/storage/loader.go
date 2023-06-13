package storage

import (
	"context"
	"fmt"
	"net/http"

	"github.com/elisalimli/nextsync/server/graphql/models"
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

// PostFilesReader reads Users from a database
type PostFilesReader struct {
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

// GetUsers implements a batch function that can retrieve man// PostFilesLoader implements a batch function that can retrieve many postFiles by post ID,
// for use in a dataloader
func (p *PostFilesReader) GetPostsFiles(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	// Read all requested postFiles in a single query

	var postFiles []*models.PostFile
	postIDs := make([]string, len(keys))
	for ix, key := range keys {
		postID := key.String()
		postIDs[ix] = postID
	}
	err := p.conn.NewSelect().Model(&postFiles).Where("post_id in (?)", bun.In(postIDs)).Scan(context.Background())

	if err != nil {
		return nil
	}

	postFilesByPostID := make(map[string][]*models.PostFile, len(postFiles))

	for _, postFile := range postFiles {
		postFilesByPostID[postFile.PostId] = append(postFilesByPostID[postFile.PostId], postFile)
	}

	// Return postFiles in the same order as requested
	output := make([]*dataloader.Result, len(keys))
	for index, postKey := range keys {
		postID := postKey.String()
		files, ok := postFilesByPostID[postID]
		if ok {
			output[index] = &dataloader.Result{Data: files, Error: nil}
		} else {
			output[index] = &dataloader.Result{Data: []*models.PostFile{}, Error: nil}
		}
	}
	return output
}

// Loaders wrap your data loaders to inject via middleware
type Loaders struct {
	UserLoader      *dataloader.Loader
	PostFilesLoader *dataloader.Loader
}

// NewLoaders instantiates data loaders for the middleware
func NewLoaders(conn *bun.DB) *Loaders {
	// define the data loader
	userReader := &UserReader{conn: conn}
	postFilesReader := &PostFilesReader{conn: conn}
	loaders := &Loaders{
		UserLoader:      dataloader.NewBatchedLoader(userReader.GetUsers),
		PostFilesLoader: dataloader.NewBatchedLoader(postFilesReader.GetPostsFiles),
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

// GetUser wraps the User dataloader for efficient retrieval by user ID
func GetPostFiles(ctx context.Context, postId string) ([]*models.PostFile, error) {
	loaders := For(ctx)
	thunk := loaders.PostFilesLoader.Load(ctx, dataloader.StringKey(postId))
	result, err := thunk()
	if err != nil {
		return nil, err
	}
	return result.([]*models.PostFile), nil
}
