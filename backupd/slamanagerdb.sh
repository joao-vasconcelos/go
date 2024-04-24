#!/bin/sh

# BACKUP DIRECTORY
directory="backups"

# BACKUP MODULE
module="slamanagerdb"

# BACKUP FREQUENCY
# Run every 6 hours (21600 seconds)
frequency=21600

# BACKUP HISTORYS
# Only keep the 300 most recent files
files_to_keep=300

# Infinite loop to run mongodump continously
while true; do

    # Backup the database to an archive
    echo "Starting backup..."
    mongodump --uri="$SLAMANAGERDB_MONGODB_URI" --gzip --archive="/$directory/$module/go-backup-$module-$(date +\%Y\%m\%d\%H\%M\%S)"
    echo "Backup complete!"

    # Restore the database from backup
    # echo "Starting restore..."
    # mongorestore --uri="$SLAMANAGERDB_MONGODB_URI" --drop --preserveUUID --gzip --archive="/$directory/$module/go-backup-slamanagerdb-20240424180102"
    # echo "Restore complete!"

    # Only keep the most recent files
    echo "Preparing to remove older backups. Will only keep the $files_to_keep most recent backup archives."

    # Sort the files by modification time (most recent first) and count how many were found
    sorted_files=$(find "/$directory/$module" -maxdepth 1 -type f -printf "%p\n" | sort -r -k1 | awk '{print $1}')
    files_count=$(echo "$sorted_files" | wc -l)

    # Delete the extra files if the count exceeds the threshold
    if [ "$files_count" -gt "$files_to_keep" ]; then
        files_to_delete=$(echo "$sorted_files" | tail -n +$((files_to_keep + 1)))
        echo "$files_to_delete" | xargs rm
        echo "Deleted backup archives:"
        echo "- - - - - - - - -"
        echo $files_to_delete
        echo "- - - - - - - - -"
    else
        echo "No backups deleted: Found $files_count archives which is less than the set $files_to_keep archives limit."
    fi


    # Log end of program
    echo "Complete! Next run in $frequency seconds :)"

    # Sleep until the next iteration
    sleep $frequency

done
