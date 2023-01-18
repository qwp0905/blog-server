FROM node:18.12.1 AS build

COPY . /origin

WORKDIR /origin

RUN npm ci && \
    npm run build

FROM node:18.12.1-slim

WORKDIR /app

COPY --from=build /origin/dist /app/dist
COPY --from=build /origin/node_modules /app/node_modules

CMD node dist/main.js