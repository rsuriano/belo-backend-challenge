FROM node:20-alpine as production

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
COPY .env /app

RUN npm run tsc

CMD npm run load-initial-data; npm run start
