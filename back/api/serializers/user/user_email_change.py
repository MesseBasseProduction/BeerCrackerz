from django.contrib.auth import get_user_model
from rest_framework import serializers

from app.models.user import UserEmailChange
from app.services.email import EmailService
from app.utils.token import get_token_from_user


class UserEmailChangeSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=100)

    def save(self):
        user = self.context.get('user')
        new_email = self.validated_data.get('email')

        token = get_token_from_user(user)

        # Delete previous requests
        UserEmailChange.objects.filter(user=user).delete()

        user_email_change = UserEmailChange(user=user, new_email=new_email, token=token)
        user_email_change.save()

        EmailService.send_change_email_request_email(user, new_email, token)
        EmailService.send_email_changed_email(user, user.email)

    def validate_email(self, email):
        user = self.context.get('user')

        if email == user.email:
            raise serializers.ValidationError('This email is already set to the user.')

        if get_user_model().objects.filter(email=email).count() > 0:
            raise serializers.ValidationError('This email is already used.')

        return email
