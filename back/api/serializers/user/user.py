from django.contrib.auth import get_user_model
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    isActive = serializers.BooleanField(source='is_active')

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'isActive')
