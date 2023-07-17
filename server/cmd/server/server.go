package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	gqlgen "github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/elisalimli/nextsync/server/domain"
	"github.com/elisalimli/nextsync/server/graphql"
	"github.com/elisalimli/nextsync/server/graphql/models"
	"github.com/elisalimli/nextsync/server/initializers"
	"github.com/elisalimli/nextsync/server/storage"

	customMiddleware "github.com/elisalimli/nextsync/server/middleware"
	"github.com/elisalimli/nextsync/server/postgres"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/rs/cors"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDatabase()
}

const defaultPort = "4000"

func authDirective(ctx context.Context, obj interface{}, next gqlgen.Resolver) (res interface{}, err error) {

	if !models.CheckAuthenticated(ctx) {
		return nil, fmt.Errorf("Unauthenticated")
	}

	return next(ctx)
}

func main() {

	var mb int64 = 1 << 20

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}
	userRepo := postgres.UsersRepo{DB: initializers.DB, RedisClient: initializers.RedisClient}
	postsRepo := postgres.PostsRepo{DB: initializers.DB}

	router := chi.NewRouter()
	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4000"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler)

	router.Use(middleware.RequestID)
	router.Use(middleware.Logger)
	router.Use(customMiddleware.AuthMiddleware(userRepo))
	// for passing http writer, reader to context
	router.Use(customMiddleware.ContextMiddleware)

	d := domain.NewDomain(userRepo, postsRepo)

	c := graphql.Config{Resolvers: &graphql.Resolver{Domain: d}}
	c.Directives.Auth = authDirective

	srv := handler.New(graphql.NewExecutableSchema(c))
	srv.AddTransport(
		transport.SSE{}) // <---- This is the important

	// default server
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.MultipartForm{
		MaxMemory:     32 * mb,
		MaxUploadSize: 500 * mb,
	})
	srv.SetQueryCache(lru.New(1000))
	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New(100),
	})

	// loading data loaders
	dataLoaders := storage.NewLoaders(initializers.DB)
	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", storage.Middleware(dataLoaders, srv))
	router.Post("/create-post", d.CreatePost)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))

}
