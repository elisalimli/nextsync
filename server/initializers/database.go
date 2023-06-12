package initializers

import (
	"database/sql"
	"log"
	"os"

	"github.com/elisalimli/nextsync/server/graphql/models"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
)

var DB *bun.DB

func ConnectToDatabase() {
	var err error
	dsn := os.Getenv("POSTGRESQL_URL")

	// dsn := "unix://user:pass@dbname/var/run/postgresql/.s.PGSQL.5432"
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))

	DB = bun.NewDB(sqldb, pgdialect.New())

	if err != nil {
		log.Fatal("Failed to connect to the Database! \n", err.Error())
		os.Exit(1)
	}

	DB.AddQueryHook(bundebug.NewQueryHook(bundebug.WithVerbose(true)))

	// Register many to many model so bun can better recognize m2m relation.
	// This should be done before you use the model for the first time.
	DB.RegisterModel((*models.PostTag)(nil))

	// logger := logrus.New()

	// DB.AddQueryHook(logrusbun.NewQueryHook(logrusbun.QueryHookOptions{
	// 	LogSlow:         time.Second,
	// 	Logger:          logger,
	// 	QueryLevel:      logrus.DebugLevel,
	// 	ErrorLevel:      logrus.ErrorLevel,
	// 	SlowLevel:       logrus.WarnLevel,
	// 	MessageTemplate: "{{.Operation}}[{{.Duration}}]: {{.Query}}",
	// 	ErrorTemplate:   "{{.Operation}}[{{.Duration}}]: {{.Query}}: {{.Error}}",
	// }))
	// bundebug.NewQueryHook(bundebug.WithVerbose(true))

	// DB.AddQueryHook(logrusbun.NewQueryHook(logrusbun.QueryHookOptions{Logger: log}))

	// DB.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
	// DB.Logger = logger.Default.LogMode(logger.Info)

	// DB.AutoMigrate(&models.User{}, &models.Post{}, &models.Post_File{})

	log.Println("🚀 Connected Successfully to the Database")

	if err != nil {
		log.Fatal("Failed to connect a database.")
	}
}
