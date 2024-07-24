from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class Price(models.Model):
    value = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(3)])
    creation_date = models.DateField(auto_now_add=True)

    class Meta:
        abstract = True
