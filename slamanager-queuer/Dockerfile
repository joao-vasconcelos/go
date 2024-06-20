FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install \
    && npm cache clean --force

COPY . .

RUN ["npm", "run", "build"]

CMD ["node", "build/index.js"]