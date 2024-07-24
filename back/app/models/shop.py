from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from multiselectfield import MultiSelectField

from .point import Point
from .user import get_default_user


class Shop(Point):
    class Modifiers(models.TextChoices):
        BIO = 'bio'
        CRAFT = 'craft'
        FRESH = 'fresh'
        CARD = 'card'
        CHOICE = 'choice'

    class Types(models.TextChoices):
        STORE = 'store'
        SUPER = 'super'
        HYPER = 'hyper'
        CELLAR = 'cellar'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET(get_default_user),
        related_name='shops',
        editable=False
    )
    # Set max_length because max_length calcul is broken https://github.com/goinnn/django-multiselectfield/issues/131
    modifiers = MultiSelectField(choices=Modifiers.choices, max_length=100)
    # Set max_length because max_length calcul is broken https://github.com/goinnn/django-multiselectfield/issues/131
    types = MultiSelectField(choices=Types.choices, max_length=100)
    price = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(3)])
