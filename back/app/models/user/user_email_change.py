from django.conf import settings
from django.db import models

from app.models.user import get_default_user
from app.utils.date import now_plus_one_week


class UserEmailChange(models.Model):
    new_email = models.EmailField(max_length=100)
    token = models.CharField(max_length=64, primary_key=True)
    expiry_date = models.DateTimeField(editable=False, default=now_plus_one_week)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='%(class)ss',
        related_query_name='%(class)ss',
        editable=False,
        default=get_default_user,
    )

    class Meta:
        db_table = 'app_user_email_change'
