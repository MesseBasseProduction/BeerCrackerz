from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response

from api.serializers.user import UserSerializer
from api.serializers.user.user_register import UserRegisterSerializer
from app.models import User


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = UserSerializer


class RegisterView(CreateAPIView):
    serializer_class = UserRegisterSerializer


@api_view()
@permission_classes([IsAuthenticated])
def user_connected(request):
    user = UserSerializer(request.user)
    return Response(user.data)
