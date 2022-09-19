from rest_framework import serializers

from app.models.bar import Bar


class BarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bar
        fields = ('id', 'name', 'description', 'lng', 'lat')

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
