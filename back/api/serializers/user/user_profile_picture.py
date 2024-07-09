import base64
import io
import logging
import uuid

from PIL import Image
from rest_framework import serializers

from api.services.image import resize_image, compress_image, crop_image

logger = logging.getLogger('beercrackerz.serializerz.user_profile_picture')


class UserProfilePictureSerializer(serializers.Serializer):
    profile_picture = serializers.CharField()
    minX = serializers.IntegerField(required=False)
    minY = serializers.IntegerField(required=False)
    maxX = serializers.IntegerField(required=False)
    maxY = serializers.IntegerField(required=False)

    def save(self):
        image = self.validated_data.get('profile_picture')
        box = self.validated_data.get('box')
        if box:
            image = crop_image(image, box)

        resized_image = resize_image(image)
        return compress_image(resized_image, name=f'${uuid.uuid4().hex}.webp')

    def validate_profile_picture(self, value):
        b64 = base64.b64decode(value[value.find('base64,') + len('base64,'):])  # Keep only base64 information
        buffer = io.BytesIO(b64)
        image = Image.open(buffer)
        return image

    def validate(self, data):
        image = data.get('profile_picture')
        width, height = image.size

        # TODO : see to raise more specific error code
        if width < 512 or height < 512:
            logger.error(f'[UPDATE PROFILE PICTURE] - PROFILE_PICTURE_SIZE_ERROR - width {width}, height {height}')
            raise serializers.ValidationError('PROFILE_PICTURE_SIZE_ERROR')

        minX, minY, maxX, maxY = data.pop('minX'), data.pop('minY'), data.pop('maxX'), data.pop('maxY')
        if minX and minY and maxX and maxY:
            if maxX - minX < 512 or maxY - minY < 512:
                logger.error(
                    f'[UPDATE PROFILE PICTURE] - PROFILE_PICTURE_SIZE_ERROR - width {maxX - minX}, height {maxX - minX}')
                raise serializers.ValidationError('PROFILE_PICTURE_SIZE_ERROR')
            if maxX - minX != maxY - minY:
                logger.error(f'[UPDATE PROFILE PICTURE] - PROFILE_PICTURE_DIMENSION_ERROR - picture is not a square')
                raise serializers.ValidationError('PROFILE_PICTURE_DIMENSION_ERROR')  # Picture is not a square
            if maxX > width or maxY > height:
                logger.error(
                    f'[UPDATE PROFILE PICTURE] - PROFILE_PICTURE_DIMENSION_ERROR - maxX > width or maxY > height - {maxX} > {width} or {maxY} > {height}')
                raise serializers.ValidationError('PROFILE_PICTURE_DIMENSION_ERROR')

            data['box'] = (minX, minY, maxX, maxY)
        else:
            if width != height:
                logger.error(f'[UPDATE PROFILE PICTURE] - PROFILE_PICTURE_DIMENSION_ERROR - picture is not a square')
                raise serializers.ValidationError('PROFILE_PICTURE_DIMENSION_ERROR')  # Picture is not a square

        return data
