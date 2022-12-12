from rest_framework import serializers

from app.models.bar import Bar


class BarExtendedSerializer(serializers.ModelSerializer):
    type = serializers.CharField(default='bar')
    rate = serializers.FloatField(default=0)
    user = serializers.CharField(source='user.username')
    userId = serializers.IntegerField(source='user.id')
    creationDate = serializers.DateField(source='creation_date')

    class Meta:
        model = Bar
        fields = ('id', 'type', 'name', 'description', 'lng', 'lat', 'rate', 'modifiers', 'types', 'user', 'userId',
                  'creationDate')
