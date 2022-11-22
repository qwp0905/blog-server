#!/bin/bash

COMMIT_HASH="$(git log -1 --format=%H | head -n 1)"

cp ${ENV} .
cp ${KEY} .
cp ${CERT} .

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

docker rmi ${DOCKER_REGISTRY}:${COMMIT_HASH}
docker rmi ${DOCKER_REGISTRY}-proxy:${COMMIT_HASH}

docker images --quiet --filter=dangling=true | xargs --no-run-if-empty docker rmi
