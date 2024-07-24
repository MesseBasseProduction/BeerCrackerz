from rest_framework import serializers


# Override methods to ensure that the instance is not created nor updated
class ReadOnlySerializer(serializers.Serializer):
    def create(self, validated_data):
        return

    def update(self, instance, validated_data):
        return


# Override methods to ensure that the instance is not created nor updated
class ReadOnlyModelSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return

    def update(self, instance, validated_data):
        return
