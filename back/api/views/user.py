from rest_framework import viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response

from api.serializers.user import UserSerializer
from app.models import User


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = UserSerializer


@api_view()
@permission_classes([IsAuthenticated])
def user_connected(request):
    user = UserSerializer(request.user)
    return Response(user.data)
