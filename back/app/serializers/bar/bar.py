from rest_framework import serializers

from app.models import User
from app.models.bar import Bar
from app.utils import get_or_raise_error


class BarSerializer(serializers.ModelSerializer):
    userId = serializers.ModelField(model_field=Bar()._meta.get_field('user'), required=True, allow_null=False)

    class Meta:
        model = Bar
        fields = ('id', 'name', 'description', 'lng', 'lat', 'userId')

    def validate(self, data):
        # Map userId to user object
        if 'userId' in data:
            data['user'] = get_or_raise_error(User, id=data.pop('userId'),
                                              error=serializers.ValidationError('This user doesn\'t exist'))

        return data
