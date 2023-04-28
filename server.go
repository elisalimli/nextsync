package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/elisalimli/go_graphql_template/domain"
	"github.com/elisalimli/go_graphql_template/graphql"
	"github.com/elisalimli/go_graphql_template/initializers"
	"github.com/elisalimli/go_graphql_template/migrations"
	"github.com/uptrace/bun/migrate"
	"github.com/urfave/cli/v2"

	customMiddleware "github.com/elisalimli/go_graphql_template/middleware"
	"github.com/elisalimli/go_graphql_template/postgres"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/rs/cors"
)

var Migrations = migrate.NewMigrations()

func newDBCommand(migrator *migrate.Migrator) *cli.Command {
	return &cli.Command{
		Name:  "db",
		Usage: "database migrations",
		Subcommands: []*cli.Command{
			{
				Name:  "init",
				Usage: "create migration tables",
				Action: func(c *cli.Context) error {
					return migrator.Init(c.Context)
				},
			},
			{
				Name:  "migrate",
				Usage: "migrate database",
				Action: func(c *cli.Context) error {
					if err := migrator.Lock(c.Context); err != nil {
						return err
					}
					defer migrator.Unlock(c.Context) //nolint:errcheck

					group, err := migrator.Migrate(c.Context)
					if err != nil {
						return err
					}
					if group.IsZero() {
						fmt.Printf("there are no new migrations to run (database is up to date)\n")
						return nil
					}
					fmt.Printf("migrated to %s\n", group)
					return nil
				},
			},
			{
				Name:  "rollback",
				Usage: "rollback the last migration group",
				Action: func(c *cli.Context) error {
					if err := migrator.Lock(c.Context); err != nil {
						return err
					}
					defer migrator.Unlock(c.Context) //nolint:errcheck

					group, err := migrator.Rollback(c.Context)
					if err != nil {
						return err
					}
					if group.IsZero() {
						fmt.Printf("there are no groups to roll back\n")
						return nil
					}
					fmt.Printf("rolled back %s\n", group)
					return nil
				},
			},
			{
				Name:  "lock",
				Usage: "lock migrations",
				Action: func(c *cli.Context) error {
					return migrator.Lock(c.Context)
				},
			},
			{
				Name:  "unlock",
				Usage: "unlock migrations",
				Action: func(c *cli.Context) error {
					return migrator.Unlock(c.Context)
				},
			},
			{
				Name:  "create_go",
				Usage: "create Go migration",
				Action: func(c *cli.Context) error {
					name := strings.Join(c.Args().Slice(), "_")
					mf, err := migrator.CreateGoMigration(c.Context, name)
					if err != nil {
						return err
					}
					fmt.Printf("created migration %s (%s)\n", mf.Name, mf.Path)
					return nil
				},
			},
			{
				Name:  "create_sql",
				Usage: "create up and down SQL migrations",
				Action: func(c *cli.Context) error {
					name := strings.Join(c.Args().Slice(), "_")
					files, err := migrator.CreateSQLMigrations(c.Context, name)
					if err != nil {
						return err
					}

					for _, mf := range files {
						fmt.Printf("created migration %s (%s)\n", mf.Name, mf.Path)
					}

					return nil
				},
			},
			{
				Name:  "status",
				Usage: "print migrations status",
				Action: func(c *cli.Context) error {
					ms, err := migrator.MigrationsWithStatus(c.Context)
					if err != nil {
						return err
					}
					fmt.Printf("migrations: %s\n", ms)
					fmt.Printf("unapplied migrations: %s\n", ms.Unapplied())
					fmt.Printf("last migration group: %s\n", ms.LastGroup())
					return nil
				},
			},
			{
				Name:  "mark_applied",
				Usage: "mark migrations as applied without actually running them",
				Action: func(c *cli.Context) error {
					group, err := migrator.Migrate(c.Context, migrate.WithNopMigration())
					if err != nil {
						return err
					}
					if group.IsZero() {
						fmt.Printf("there are no new migrations to mark as applied\n")
						return nil
					}
					fmt.Printf("marked as applied %s\n", group)
					return nil
				},
			},
		},
	}
}

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

	app := &cli.App{
		Name: "bun",

		Commands: []*cli.Command{
			newDBCommand(migrate.NewMigrator(initializers.DB, migrations.Migrations)),
		},
	}
	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
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
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))

}

// func uploadProgress(w http.ResponseWriter, r *http.Request) {
// 	mr, err := r.MultipartReader()
// 	if err != nil {
// 		fmt.Fprintln(w, err)
// 		return
// 	}

// 	length := r.ContentLength
// 	progress := float64(0)
// 	lastProgressSent := float64(0)

// 	// Set the response headers for Server-Sent Events
// 	w.Header().Set("Content-Type", "text/event-stream")
// 	w.Header().Set("Cache-Control", "no-cache")
// 	w.Header().Set("Connection", "keep-alive")

// 	// Send an initial progress update to the client
// 	fmt.Fprintf(w, "data: %v\n\n", progress)

// 	for {
// 		var read int64
// 		part, err := mr.NextPart()

// 		if err == io.EOF {
// 			fmt.Printf("\nDone!")
// 			break
// 		}

// 		dst, err := os.OpenFile("a.pdf", os.O_WRONLY|os.O_CREATE, 0666)

// 		if err != nil {
// 			return
// 		}

// 		for {
// 			buffer := make([]byte, 100000)
// 			cBytes, err := part.Read(buffer)
// 			if err == io.EOF {
// 				fmt.Printf("\nLast buffer read!")
// 				break
// 			}

// 			read += int64(cBytes)
// 			if read > 0 {
// 				newProgress := float64(read) / float64(length) * 100

// 				// Send a progress update to the client if it's divisible by 20
// 				if int(newProgress/5) > int(lastProgressSent/5) {
// 					lastProgressSent = newProgress
// 					fmt.Fprintf(w, "data: %v\n\n", newProgress)
// 				}

// 				dst.Write(buffer[0:cBytes])
// 			} else {
// 				break
// 			}
// 		}
// 	}
// }
