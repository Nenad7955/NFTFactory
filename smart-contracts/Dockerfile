FROM node:slim
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN yarn
CMD npm run node && sleep 5 && npm run deploy && sleep infinity