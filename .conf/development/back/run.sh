#!/bin/sh

BACKEND_PORT=${BACKEND_PORT}
set -e

python manage.py wait_for_db
python manage.py collectstatic --noinput
python manage.py migrate

python manage.py runserver 0.0.0.0:$BACKEND_PORT