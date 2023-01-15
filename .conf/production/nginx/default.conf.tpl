server {
    listen          ${SERVER_HTTPS_PORT} ssl;
    listen     [::]:${SERVER_HTTPS_PORT} ssl;
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

    ssl_certificate         /etc/letsencrypt/live/${CERT_NAME}/fullchain.pem;
    ssl_certificate_key     /etc/letsencrypt/live/${CERT_NAME}/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/${CERT_NAME}/chain.pem;
    ssl_dhparam             /etc/letsencrypt/ssl-dhparams.pem;
}
