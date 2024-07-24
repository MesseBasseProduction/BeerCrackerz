from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from api.serializers.spot import SpotSerializer, SpotPostSerializer, SpotPatchSerializer
from app.models import Spot
from authentication.permissions import IsOwnerOrReadOnly


class SpotViewSet(viewsets.ModelViewSet):
    queryset = Spot.objects.all()
    permission_classes = [IsOwnerOrReadOnly | IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'create':
            return SpotPostSerializer
        elif self.action in ['partial_update', 'update']:
            return SpotPatchSerializer
        else:
            return SpotSerializer
