FROM python:3.12-alpine

ENV PYTHONUNBUFFERED=1

WORKDIR /back

COPY ./.conf/production/back/run.sh /scripts/run.sh
ENV PATH="/scripts:$PATH"

COPY ./back/requirements.txt .

RUN apk add --update --no-cache postgresql-client zlib-dev jpeg-dev libwebp-dev && \
    apk add --update --no-cache --virtual .tmp-deps \
      build-base postgresql-dev musl-dev linux-headers && \
    pip install -r requirements.txt && \
    apk del .tmp-deps && \
    adduser --disabled-password --no-create-home back && \
    mkdir -p /vol/media && \
    mkdir -p /vol/static && \
    chmod -R +x /scripts

COPY ./back .
COPY ./static /back/static

RUN chown -R back:back /vol && \
    chmod -R 755 /vol && \
    chown -R back:back /back && \
    chmod -R 755 /back

USER back
CMD ["run.sh"]
