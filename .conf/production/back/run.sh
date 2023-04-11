#!/bin/sh

BACKEND_PORT=${BACKEND_PORT}
set -e

python manage.py wait_for_db
python manage.py collectstatic --noinput
python manage.py migrate

uwsgi --socket :"$BACKEND_PORT" --workers 4 --master --enable-threads --module back.wsgi