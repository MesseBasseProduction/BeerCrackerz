from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from api.serializers.bar import BarSerializer, BarPatchSerializer, BarPostSerializer
from app.models import Bar
from authentication.permissions import IsOwnerOrReadOnly


class BarViewSet(viewsets.ModelViewSet):
    queryset = Bar.objects.all()
    permission_classes = [IsOwnerOrReadOnly | IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'create':
            return BarPostSerializer
        elif self.action in ['partial_update', 'update']:
            return BarPatchSerializer
        else:
            return BarSerializer
