from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode


def get_token_from_user(user):
    return default_token_generator.make_token(user)


def check_token(user, token):
    return default_token_generator.check_token(user, token)


def encode_uid(uid):
    return urlsafe_base64_encode(force_bytes(uid))


def decode_uid(uidb64):
    return force_str(urlsafe_base64_decode(uidb64))
