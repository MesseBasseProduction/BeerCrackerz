from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Rating(models.Model):
    value = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    creation_date = models.DateField(auto_now_add=True)

    class Meta:
        abstract = True
