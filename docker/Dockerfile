FROM node:12-slim

WORKDIR /opt/service

COPY package.json yarn.lock tsconfig* src webpack.*.js /opt/service/

RUN yarn && yarn build && rm -rf src

ENV NODE_ENV=production

EXPOSE 8080

ENTRYPOINT ["yarn", "start"]