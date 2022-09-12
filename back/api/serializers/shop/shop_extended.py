from rest_framework import serializers

from app.models.shop import Shop


class ShopExtendedSerializer(serializers.ModelSerializer):
    type = serializers.CharField(default='shop')
    rate = serializers.FloatField(default=0)
    user = serializers.CharField(source='user.username')
    userId = serializers.IntegerField(source='user.id')
    creationDate = serializers.DateField(source='creation_date')

    class Meta:
        model = Shop
        fields = ('id', 'type', 'name', 'description', 'lng', 'lat', 'rate', 'user', 'userId', 'creationDate')
