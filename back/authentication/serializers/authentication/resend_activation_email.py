from django.contrib.auth import get_user_model
from rest_framework import serializers

from app.utils.token import decode_uid


class ResendActivationEmailSerializer(serializers.Serializer):
    uidb64 = serializers.CharField(write_only=True)

    def get_user(self):
        return self.validated_data.get('user')

    def validate(self, data):
        user_model = get_user_model()
        uidb64 = data.get('uidb64')

        try:
            pk = decode_uid(uidb64)
            user = user_model.objects.get(pk=pk)
        except (TypeError, ValueError, OverflowError, user_model.DoesNotExist):
            raise serializers.ValidationError('User not found')

        data['user'] = user
        return data
