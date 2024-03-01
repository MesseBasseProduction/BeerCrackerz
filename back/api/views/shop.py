from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from api.serializers.shop import ShopSerializer
from app.models.shop import Shop
from authentication.permissions import IsOwnerOrReadOnly


class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    permission_classes = [IsOwnerOrReadOnly | IsAdminUser]
    serializer_class = ShopSerializer
