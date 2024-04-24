FROM mongo:latest

WORKDIR /backupd

COPY . .

RUN chmod 0644 ./backupd.sh

CMD ["sh", "backupd.sh"]
