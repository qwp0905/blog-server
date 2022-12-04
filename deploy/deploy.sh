#!/bin/bash

HOST="host.docker.internal"
NGINX_CONF="/etc/nginx/nginx.conf"

echo "$DOCKER_REGISTRY $IMAGE_TAG version..."

# Docker Network 실행
if [ -z "$(sudo docker network ls | grep www)" ]; then
  echo "Create docker network..."
  sudo docker network create -d bridge www
fi

# Nginx
if [ -z "$(sudo docker ps | grep proxy)" ]; then
  echo "Create nginx proxy..."
  sudo docker ps -aqf name=proxy | sudo xargs --no-run-if-empty docker rm -f
  sudo docker run -d \
                  --pull=always \
                  -p 443:443 \
                  --name proxy \
                  --add-host ${HOST}:host-gateway \
                  --restart=unless-stopped \
                  -v /home/ubuntu/log:/var/log/nginx/ \
                  ${DOCKER_REGISTRY}-proxy:${IMAGE_TAG}
fi


# Redis 실행
if [ -z "$(sudo docker ps | grep redis)" ]; then
  echo "Create redis..."
  sudo docker ps -aqf name=redis | sudo xargs --no-run-if-empty docker rm -f
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

echo "Create server $CURRENT..."
sudo docker ps -aqf name=web-server-${CURRENT} | sudo xargs --no-run-if-empty docker rm -f
sudo docker run -d \
                --pull=always \
                -p ${PORT}:3001 \
                --name web-server-${CURRENT} \
                --net www \
                --restart=unless-stopped \
                ${DOCKER_REGISTRY}:${IMAGE_TAG}

sleep 10

for COUNT in {1..10}
do
  echo "$COUNT trying..."
  if [ -n "$(curl -sI localhost:${PORT} | grep HTTP)" ]; then
    echo "$CURRENT succeed"
    sudo docker exec proxy \
      sed -i "s/${HOST}:${PORT} down/${HOST}:${PORT}/" ${NGINX_CONF}
    sudo docker exec proxy \
      sed -i "s/${HOST}:${PREV_PORT}/${HOST}:${PREV_PORT} down/" ${NGINX_CONF}
    sudo docker exec proxy \
      nginx -s reload

    sudo docker stop -t 10 web-server-${PREVIOUS}
    sudo docker rm web-server-${PREVIOUS}
    
    sudo docker images -qf dangling=true | sudo xargs --no-run-if-empty docker rmi -f

    sudo docker images -qf reference=${DOCKER_REGISTRY} \
                       -f before=${DOCKER_REGISTRY}:${IMAGE_TAG} \
    | sudo xargs --no-run-if-empty docker rmi -f
    sudo docker images -qf reference=${DOCKER_REGISTRY} \
                       -f since=${DOCKER_REGISTRY}:${IMAGE_TAG} \
    | sudo xargs --no-run-if-empty docker rmi -f

    exit 0
  else
    sleep 3
  fi
done

sudo docker rm -f web-server-${CURRENT}
sudo docker images -qf dangling=true | sudo xargs --no-run-if-empty docker rmi -f
sudo docker rmi -f ${DOCKER_REGISTRY}:${IMAGE_TAG}

echo "Fail to start server..."
exit 1
