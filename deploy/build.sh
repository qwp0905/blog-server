#!/bin/bash

DOCKER_REGISTRY="qwp1216/blog-serer"
COMMIT_HASH="$(git log -1 —format=%H | head -n 1)"

cp ${ENV} .
cp ${KEY} .
cp ${CERT} .

EXISTS_DOCKER_IMAGES=$(docker images -q -f ${DOCKER_REGISTRY})

# execute docker script
docker rmi -f "${EXISTS_DOCKER_IMAGES}"
docker rmi -f "${EXISTS_DOCKER_IMAGES}-proxy"

docker build --platform linux/amd64 \
			       -t ${DOCKER_REGISTRY}-proxy:${COMMIT_HASH} \
             -f Dockerfile.proxy .
docker build --platform linux/amd64 \
             -t ${DOCKER_REGISTRY}:${COMMIT_HASH} \
             -f Dockerfile.prod .

docker tag ${DOCKER_REGISTRY}:${COMMIT_HASH} ${DOCKER_REGISTRY}:latest
docker tag ${DOCKER_REGISTRY}-proxy:${COMMIT_HASH} ${DOCKER_REGISTRY}-proxy:latest

docker login -u qwp1216 -p ${DOCKER_PWD}
docker push -a ${DOCKER_REGISTRY}
docker push -a ${DOCKER_REGISTRY}-proxy
