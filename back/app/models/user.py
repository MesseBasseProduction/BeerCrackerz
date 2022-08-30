from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model


class User(AbstractUser):
    pass


def get_default_user():
    return get_user_model().objetcs.get_or_create(username="Deleted user")[0]
