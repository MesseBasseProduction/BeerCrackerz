server {
    listen          ${SERVER_PORT};
    server_name     ${SERVER_HOST};

    access_log      /var/log/nginx/back/access.log;
    error_log       /var/log/nginx/back/error.log warn;

    location / {
        uwsgi_pass              ${BACKEND_PROXY};
        include                 /etc/nginx/uwsgi_params;
        client_max_body_size    10M;
    }

    location /static {
        alias /vol/static;
    }

    location /media {
        alias /vol/media;
    }
}
