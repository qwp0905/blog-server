#!/bin/bash

# 배포 주소
BASE_PATH="/home/ubuntu/www"

cd ${BASE_PATH}

# Docker Network 생성
EXISTS_NETWORK=$(sudo docker network ls | grep www)

if [ -z "$EXISTS_NETWORK" ]; then
  sudo docker network create -d bridge www
fi

# Redis 실행
EXISTS_REDIS=$(sudo docker ps | grep redis)

if [ -z "$EXISTS_REDIS" ]; then
  sudo docker run -d \
    --pull "always" \
    -p 6379:6379 \
    -v ${BASE_PATH}/redis-data:/data \
    --name redis \
    --net www \
    redis
fi

# 기존 컨테이너 삭제
sudo docker rm -f proxy
sudo docker rm -f web-server

sudo docker run -d \
  --pull "always" \
  -p 3001:3001 \
  --name web-server \
  --net www \
  qwp1216/blog-server

sudo docker run -d \
  --pull "always" \
  -p 443:443 \
  --name proxy \
  --net www \
  qwp1216/blog-server-proxy

sudo docker images --quiet --filter=dangling=true | sudo xargs --no-run-if-empty docker rmi