from django.contrib.auth import get_user_model
from rest_framework import serializers

from api.serializers.user.user import UserSerializer


# TODO : merge with UserProfilePictureSerializer

class UserPatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            'username',
        )

    def to_representation(self, instance):
        return UserSerializer(instance).data
