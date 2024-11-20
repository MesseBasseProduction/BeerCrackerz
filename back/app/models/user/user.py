import os

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.dispatch import receiver


class User(AbstractUser):
    profile_picture = models.ImageField(upload_to='profile_picture/', null=True, blank=True)


@receiver(models.signals.pre_save, sender=User)
def pre_save_profile_picture(sender, instance, **kwargs):
    try:
        old_profile_picture = sender.objects.get(id=instance.id).profile_picture
    except sender.DoesNotExist:
        old_profile_picture = None
    new_profile_picture = instance.profile_picture
    if not old_profile_picture or not new_profile_picture:
        return

    if old_profile_picture.path != new_profile_picture.path:
        if os.path.isfile(old_profile_picture.path):
            os.remove(old_profile_picture.path)


@receiver(models.signals.post_delete, sender=User)
def post_delete_profile_picture(sender, instance, **kwargs):
    if instance.profile_picture:
        instance.profile_picture.delete(save=False)


def get_default_user():
    return get_user_model().objetcs.get_or_create(username="Deleted user")[0]
