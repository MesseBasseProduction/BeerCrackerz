from django.db.models import Avg
from rest_framework import serializers

from api.serializers.common import ReadOnlyModelSerializer
from app.models.spot import Spot, SpotRating


class SpotSerializer(ReadOnlyModelSerializer):
    type = serializers.CharField(default='spot', read_only=True)
    rating = serializers.SerializerMethodField()
    user = serializers.CharField(source='user.username', read_only=True)
    userId = serializers.IntegerField(source='user.id', read_only=True)
    creationDate = serializers.DateField(source='creation_date')

    class Meta:
        model = Spot
        fields = (
            'id',
            'type',
            'name',
            'description',
            'lng',
            'lat',
            'rating',
            'types',
            'modifiers',
            'user',
            'userId',
            'creationDate'
        )

    def get_rating(self, spot):
        rating = SpotRating.objects.filter(spot=spot).aggregate(value=Avg('value'))
        return rating['value']


class SpotPostSerializer(serializers.ModelSerializer):
    types = serializers.MultipleChoiceField(choices=Spot.Types.choices)
    modifiers = serializers.MultipleChoiceField(choices=Spot.Modifiers.choices, required=False)
    rating = serializers.IntegerField(min_value=1, max_value=5)

    class Meta:
        model = Spot
        fields = (
            'name',
            'description',
            'lng',
            'lat',
            'rating',
            'types',
            'modifiers',
        )

    def to_representation(self, instance):
        return SpotSerializer(instance).data

    def create(self, validated_data):
        rating = validated_data.pop('rating')

        user = self.context['request'].user
        validated_data['user'] = user

        spot = Spot.objects.create(**validated_data)
        SpotRating.objects.create(value=rating, spot=spot, user=user)

        return spot

    def validate_types(self, value):
        if len(value) == 0:
            raise serializers.ValidationError('TYPE_EMPTY')

        return value


class SpotPatchSerializer(serializers.ModelSerializer):
    types = serializers.MultipleChoiceField(choices=Spot.Types.choices)
    modifiers = serializers.MultipleChoiceField(choices=Spot.Modifiers.choices, required=False)
    rating = serializers.IntegerField(min_value=1, max_value=5)

    class Meta:
        model = Spot
        fields = (
            'name',
            'description',
            'rating',
            'types',
            'modifiers',
        )

    def to_representation(self, instance):
        return SpotSerializer(instance).data

    def update(self, instance, validated_data):
        value = validated_data.pop('rating')

        # We use update_or_create here because currently the prod have a lot of point without rating.
        # When all rating obj will be created, only the update will be used.
        SpotRating.objects.update_or_create(
            defaults={'value': value},
            spot=instance,
            user=instance.user
        )

        return super().update(instance, validated_data)

    def validate_types(self, value):
        if len(value) == 0:
            raise serializers.ValidationError('TYPE_EMPTY')

        return value
