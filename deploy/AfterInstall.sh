#!/bin/bash

# 배포 주소
BASE_PATH="/home/ubuntu/www"

cd ${BASE_PATH}

# 기존 컨테이너 삭제
sudo docker rm -f proxy
sudo docker rm -f web-server
sudo docker rm -f redis

sudo docker network rm www


# 컨테이너 생성

sudo docker network create -d bridge www

sudo docker run -d \
  -p 80:80 \
  --name proxy \
  --net www \
  qwp1216/blog-server-proxy

sudo docker run -d \
  -p 6379:6379 \
  -v ${BASE_PATH}/redis-data:/data \
  --name redis \
  --net www \
  redis

sudo docker run -d \
  -p 3001:3001 \
  --name web-server \
  --net www \
  qwp1216/blog-server

sudo docker images --quiet --filter=dangling=true | sudo xargs --no-run-if-empty docker rmi