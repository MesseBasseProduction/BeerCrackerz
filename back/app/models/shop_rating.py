from django.db import models

from app.models.rating import Rating
from app.models.shop import Shop
from app.models.user import User, get_default_user


class ShopRating(Rating):
    user = models.ForeignKey(
        User,
        on_delete=models.SET(get_default_user),
        related_name='shop_rating',
        editable=False
    )
    shop = models.ForeignKey(
        Shop,
        on_delete=models.CASCADE,
        related_name='shop_rating',
        editable=False
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(fields=('shop', 'user'), name='unique_shop_rate_for_user'),
        )
