# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run generate-test
EXPOSE 3000
ENTRYPOINT [ "npm","start" ]
