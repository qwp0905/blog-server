#!/bin/bash

COMMIT_HASH="$(git log -1 --format=%H | head -n 1)"

echo $ENV >> ./.env
echo $CERT >> ./certification.crt
echo $KEY >> ./private.key

docker images -qf reference=${DOCKER_REGISTRY} | xargs --no-run-if-empty docker rmi -f
docker images -qf reference=${DOCKER_REGISTRY}-proxy | xargs --no-run-if-empty docker rmi -f

docker build --platform linux/amd64 \
			       -t ${DOCKER_REGISTRY}-proxy:${COMMIT_HASH} \
             -f proxy.Dockerfile .
docker build --platform linux/amd64 \
             -t ${DOCKER_REGISTRY}:${COMMIT_HASH} \
             -f prod.Dockerfile .

docker tag ${DOCKER_REGISTRY}:${COMMIT_HASH} ${DOCKER_REGISTRY}:latest
docker tag ${DOCKER_REGISTRY}-proxy:${COMMIT_HASH} ${DOCKER_REGISTRY}-proxy:latest

docker login -u qwp1216 -p ${DOCKER_PWD}

docker push -a ${DOCKER_REGISTRY}
docker push -a ${DOCKER_REGISTRY}-proxy

docker images -qf dangling=true | xargs --no-run-if-empty docker rmi
