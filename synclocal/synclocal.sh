#!/bin/sh

# Restore the database from backup
echo "Starting restore..."
mongorestore --uri="mongodb://offermanagerdbuser:offermanagerdbpassword@offermanagerdb/production?authSource=admin" --drop --preserveUUID --gzip --archive="go-backup-offermanagerdb-20240508045639"
echo "Restore complete!"

# Restore the database from backup
# echo "Starting restore..."
# mongorestore --uri="mongodb://slamanagerdbuser:slamanagerdbpassword@slamanagerdb/production?authSource=admin" --drop --preserveUUID --gzip --archive="go-backup-slamanagerdb-20240509102732"
# echo "Restore complete!"