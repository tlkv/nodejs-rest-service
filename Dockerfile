FROM node:16-alpine3.14

WORKDIR /app

COPY package*.json .

COPY . .

RUN npm install

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]