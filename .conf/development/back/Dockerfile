FROM python:3.12-alpine

ENV PYTHONUNBUFFERED=1

WORKDIR /back

COPY ./.conf/development/back/run.sh /scripts/run.sh
ENV PATH="/scripts:$PATH"

COPY ./back/requirements.txt .

RUN apk add --update --no-cache postgresql-client zlib-dev jpeg-dev libwebp-dev libffi-dev && \
    apk add --update --no-cache --virtual .tmp-deps \
      build-base postgresql-dev musl-dev linux-headers  && \
    pip install -r requirements.txt && \
    apk del .tmp-deps && \
    adduser --disabled-password --no-create-home back && \
    mkdir -p /vol/static && \
    mkdir -p /vol/media && \
    chmod -R +x /scripts

COPY ./back .

# TODO : Set user back, was removed for the collectstatic command to run succesfully
#USER back
CMD ["run.sh"]
