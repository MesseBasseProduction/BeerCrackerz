server {
    listen          ${SERVER_HTTP_PORT};
    listen     [::]:${SERVER_HTTP_PORT};

    location /static {
		alias /vol/static;
	}

	location / {
		proxy_pass		    http://${BACKEND_NAME}:${BACKEND_PORT};
		proxy_redirect		off;
		proxy_set_header	Host $host;
		proxy_set_header 	X-Real-IP $remote_addr;
		proxy_set_header   	X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header   	X-Forwarded-Host $server_name;
	}
}