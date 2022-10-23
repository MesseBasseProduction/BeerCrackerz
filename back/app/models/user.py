from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    profile_picture = models.ImageField(upload_to='profile_picture/', null=True)


def get_default_user():
    return get_user_model().objetcs.get_or_create(username="Deleted user")[0]
