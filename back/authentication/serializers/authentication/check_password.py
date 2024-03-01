from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied


class CheckPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=64)

    def validate_password(self, password):
        user = self.context.get('user')

        if not user.check_password(password):
            raise PermissionDenied('Incorrect Password')
