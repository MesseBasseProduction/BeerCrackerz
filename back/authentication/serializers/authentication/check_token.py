from django.contrib.auth import get_user_model
from rest_framework import serializers

from app.utils.token import decode_uid, check_token


class CheckTokenSerializer(serializers.Serializer):
    uidb64 = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    def check_token(self):
        user, token = self.validated_data.get('user'), self.validated_data.get('token')
        return check_token(user, token)

    def validate(self, data):
        user_model = get_user_model()
        uidb64, token = data.get('uidb64'), data.get('token')

        try:
            pk = decode_uid(uidb64)
            user = user_model.objects.get(pk=pk)
        except (TypeError, ValueError, OverflowError, user_model.DoesNotExist):
            raise serializers.ValidationError('User not found')

        data['user'] = user
        return data
