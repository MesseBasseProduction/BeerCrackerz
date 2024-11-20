from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from app.models.user import UserEmailChange
from app.services.email import EmailService


class ConfirmEmailChangeSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True)

    def save(self):
        user_email_change = self.validated_data.get('user_email_change')
        user = user_email_change.user
        previous_email = user.email

        user.email = user_email_change.new_email
        user.auth_token_set.all().delete()  # we log out the user from all his sessions
        user.save()

        # TODO : see if we delete after a delay. To revert the changes.
        user_email_change.delete()

        EmailService.send_email_changed_email(user=user, previous_email=previous_email)

    def validate(self, data):
        token = data.get('token')

        try:
            user_email_change = UserEmailChange.objects.get(token=token, expiry_date__gt=timezone.now())
        except UserEmailChange.DoesNotExist:
            raise PermissionDenied('Incorrect token')

        data['user_email_change'] = user_email_change
        return data
