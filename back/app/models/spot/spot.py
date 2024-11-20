from django.conf import settings
from django.db import models
from multiselectfield import MultiSelectField

from app.models.abstract import Point
from app.models.user import get_default_user


class Spot(Point):
    class Modifiers(models.TextChoices):
        BENCH = 'bench'
        COVERED = 'covered'
        TOILET = 'toilet'
        STORE = 'store'
        TRASH = 'trash'
        PARKING = 'parking'

    class Types(models.TextChoices):
        FOREST = 'forest'
        RIVER = 'river'
        LAKE = 'lake'
        CLIFF = 'cliff'
        MOUNTAIN = 'mountain'
        BEACH = 'beach'
        SEA = 'sea'
        CITY = 'city'
        POV = 'pov'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET(get_default_user),
        related_name='spots',
        editable=False
    )
    # Set max_length because max_length calcul is broken https://github.com/goinnn/django-multiselectfield/issues/131
    modifiers = MultiSelectField(choices=Modifiers.choices, max_length=100)
    # Set max_length because max_length calcul is broken https://github.com/goinnn/django-multiselectfield/issues/131
    types = MultiSelectField(choices=Types.choices, max_length=100)
