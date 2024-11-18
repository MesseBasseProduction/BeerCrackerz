from django.contrib.auth import get_user_model
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    isActive = serializers.BooleanField(source='is_active')
    isStaff = serializers.BooleanField(source='is_staff')
    profilePicture = serializers.ImageField(source='profile_picture')
    lastLogin = serializers.DateTimeField(source='last_login')
    dateJoined = serializers.DateTimeField(source='date_joined')
    barCount = serializers.SerializerMethodField(method_name='get_bar_count')
    shopCount = serializers.SerializerMethodField(method_name='get_shop_count')
    spotCount = serializers.SerializerMethodField(method_name='get_spot_count')

    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'username',
            'email',
            'isActive',
            'isStaff',
            'profilePicture',
            'barCount',
            'shopCount',
            'spotCount',
            'lastLogin',
            'dateJoined',
        )

    def get_bar_count(self, user):
        return user.bars.count()

    def get_shop_count(self, user):
        return user.shops.count()

    def get_spot_count(self, user):
        return user.spots.count()
