from django.contrib.auth import get_user_model
from rest_framework import serializers


class ResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, data):
        user_model = get_user_model()
        email = data.get('email')

        try:
            user = user_model.objects.get(email=email)
        except user_model.DoesNotExist:
            raise serializers.ValidationError()

        return user
