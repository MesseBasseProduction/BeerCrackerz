from rest_framework import serializers

from app.models.spot import Spot


class SpotSerializer(serializers.ModelSerializer):
    modifiers = serializers.MultipleChoiceField(choices=Spot.Modifiers.choices)
    types = serializers.MultipleChoiceField(choices=Spot.Types.choices)

    class Meta:
        model = Spot
        fields = ('id', 'name', 'description', 'lng', 'lat', 'modifiers', 'types')

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
