FROM node:21 as build

WORKDIR /threejs-journey
COPY package*.json ./
RUN rm -rf node_modules
RUN rm -rf build
COPY . .
RUN npm install
RUN npm run build


FROM nginx:alpine as webserver

COPY --from=build /threejs-journey/build /usr/share/nginx/html
