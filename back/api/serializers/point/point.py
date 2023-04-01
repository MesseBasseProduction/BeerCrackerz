from rest_framework import serializers


class PointSerializer(serializers.ModelSerializer):
    creationDate = serializers.DateField(source='creation_date', read_only=True)
