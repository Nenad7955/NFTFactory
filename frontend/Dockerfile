FROM node:20
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN yarn
CMD [ "npm", "run", "dev"]