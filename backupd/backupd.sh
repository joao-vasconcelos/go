#!/bin/sh

# RUN OFFERMANAGERDB BACKUP
echo "Running offermanagerdb.sh"
sh offermanagerdb.sh
echo "Offermanagerdb.sh completed"

# RUN SLAMANAGERDB BACKUP
echo "Running slamanagerdb.sh"
sh slamanagerdb.sh
echo "Slamanagerdb.sh completed"