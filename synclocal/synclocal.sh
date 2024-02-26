#!/bin/sh

# Restore the database from backup
echo "Starting restore..."
mongorestore --uri="mongodb://mongodbuser:mongodbpassword@mongodb/production?authSource=admin" --drop --preserveUUID --gzip --archive="go-backup-20240226220017"
echo "Restore complete!"