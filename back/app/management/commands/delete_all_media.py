import os
import shutil

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        media_folder = '/vol/media'
        for item in os.listdir(media_folder):
            item_path = os.path.join(media_folder, item)
            try:
                if os.path.isfile(item_path) or os.path.islink(item_path):
                    os.unlink(item_path)
                elif os.path.isdir(item_path):
                    shutil.rmtree(item_path)
            except Exception as e:
                self.stdout.write(self.style.ERROR('Failed to delete %s. Reason: %s' % (item_path, e)))

        self.stdout.write(self.style.SUCCESS('Successfully deleted all media!'))
