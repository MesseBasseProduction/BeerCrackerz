from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from api.serializers.user import UserSerializer, UserRegisterSerializer, UserProfilePictureSerializer
from app.models import User


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['patch'], url_path='profile-picture', url_name='user-profile-picture')
    def profile_picture(self, request, pk):
        user = self.get_object()
        serializer = UserProfilePictureSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user.profile_picture = serializer.save()
            user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserRegisterView(CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]


@api_view()
@permission_classes([IsAuthenticated])
def user_connected(request):
    user = UserSerializer(request.user)
    return Response(user.data)
