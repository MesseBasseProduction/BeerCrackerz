from rest_framework import viewsets

from api.serializers.user import UserSerializer
from app.models import User


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
