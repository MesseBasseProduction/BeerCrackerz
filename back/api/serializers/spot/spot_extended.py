from rest_framework import serializers

from app.models.spot import Spot


class SpotExtendedSerializer(serializers.ModelSerializer):
    type = serializers.CharField(default='spot')
    rate = serializers.FloatField(default=0)
    user = serializers.CharField(source='user.username')
    userId = serializers.IntegerField(source='user.id')
    creationDate = serializers.DateField(source='creation_date')

    class Meta:
        model = Spot
        fields = ('id', 'type', 'name', 'description', 'lng', 'lat', 'rate', 'user', 'userId', 'creationDate')
