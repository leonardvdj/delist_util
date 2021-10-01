FROM alpine:latest

RUN apk add --update npm

RUN mkdir -p /app
RUN mkdir -p /app/configs

COPY . /app
WORKDIR /app

RUN npm install

CMD [ "node", "." ] 