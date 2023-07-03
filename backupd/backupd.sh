#!/bin/sh

# Define the backup directory where the dumps will be stored
backup_dir="/backups"

# Define the command to run mongodump

# Infinite loop to run mongodump every minute
while true; do
  # Run mongodump command
  mongodump --uri="$(echo $MONGODB_CONNECTION_STRING | sed 's/@/\\@/g')" --out $backup_dir

  # Sleep for 1 minute
  sleep 60
done
