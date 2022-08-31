from rest_framework import viewsets

from api.serializers.spot import SpotExtendedSerializer, SpotSerializer
from app.models.spot import Spot


class SpotViewSet(viewsets.ModelViewSet):
    queryset = Spot.objects.all()

    def get_serializer_class(self):
        if hasattr(self, 'action'):
            if self.action == 'list' or self.action == 'retrieve':
                return SpotExtendedSerializer

        # Case for create, update, partial_update and destroy
        return SpotSerializer
