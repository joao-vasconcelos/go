FROM node:alpine

RUN apk update && \
    apk upgrade && \
    apk add git

WORKDIR /app

COPY package.json ./
RUN npm --omit=dev install

COPY . .

CMD ["node", "index.js"]
