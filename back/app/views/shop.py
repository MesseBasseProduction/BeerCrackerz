from rest_framework import viewsets

from app.models.shop import Shop
from app.serializers.shop.shop import ShopSerializer
from app.serializers.shop.shop_extended import ShopExtendedSerializer


class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()

    def get_serializer_class(self):
        if hasattr(self, 'action'):
            if self.action == 'list' or self.action == 'retrieve':
                return ShopExtendedSerializer

        # Case for create, update, partial_update and destroy
        return ShopSerializer
