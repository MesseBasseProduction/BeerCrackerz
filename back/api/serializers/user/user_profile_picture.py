import base64
import io
import uuid

from PIL import Image
from rest_framework import serializers

from api.services.image import resize_image, compress_image


class UserProfilePictureSerializer(serializers.Serializer):
    profile_picture = serializers.CharField()
    minX = serializers.IntegerField(allow_null=True)
    minY = serializers.IntegerField(allow_null=True)
    maxX = serializers.IntegerField(allow_null=True)
    maxY = serializers.IntegerField(allow_null=True)

    class Meta:
        fields = ('profile_picture', 'minX', 'minY', 'maxX', 'maxY')

    def validate_profile_picture(self, value):
        b64 = base64.b64decode(value[value.find('base64,') + len('base64,'):])  # Keep only base64 information
        buffer = io.BytesIO(b64)
        image = Image.open(buffer)
        return image

    def validate(self, data):
        minX, minY, maxX, maxY = data.get('minX'), data.get('minY'), data.get('maxX'), data.get('maxY')

        if maxX - minX < 512 or maxY - minY < 512:
            pass
            # raise serializers.ValidationError('PROFILE_PICTURE_SIZE_ERROR')
        if maxX - minX != maxY - minY:
            pass
            # raise serializers.ValidationError('PROFILE_PICTURE_DIMENSION_ERROR')
        # Todo : test that box is not superior of the image

        image = data.pop('profile_picture')
        # cropped_image = crop_image(image, (minX, minY, maxX, maxY))
        resized_image = resize_image(image)
        image_name = f'${uuid.uuid4().hex}.webp'

        data['profile_picture'] = compress_image(resized_image, image_name)

        return data
