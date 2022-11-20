#!/bin/bash

HOST=host.docker.internal

# Docker Network 실행
if [ -z "$(sudo docker network ls | grep www)" ]; then
    sudo docker network create -d bridge www
fi

# Nginx
if [ -z "$(sudo docker ps | grep proxy)" ]; then
  sudo docker rm -f proxy
  sudo docker run -d \
                  --pull=always \
                  -p 443:443 \
                  --name proxy \
                  --add-host ${HOST}:host-gateway \
                  --restart=unless-stopped \
                  -v /home/ubuntu/log:/var/log/nginx/ \
                  qwp1216/blog-server-proxy
fi


# Redis 실행
if [ -z "$(sudo docker ps | grep redis)" ]; then
  sudo docker rm -f redis
  sudo docker run -d \
                  -p 6379:6379 \
                  -v /home/ubuntu/redis-data:/data \
                  --name redis \
                  --net www \
                  --restart=always \
                  redis
fi


# Blue-Green
if [ -z "$(sudo docker ps | grep blue)" ]; then
  PREVIOUS="green"
  CURRENT="blue"
  PORT="8080"
else
  PREVIOUS="blue"
  CURRENT="green"
  PORT="8081"
fi

sudo docker run -d \
                --pull=always \
                -p ${PORT}:3001 \
                --name web-server-${CURRENT} \
                --net www \
                --restart=unless-stopped \
                qwp1216/blog-server

sleep 10

EXISTS_CURRENT=$(curl -I localhost:${PORT} |& grep HTTP)

if [ -z "$EXISTS_CURRENT" ]; then
  sudo docker rm -f web-server-${CURRENT}
  exit 1
else
  sudo docker stop web-server-${PREVIOUS}
  sudo docker rm web-server-${PREVIOUS}
fi


sudo docker images --quiet --filter=dangling=true | sudo xargs --no-run-if-empty docker rmi