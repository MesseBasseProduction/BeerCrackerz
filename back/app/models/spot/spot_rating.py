from django.conf import settings
from django.db import models

from app.models import get_default_user
from app.models.abstract import Rating
from app.models.spot.spot import Spot


class SpotRating(Rating):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET(get_default_user),
        related_name='spot_rating',
        editable=False
    )
    spot = models.ForeignKey(
        Spot,
        on_delete=models.CASCADE,
        related_name='spot_rating',
        editable=False
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(fields=('spot', 'user'), name='unique_spot_rate_for_user'),
        )
