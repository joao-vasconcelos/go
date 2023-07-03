#!/bin/sh

# Infinite loop to run mongodump every minute
while true; do

    # Run mongodump command
    # mongodump --uri="$MONGODB_CONNECTION_STRING" --archive="/backups/go-backup-$(date +\%Y\%m\%d\%H\%M\%S)" #--out="/backups"

    mongorestore --uri="$MONGODB_CONNECTION_STRING" --drop --preserveUUID --archive="/backups/go-backup-20230703153032"

    # Log
    echo "Done."

    # Sleep for 30 minutes (1800 seconds)
    sleep 1800

done
