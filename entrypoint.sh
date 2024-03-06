#!/bin/bash

set -e

# There are some times database is not ready yet!
# We'll check if database is ready and we can connect to it
# then the rest of the code run as well.

echo "Waiting for database..."
echo DB_NAME: ${DB_NAME}
echo DB_HOST: ${DB_HOST}
echo DB_PORT: ${DB_PORT}
while ! nc -z ${DB_HOST} ${DB_PORT}; do sleep 1; done
echo "Connected to database."
