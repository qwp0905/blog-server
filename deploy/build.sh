#!/bin/bash

cp ${ENV} .
cp ${KEY} .
cp ${CERT} .

# execute docker script
docker rmi -f qwp1216/blog-server
docker rmi -f qwp1216/blog-server-proxy

docker build --platform linux/amd64 \
			       -t qwp1216/blog-server-proxy \
             -f Dockerfile.proxy .
docker build --platform linux/amd64 \
             -t qwp1216/blog-server \
             -f Dockerfile.prod .

docker login -u qwp1216 -p ${DOCKER_PWD}
docker push qwp1216/blog-server
docker push qwp1216/blog-server-proxy
