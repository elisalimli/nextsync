# docker:
# 	cp ../server/.env ./ \
       
    

# docker-run:
#     docker run nextsync_cornjob
# .PHONY=docker
# modsync:

modsync:
	cp ../server/.env ./
	go mod vendor
	docker build -t nextsync_cornjob .
