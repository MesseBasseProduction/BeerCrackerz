FROM jonasal/nginx-certbot:3.1.2-nginx1.21.6-alpine
ENV NGINX_ENVSUBST_TEMPLATE_SUFFIX=.tpl
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/user_conf.d


COPY ./.conf/production/nginx/default.conf.tpl /etc/nginx/templates/default.conf.tpl
COPY ./.conf/production/nginx/uwsgi_params /etc/nginx/uwsgi_params

RUN mkdir -p /var/log/nginx/back && \
    touch /var/log/nginx/back/access.log && \
    touch /var/log/nginx/back/error.log

# Command provided by jonasal/nginx-cerbot image
CMD [ "/scripts/start_nginx_certbot.sh" ]
