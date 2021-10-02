FROM node:16-alpine
WORKDIR /delist_util/
COPY . .
RUN yarn install
CMD [ "node", "." ]
