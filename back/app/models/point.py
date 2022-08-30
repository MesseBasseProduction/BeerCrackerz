from django.db import models


class Point(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=280, null=True, blank=True)
    lng = models.FloatField()
    lat = models.FloatField()
    creation_date = models.DateField(auto_now_add=True)

    class Meta:
        abstract = True
