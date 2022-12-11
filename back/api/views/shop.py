from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from api.permissions import IsOwnerOrReadOnly
from api.serializers.shop import ShopExtendedSerializer, ShopSerializer
from app.models.shop import Shop


class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    permission_classes = [IsOwnerOrReadOnly | IsAdminUser]

    def get_serializer_class(self):
        if hasattr(self, 'action'):
            if self.action == 'list' or self.action == 'retrieve':
                return ShopExtendedSerializer

        # Case for create, update, partial_update and destroy
        return ShopSerializer
