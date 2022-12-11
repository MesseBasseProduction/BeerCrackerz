from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from api.permissions import IsOwnerOrReadOnly
from api.serializers.bar import BarExtendedSerializer, BarSerializer
from app.models.bar import Bar


class BarViewSet(viewsets.ModelViewSet):
    queryset = Bar.objects.all()
    permission_classes = [IsOwnerOrReadOnly | IsAdminUser]

    def get_serializer_class(self):
        if hasattr(self, 'action'):
            if self.action == 'list' or self.action == 'retrieve':
                return BarExtendedSerializer

        # Case for create, update, partial_update and destroy
        return BarSerializer
