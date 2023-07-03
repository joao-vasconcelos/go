#!/bin/sh

# Define the backup directory where the dumps will be stored
backup_dir="/backups"

# Define the command to run mongodump
mongodump_cmd="mongodump --uri '$MONGODB_CONNECTION_STRING' --out $backup_dir"

# Infinite loop to run mongodump every minute
while true; do
  # Run mongodump command
  $mongodump_cmd

  # Sleep for 1 minute
  sleep 60
done
