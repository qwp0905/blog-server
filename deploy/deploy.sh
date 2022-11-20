#!/bin/bash

HOST=host.docker.internal
NGINX_CONF=/etc/nginx/nginx.conf

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
  PREV_PORT="8081"
else
  PREVIOUS="blue"
  CURRENT="green"
  PORT="8081"
  PREV_PORT="8080"
fi

sudo docker exec proxy \
  sudo sed -i "s/${HOST}:${PORT} down/${HOST}:${PORT}/" ${NGINX_CONF}

sudo docker run -d \
                --pull=always \
                -p ${PORT}:3001 \
                --name web-server-${CURRENT} \
                --net www \
                --restart=unless-stopped \
                qwp1216/blog-server

sleep 10

if [ -z "$(curl -I localhost:${PORT} |& grep HTTP)" ]; then
  sudo docker rm -f web-server-${CURRENT}
  exit 1
else
  sudo docker exec proxy \
    sed -i "s/${HOST}:${PREV_PORT}/${HOST}:${PREV_PORT} down/" ${NGINX_CONF}
  sudo docker exec proxy \
    nginx -s reload
  sudo docker stop -t 10 web-server-${PREVIOUS}
  sudo docker rm web-server-${PREVIOUS}
fi


sudo docker images --quiet --filter=dangling=true | sudo xargs --no-run-if-empty docker rmi