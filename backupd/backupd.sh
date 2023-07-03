#!/bin/sh

# Infinite loop to run mongodump every minute
while true; do
  # Run mongodump command
  mongodump --uri="$MONGODB_CONNECTION_STRING" --out="/backups"

  # Sleep for 1 minute
  sleep 60
done
