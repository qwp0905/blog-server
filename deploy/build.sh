#!/bin/bash

DOCKER_REGISTRY="qwp1216/blog-server"
COMMIT_HASH="$(git log -1 --format=%H | head -n 1)"

cp ${ENV} .
cp ${KEY} .
cp ${CERT} .

docker rmi -f "$(docker images -q -f reference=${DOCKER_REGISTRY})"
docker rmi -f "$(docker images -q -f reference=${DOCKER_REGISTRY}-proxy)"

docker build --platform linux/amd64 \
			       -t ${DOCKER_REGISTRY}-proxy:${COMMIT_HASH} \
             -f proxy.Dockerfile .
docker build --platform linux/amd64 \
             -t ${DOCKER_REGISTRY}:${COMMIT_HASH} \
             -f prod.Dockerfile .

docker tag ${DOCKER_REGISTRY}:${COMMIT_HASH} ${DOCKER_REGISTRY}:latest
docker tag ${DOCKER_REGISTRY}-proxy:${COMMIT_HASH} ${DOCKER_REGISTRY}-proxy:latest

docker push -a ${DOCKER_REGISTRY}
docker push -a ${DOCKER_REGISTRY}-proxy

docker images --quiet --filter=dangling=true | xargs --no-run-if-empty docker rmi
