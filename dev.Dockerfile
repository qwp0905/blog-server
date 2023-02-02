FROM node:18.12.1

ENV NODE_ENV=development

WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app

RUN npm ci

COPY . /app

CMD npm run dev