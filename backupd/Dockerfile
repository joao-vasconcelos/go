FROM mongo:latest

WORKDIR /backupd

COPY . .

# RUN chmod 0644 ./backupd.sh ./offermanagerdb.sh ./slamanagerdb.sh

RUN chmod +x backupd.sh offermanagerdb.sh slamanagerdb.sh.

CMD ["sh", "backupd.sh"]
