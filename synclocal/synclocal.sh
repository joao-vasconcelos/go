#!/bin/sh

# Restore the database from backup
echo "Starting restore..."
mongorestore --uri="mongodb://offermanagerdbuser:offermanagerdbpassword@offermanagerdb/production?authSource=admin" --drop --preserveUUID --gzip --archive="go-backup-offermanagerdb-20240505232230"
echo "Restore complete!"