FROM nginx:1.22.0-alpine-perl

ENV NGINX_ENVSUBST_TEMPLATE_SUFFIX=.tpl

COPY ./.conf/production/nginx/default.conf.tpl /etc/nginx/templates/default.conf.tpl
COPY ./.conf/production/nginx/uwsgi_params /etc/nginx/uwsgi_params

RUN mkdir -p /var/log/nginx/back && \
    touch /var/log/nginx/back/access.log && \
    touch /var/log/nginx/back/error.log

CMD ["nginx", "-g", "daemon off;"]
