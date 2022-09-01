FROM nginx:1.22.0-alpine-perl

ENV NGINX_ENVSUBST_TEMPLATE_SUFFIX=.tpl

COPY ./.conf/development/nginx/default.conf.tpl /etc/nginx/templates/default.conf.tpl

COPY ./static /vol/static

CMD ["nginx", "-g", "daemon off;"]
