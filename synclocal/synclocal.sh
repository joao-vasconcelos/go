#!/bin/sh

# Restore the database from backup
echo "Starting 'offermanagerdb' restore..."
mongorestore --uri="mongodb://offermanagerdbuser:offermanagerdbpassword@offermanagerdb/production?authSource=admin" --drop --preserveUUID --gzip --archive="go-backup-offermanagerdb-20240625205058"
echo "Restore 'offermanagerdb' complete!"

# Restore the database from backup
echo "Starting 'slamanagerdb' restore..."
mongorestore --uri="mongodb://slamanagerdbuser:slamanagerdbpassword@slamanagerdb/production?authSource=admin" --drop --preserveUUID --gzip --archive="go-backup-slamanagerdb-20240625205106"
echo "Restore 'slamanagerdb' complete!"

# Restore the database from backup
echo "Starting 'slamanagerbufferdb' restore..."
mongorestore --uri="mongodb://slamanagerbufferdbuser:slamanagerbufferdbpassword@slamanagerbufferdb/production?authSource=admin" --drop --preserveUUID --gzip --archive="go-backup-slamanagerbufferdb-20240625205108"
echo "Restore 'slamanagerbufferdb' complete!"