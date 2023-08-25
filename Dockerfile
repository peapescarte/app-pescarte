FROM node:alpine

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install
EXPOSE 80

CMD ["node", "-r", "sucrase/register", "server.js"]