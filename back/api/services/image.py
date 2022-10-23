import io
import sys

from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile


def crop_image(image, box):
    return image.crop(box)


def resize_image(image, size=(512, 512)):
    return image.resize(size, Image.ANTIALIAS)


def compress_image(image, name, quality=80, webp_method=6):
    output_io_stream = io.BytesIO()
    image.save(output_io_stream, format='webp', method=webp_method, quality=quality)
    output_io_stream.seek(0)

    return InMemoryUploadedFile(output_io_stream, 'ImageField', name, 'image/webp', sys.getsizeof(output_io_stream),
                                None)
