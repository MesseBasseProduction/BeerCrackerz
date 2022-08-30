from rest_framework import viewsets

from app.models import User
from app.serializers.user.user import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
