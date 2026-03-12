#!/bin/sh

# # #

echo "Starting 'offermanagerdb' restore..."
mongorestore --uri="mongodb://offermanagerdbuser:offermanagerdbpassword@offermanagerdb/production?authSource=admin" --drop --preserveUUID --gzip --archive="go-backup-offermanagerdb-20260312194403"
echo "Restore 'offermanagerdb' complete!"