from rest_framework import serializers

from api.serializers.point.point import PointSerializer
from app.models.spot import Spot


class SpotSerializer(PointSerializer):
    types = serializers.MultipleChoiceField(choices=Spot.Types.choices)
    modifiers = serializers.MultipleChoiceField(choices=Spot.Modifiers.choices, required=False)

    # Read only fields
    type = serializers.CharField(default='spot', read_only=True)
    rate = serializers.SerializerMethodField()  # TODO : Set required
    user = serializers.CharField(source='user.username', read_only=True)
    userId = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Spot
        fields = (
            'id', 'type', 'name', 'description', 'lng', 'lat', 'rate', 'types', 'modifiers', 'user', 'userId',
            'creationDate')

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

    def get_rate(self, obj):
        # Call to Rate table
        return 0.0

    def validate_types(self, value):
        if len(value) == 0:
            raise serializers.ValidationError('TYPE_EMPTY')

        return value
