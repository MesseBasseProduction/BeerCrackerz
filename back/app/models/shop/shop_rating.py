from django.conf import settings
from django.db import models

from app.models.abstract import Rating
from app.models.shop.shop import Shop
from app.models.user import get_default_user


class ShopRating(Rating):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET(get_default_user),
        related_name='shop_rating_user',
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
