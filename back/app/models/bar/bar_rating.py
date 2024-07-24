from django.conf import settings
from django.db import models

from app.models import get_default_user
from app.models.abstract import Rating
from app.models.bar.bar import Bar


class BarRating(Rating):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET(get_default_user),
        related_name='bar_rating_user',
        editable=False
    )
    bar = models.ForeignKey(
        Bar,
        on_delete=models.CASCADE,
        related_name='bar_rating',
        editable=False
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(fields=('bar', 'user'), name='unique_bar_rate_for_user'),
        )
