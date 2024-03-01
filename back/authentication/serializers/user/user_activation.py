from django.contrib.auth import get_user_model
from rest_framework import serializers

from app.utils.token import decode_uid, check_token


class UserActivationSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()

    def save(self):
        user = self.validated_data.get('user')
        user.is_active = True
        user.save()

    def validate(self, data):
        user_model = get_user_model()

        uidb64, token = data.get('uidb64'), data.get('token')

        try:
            uid = decode_uid(uidb64)
            user = user_model.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, user_model.DoesNotExist):
            raise serializers.ValidationError('User not found')

        if not check_token(user, token):
            raise serializers.ValidationError('Invalid token')

        data['user'] = user
        return data
