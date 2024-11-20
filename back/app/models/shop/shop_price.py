from django.conf import settings
from django.db import models

from app.models.abstract import Price
from app.models.shop.shop import Shop
from app.models.user import get_default_user


class ShopPrice(Price):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET(get_default_user),
        related_name='shop_price_user',
        editable=False
    )
    shop = models.ForeignKey(
        Shop,
        on_delete=models.CASCADE,
        related_name='shop_price',
        editable=False
    )

    class Meta:
        constraints = (
            models.UniqueConstraint(fields=('shop', 'user'), name='unique_shop_price_for_user'),
        )
