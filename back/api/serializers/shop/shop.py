from django.db.models import Avg
from rest_framework import serializers

from api.serializers.common import ReadOnlyModelSerializer
from app.models.shop import ShopRating, Shop


class ShopSerializer(ReadOnlyModelSerializer):
    type = serializers.CharField(default='shop', read_only=True)
    rating = serializers.SerializerMethodField()
    user = serializers.CharField(source='user.username', read_only=True)
    userId = serializers.IntegerField(source='user.id', read_only=True)
    creationDate = serializers.DateField(source='creation_date')

    class Meta:
        model = Shop
        fields = (
            'id',
            'type',
            'name',
            'description',
            'lng',
            'lat',
            'rating',
            'price',
            'types',
            'modifiers',
            'user',
            'userId',
            'creationDate'
        )

    def get_rating(self, shop):
        rating = ShopRating.objects.filter(shop=shop).aggregate(value=Avg('value'))
        return rating['value']


class ShopPostSerializer(serializers.ModelSerializer):
    types = serializers.MultipleChoiceField(choices=Shop.Types.choices)
    modifiers = serializers.MultipleChoiceField(choices=Shop.Modifiers.choices, required=False)
    rating = serializers.IntegerField(min_value=1, max_value=5)

    class Meta:
        model = Shop
        fields = (
            'name',
            'description',
            'lng',
            'lat',
            'rating',
            'price',
            'types',
            'modifiers',
        )

    def to_representation(self, instance):
        return ShopSerializer(instance).data

    def create(self, validated_data):
        rating = validated_data.pop('rating')

        user = self.context['request'].user
        validated_data['user'] = user

        shop = Shop.objects.create(**validated_data)
        ShopRating.objects.create(value=rating, shop=shop, user=user)

        return shop

    def validate_types(self, value):
        if len(value) == 0:
            raise serializers.ValidationError('TYPE_EMPTY')

        return value


class ShopPatchSerializer(serializers.ModelSerializer):
    types = serializers.MultipleChoiceField(choices=Shop.Types.choices)
    modifiers = serializers.MultipleChoiceField(choices=Shop.Modifiers.choices, required=False)
    rating = serializers.IntegerField(min_value=1, max_value=5)

    class Meta:
        model = Shop
        fields = (
            'name',
            'description',
            'rating',
            'price',
            'types',
            'modifiers',
        )

    def to_representation(self, instance):
        return ShopSerializer(instance).data

    def update(self, instance, validated_data):
        value = validated_data.pop('rating')

        # We use update_or_create here because currently the prod have a lot of point without rating.
        # When all rating obj will be created, only the update will be used.
        ShopRating.objects.update_or_create(
            defaults={'value': value},
            shop=instance,
            user=instance.user
        )

        return super().update(instance, validated_data)

    def validate_types(self, value):
        if len(value) == 0:
            raise serializers.ValidationError('TYPE_EMPTY')

        return value
