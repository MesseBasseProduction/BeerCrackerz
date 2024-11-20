import logging

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ParseError
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from api.serializers.user import UserSerializer, UserRegisterSerializer, UserProfilePictureSerializer, \
    UserPatchSerializer, UserChangePassword, UserEmailChangeSerializer
from app.models.user import User

logger = logging.getLogger('beercrackerz.views.user')


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    # User connected actions

    @action(detail=False)
    def me(self, request):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data)

    @me.mapping.patch
    def update_connected_user(self, request):
        user = request.user
        serializer = UserPatchSerializer(data=request.data, instance=user, partial=True)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    @action(
        detail=False,
        methods=['patch'],
        url_path='me/profile-picture',
        url_name='user-profile-picture'
    )
    def profile_picture(self, request):
        logger.info('update profile picture')
        user = request.user
        serializer = UserProfilePictureSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user.profile_picture = serializer.save()
            user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            logger.error(f'error updating profile picture : {serializer.errors}')
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=False,
        methods=['post'],
        url_path='me/change-password',
        url_name='change_password'
    )
    def change_password(self, request):
        serializer = UserChangePassword(data=request.data, context={'user': request.user})

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=False,
        methods=['post'],
        url_path='me/change-email',
        url_name='change_email'
    )
    def change_email(self, request):
        serializer = UserEmailChangeSerializer(data=request.data, context={'user': request.user})

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=False,
        methods=['delete'],
        url_path='me/delete-account',
        url_name='delete_account'
    )
    def delete_account(self, request):
        if request.user.is_superuser:
            raise PermissionDenied('The superuser can\'t be deleted.')

        request.user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    # Non auth actions

    @action(
        detail=False,
        permission_classes=[AllowAny],
        url_path='is-username-unique',
        url_name='is_username_unique'
    )
    def is_username_unique(self, request):
        username = request.query_params.get('username')
        exclude_id = request.query_params.get('excludeId')

        if not username:
            raise ParseError('You must provide an username')

        query = self.get_queryset().filter(username=username)

        if exclude_id:
            query = query.exclude(id=exclude_id)

        if query.count() > 0:
            data = {'unique': False}
        else:
            data = {'unique': True}

        return Response(data)

    @action(
        detail=False,
        permission_classes=[AllowAny],
        url_path='is-email-unique',
        url_name='is_email_unique'
    )
    def is_email_unique(self, request):
        email = request.query_params.get('email')

        if not email:
            raise ParseError('You must provide an email')

        if self.get_queryset().filter(email=email).count() > 0:
            data = {'unique': False}
        else:
            data = {'unique': True}

        return Response(data)


class UserRegisterView(CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]
