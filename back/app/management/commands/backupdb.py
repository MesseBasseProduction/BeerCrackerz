import io

from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        backup = io.StringIO()
        call_command('dumpdata',
                     exclude=['drf_api_logger', 'knox', 'sessions', 'auth', 'contenttypes'],
                     format='json',
                     natural_foreign=True,
                     stdout=backup)

        self.stdout.write(backup.getvalue())
