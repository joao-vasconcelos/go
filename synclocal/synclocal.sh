#!/bin/sh

# Restore the database from backup
echo "Starting restore..."
mongorestore --uri="mongodb://godbuser:godbpassword@godb/production?authSource=admin" --drop --preserveUUID --gzip --archive="go-backup-20240418174517"
echo "Restore complete!"