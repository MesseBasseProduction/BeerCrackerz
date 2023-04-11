from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from api.permissions import IsOwnerOrReadOnly
from api.serializers.spot import SpotSerializer
from app.models.spot import Spot


class SpotViewSet(viewsets.ModelViewSet):
    queryset = Spot.objects.all()
    permission_classes = [IsOwnerOrReadOnly | IsAdminUser]
    serializer_class = SpotSerializer
