FROM mongo:latest

RUN apt-get update && apt-get install -y cron

COPY crontab /etc/cron.d/backup-cron

RUN chmod 0644 /etc/cron.d/backup-cron

RUN touch /var/log/cron.log

CMD cron && tail -f /var/log/cron.log
