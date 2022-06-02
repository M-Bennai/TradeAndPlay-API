FROM node:14.16.1-alpine

WORKDIR /app
COPY . .

EXPOSE 8080
RUN npm install

CMD ["npm","run","start"]