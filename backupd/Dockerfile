FROM mongo:latest

WORKDIR /backupd

COPY . .

RUN chmod +x backupd.sh offermanagerdb.sh

CMD ["sh", "backupd.sh"]