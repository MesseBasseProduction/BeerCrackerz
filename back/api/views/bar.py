from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from api.permissions import IsOwnerOrReadOnly
from api.serializers.bar import BarSerializer
from app.models.bar import Bar


class BarViewSet(viewsets.ModelViewSet):
    queryset = Bar.objects.all()
    permission_classes = [IsOwnerOrReadOnly | IsAdminUser]
    serializer_class = BarSerializer
