#!/bin/bash

# 배포 주소
BASE_PATH="/home/ubuntu/www"

sudo apt-get update

# docker 설치
sudo apt install -y docker.io

cd ${BASE_PATH}

sudo docker compose -f docker-compose.prod.yml up -d

sudo docker images --quiet --filter=dangling=true | sudo xargs --no-run-if-empty docker rmi