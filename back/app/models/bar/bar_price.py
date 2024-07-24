from django.conf import settings
from django.db import models

from app.models import get_default_user
from app.models.abstract import Price
from app.models.bar.bar import Bar


class BarPrice(Price):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET(get_default_user),
        related_name='bar_price_user',
        editable=False
    )
    bar = models.ForeignKey(
        Bar,
        on_delete=models.CASCADE,
        related_name='bar_price',
        editable=False
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(fields=('bar', 'user'), name='unique_bar_price_for_user'),
        )
