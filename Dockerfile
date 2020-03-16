FROM node:10.15.3

MAINTAINER julianuphoff

EXPOSE 8080/tcp

ENV NODE_ENV production

COPY /dist /data

WORKDIR /data

RUN npm install

ENTRYPOINT [ "npm", "start" ]
