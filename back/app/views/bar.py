from rest_framework import viewsets

from app.models.bar import Bar
from app.serializers.bar.bar import BarSerializer
from app.serializers.bar.bar_extended import BarExtendedSerializer


class BarViewSet(viewsets.ModelViewSet):
    queryset = Bar.objects.all()

    def get_serializer_class(self):
        if hasattr(self, 'action'):
            if self.action == 'list' or self.action == 'retrieve':
                return BarExtendedSerializer

        # Case for create, update, partial_update and destroy
        return BarSerializer
