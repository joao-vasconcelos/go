FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm --omit=dev install \
    && npm cache clean --force

COPY . .

RUN ["npm", "run", "build"]

CMD ["node", "build/index.js"]