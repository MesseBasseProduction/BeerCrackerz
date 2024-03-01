from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers

from app.utils.token import decode_uid, check_token


class ResetPasswordSerializer(serializers.Serializer):
    uidb64 = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)
    password = serializers.CharField(max_length=64, write_only=True)
    confirmPassword = serializers.CharField(max_length=64, write_only=True)

    def save(self):
        user, password = self.validated_data.get('user'), self.validated_data.get('password')
        user.set_password(password)
        user.auth_token_set.all().delete()  # we log out the user from all his sessions
        user.save()

    def validate(self, data):
        user_model = get_user_model()

        uidb64, token = data.pop('uidb64'), data.pop('token')

        try:
            uid = decode_uid(uidb64)
            user = user_model.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, user_model.DoesNotExist):
            raise serializers.ValidationError('User not found')

        if not check_token(user, token):
            raise serializers.ValidationError('Invalid token')

        password, confirm_password = data.get('password'), data.get('confirmPassword')

        if password != confirm_password:
            raise serializers.ValidationError({'password': 'The passwords does not match'})

        try:
            validate_password(password=password, user=user)
        except ValidationError as error:
            raise serializers.ValidationError({'password': error.messages})

        data['user'] = user
        return data
