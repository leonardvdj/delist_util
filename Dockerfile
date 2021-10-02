FROM node:14-alpine
WORKDIR /delist_util/
COPY . .
RUN yarn install
CMD [ "node", "." ]
