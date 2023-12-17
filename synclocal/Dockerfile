FROM mongo:latest

WORKDIR /synclocal

COPY ./synclocal.sh ./synclocal.sh

COPY . .

RUN chmod 0644 ./synclocal.sh

CMD ["sh", "synclocal.sh"]
