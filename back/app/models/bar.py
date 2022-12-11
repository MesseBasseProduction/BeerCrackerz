from django.conf import settings
from django.db import models

from .point import Point
from .user import get_default_user


class Bar(Point):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET(get_default_user), related_name='bar',
                             editable=False)
