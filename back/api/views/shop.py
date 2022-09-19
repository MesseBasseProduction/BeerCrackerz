from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from api.serializers.shop import ShopExtendedSerializer, ShopSerializer
from app.models.shop import Shop


class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if hasattr(self, 'action'):
            if self.action == 'list' or self.action == 'retrieve':
                return ShopExtendedSerializer

        # Case for create, update, partial_update and destroy
        return ShopSerializer
