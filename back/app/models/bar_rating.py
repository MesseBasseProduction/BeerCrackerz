from django.db import models

from app.models.bar import Bar
from app.models.rating import Rating
from app.models.user import User, get_default_user


class BarRating(Rating):
    user = models.ForeignKey(
        User,
        on_delete=models.SET(get_default_user),
        related_name='bar_rating',
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
