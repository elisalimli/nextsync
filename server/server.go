package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/elisalimli/go_graphql_template/domain"
	"github.com/elisalimli/go_graphql_template/graphql"
	"github.com/elisalimli/go_graphql_template/initializers"

	customMiddleware "github.com/elisalimli/go_graphql_template/middleware"
	"github.com/elisalimli/go_graphql_template/postgres"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/rs/cors"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDatabase()

	// if err := Migrations.Discover(sqlMigrations); err != nil {
	// panic(err)
	// }
	// if err := Migrations.Discover(sqlMigrations); err != nil {
	// panic(err)
	// }

}

const defaultPort = "4000"

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

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", graphql.DataloaderMiddleware(initializers.DB, srv))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))

}
