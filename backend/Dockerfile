FROM node:slim
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN yarn
EXPOSE 5000
CMD [ "npx", "ts-node", "index.ts" ]