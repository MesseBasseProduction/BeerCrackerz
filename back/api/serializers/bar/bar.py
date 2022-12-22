from rest_framework import serializers

from app.models.bar import Bar


class BarSerializer(serializers.ModelSerializer):
    modifiers = serializers.MultipleChoiceField(choices=Bar.Modifiers.choices, required=False)
    types = serializers.MultipleChoiceField(choices=Bar.Types.choices, required=False)

    # Read only fields
    type = serializers.CharField(default='bar', read_only=True)
    rate = serializers.SerializerMethodField()
    user = serializers.CharField(source='user.username', read_only=True)
    userId = serializers.IntegerField(source='user.id', read_only=True)
    creationDate = serializers.DateField(source='creation_date', read_only=True)

    class Meta:
        model = Bar
        fields = (
            'id', 'type', 'name', 'description', 'lng', 'lat', 'rate', 'modifiers', 'types', 'user', 'userId',
            'creationDate')

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

    def get_rate(self, obj):
        # Call to Rate table
        return 0.0
