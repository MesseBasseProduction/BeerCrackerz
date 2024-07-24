from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from api.serializers.shop import ShopSerializer, ShopPostSerializer, ShopPatchSerializer
from app.models import Shop
from authentication.permissions import IsOwnerOrReadOnly


class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    permission_classes = [IsOwnerOrReadOnly | IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'create':
            return ShopPostSerializer
        elif self.action in ['partial_update', 'update']:
            return ShopPatchSerializer
        else:
            return ShopSerializer
