from django.db.models import Avg
from rest_framework import serializers

from api.serializers.common import ReadOnlyModelSerializer
from app.models.bar import Bar, BarRating


class BarSerializer(ReadOnlyModelSerializer):
    type = serializers.CharField(default='bar')
    rating = serializers.SerializerMethodField()
    user = serializers.CharField(source='user.username')
    userId = serializers.IntegerField(source='user.id')
    creationDate = serializers.DateField(source='creation_date')

    class Meta:
        model = Bar
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

    def get_rating(self, bar):
        rating = BarRating.objects.filter(bar=bar).aggregate(value=Avg('value'))
        return rating['value']


class BarPostSerializer(serializers.ModelSerializer):
    types = serializers.MultipleChoiceField(choices=Bar.Types.choices)
    modifiers = serializers.MultipleChoiceField(choices=Bar.Modifiers.choices, required=False)
    rating = serializers.IntegerField(min_value=1, max_value=5)

    class Meta:
        model = Bar
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
        return BarSerializer(instance).data

    def create(self, validated_data):
        rating = validated_data.pop('rating')

        user = self.context['request'].user
        validated_data['user'] = user

        bar = Bar.objects.create(**validated_data)
        BarRating.objects.create(value=rating, bar=bar, user=user)

        return bar

    def validate_types(self, value):
        if len(value) == 0:
            raise serializers.ValidationError('TYPE_EMPTY')

        return value


class BarPatchSerializer(serializers.ModelSerializer):
    types = serializers.MultipleChoiceField(choices=Bar.Types.choices)
    modifiers = serializers.MultipleChoiceField(choices=Bar.Modifiers.choices, required=False)
    rating = serializers.IntegerField(min_value=1, max_value=5)

    class Meta:
        model = Bar
        fields = (
            'name',
            'description',
            'rating',
            'price',
            'types',
            'modifiers',
        )

    def to_representation(self, instance):
        return BarSerializer(instance).data

    def update(self, instance, validated_data):
        value = validated_data.pop('rating')

        # We use update_or_create here because currently the prod have a lot of point without rating.
        # When all rating obj will be created, only the update will be used.
        BarRating.objects.update_or_create(
            defaults={'value': value},
            bar=instance,
            user=instance.user
        )

        return super().update(instance, validated_data)

    def validate_types(self, value):
        if len(value) == 0:
            raise serializers.ValidationError('TYPE_EMPTY')

        return value
