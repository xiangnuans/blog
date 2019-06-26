FROM node:10

RUN npm config set registry https://registry.npm.taobao.org && \
  npm install gitbook-cli -g && \
  gitbook fetch 3.2.3

COPY book.json ./

RUN gitbook install
