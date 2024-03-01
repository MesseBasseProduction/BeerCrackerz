from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from api.serializers.spot import SpotSerializer
from app.models.spot import Spot
from authentication.permissions import IsOwnerOrReadOnly


class SpotViewSet(viewsets.ModelViewSet):
    queryset = Spot.objects.all()
    permission_classes = [IsOwnerOrReadOnly | IsAdminUser]
    serializer_class = SpotSerializer
