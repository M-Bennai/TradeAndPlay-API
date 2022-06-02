FROM node:14.16.1-alpine

WORKDIR /app
COPY . .

EXPOSE 4000
RUN npm install

CMD ["npm","run","start"]