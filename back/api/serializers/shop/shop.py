from rest_framework import serializers

from app.models.shop import Shop


class ShopSerializer(serializers.ModelSerializer):
    modifiers = serializers.MultipleChoiceField(choices=Shop.Modifiers.choices)
    types = serializers.MultipleChoiceField(choices=Shop.Types.choices)

    class Meta:
        model = Shop
        fields = ('id', 'name', 'description', 'lng', 'lat', 'modifiers', 'types')

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
