from datetime import timedelta

from django.utils import timezone


def now_plus_one_week():
    return timezone.now() + timedelta(days=7)
