#!/bin/sh

# Restore the database from backup
echo "Starting restore..."
mongorestore --uri="mongodb://mongodbuser:mongodbpassword@mongodb/production?authSource=admin" --drop --preserveUUID --gzip --archive="go-backup-20240131182250"
echo "Restore complete!"