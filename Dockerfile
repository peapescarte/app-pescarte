FROM node:alpine

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install
EXPOSE 8000
CMD ["node", "-r", "sucrase/register", "server.js"]