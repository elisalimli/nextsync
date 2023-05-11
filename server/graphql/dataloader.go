package graphql

import (
	"context"
	"net/http"
	"time"

	"github.com/elisalimli/go_graphql_template/graphql/models"
	"github.com/uptrace/bun"
)

const userloaderKey = "userloader"

func DataloaderMiddleware(db *bun.DB, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userloader := UserLoader{
			maxBatch: 100,
			wait:     1 * time.Millisecond,
			fetch: func(ids []string) ([]*models.User, []error) {
				var users []*models.User

				err := db.NewSelect().Model(&users).Where("id in (?)", bun.In(ids)).Scan(context.Background())

				if err != nil {
					return nil, []error{err}
				}

				u := make(map[string]*models.User, len(users))

				for _, user := range users {
					u[user.Id] = user
				}

				result := make([]*models.User, len(ids))

				for i, id := range ids {
					result[i] = u[id]
				}

				return result, nil
			},
		}

		ctx := context.WithValue(r.Context(), userloaderKey, &userloader)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func getUserLoader(ctx context.Context) *UserLoader {
	return ctx.Value(userloaderKey).(*UserLoader)
}
