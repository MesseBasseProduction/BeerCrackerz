from django.db import models

from app.models.rating import Rating
from app.models.spot import Spot
from app.models.user import User, get_default_user


class SpotRating(Rating):
    user = models.ForeignKey(
        User,
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
