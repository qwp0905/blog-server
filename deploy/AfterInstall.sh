#!/bin/bash

# 배포 주소
BASE_PATH="/home/ubuntu/www"

cd ${BASE_PATH}

sudo docker run -d \
  -p 80:80 \
  --name proxy \
  qwp1216/blog-server-proxy

sudo docker run -d \
  -p 6379:6379 \
  -v ${BASE_PATH}/redis-data:/data \
  --name redis \
  redis

sudo docker run -d \
  -p 3001:3001 \
  --name web-server \
  qwp1216/blog-server

sudo docker images --quiet --filter=dangling=true | sudo xargs --no-run-if-empty docker rmi