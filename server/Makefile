dev:
	go run github.com/99designs/gqlgen generate
	go run cmd/server/server.go
migrate_db:
	go run cmd/bun/cli.go db init
	go run cmd/bun/cli.go db migrate
 