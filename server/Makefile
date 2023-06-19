dev:
	go run cmd/server/server.go
migrate_db:
	go run cmd/bun/cli.go db init
	go run cmd/bun/cli.go db migrate
 
deploy:
	docker buildx build --platform linux/amd64 -t alisalim17/nextsyncapi:latest .
	docker push alisalim17/nextsyncapi:latest
	scp docker-compose.yml .env.prod root@104.248.245.135:~/
	ssh root@104.248.245.135 "docker pull alisalim17/nextsyncapi:latest && docker-compose up -d"
	
	
 