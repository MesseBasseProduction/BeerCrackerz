from rest_framework import serializers

from app.models.shop import Shop


class ShopSerializer(serializers.ModelSerializer):
    modifiers = serializers.MultipleChoiceField(choices=Shop.Modifiers.choices)
    types = serializers.MultipleChoiceField(choices=Shop.Types.choices)
    price = serializers.IntegerField(min_value=1, max_value=3)

    # Read only fields
    type = serializers.CharField(default='shop', read_only=True)
    rate = serializers.SerializerMethodField()
    user = serializers.CharField(source='user.username', read_only=True)
    userId = serializers.IntegerField(source='user.id', read_only=True)
    creationDate = serializers.DateField(source='creation_date', read_only=True)

    class Meta:
        model = Shop
        fields = (
            'id', 'type', 'name', 'description', 'lng', 'lat', 'rate', 'price', 'modifiers', 'types', 'user', 'userId',
            'creationDate')

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

    def get_rate(self, obj):
        # Call to Rate table
        return 0.0
