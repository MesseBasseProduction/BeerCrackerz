from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from knox.views import LoginView as KnoxLoginView
from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from app.services.email import EmailService
from authentication.backend_authentication.email_password_authentication import EmailOrUsernamePasswordAuthentication
from authentication.serializers.authentication import ResendActivationEmailSerializer, ResetPasswordRequestSerializer, \
    ResetPasswordSerializer, CheckTokenSerializer, CheckPasswordSerializer
from authentication.serializers.user import UserRegisterSerializer, UserActivationSerializer


class LoginView(KnoxLoginView):
    authentication_classes = [EmailOrUsernamePasswordAuthentication]
    permission_classes = [AllowAny]


class UserRegisterView(CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]


class UserActivationView(CreateAPIView):
    serializer_class = UserActivationSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        super().post(request, *args, **kwargs)

        return Response(status=status.HTTP_204_NO_CONTENT)


class ResendActivationEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResendActivationEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.get_user()

        EmailService.send_user_creation_email(user)

        return Response(status=status.HTTP_204_NO_CONTENT)


class ResetPasswordRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordRequestSerializer(data=request.data)
        if serializer.is_valid(raise_exception=False):
            user = serializer.validated_data
            EmailService.send_reset_password_email(user)

        return Response(status=status.HTTP_204_NO_CONTENT)


class ResetPasswordView(CreateAPIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        super().post(request, *args, **kwargs)

        return Response(status=status.HTTP_204_NO_CONTENT)


class ValidatePasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        password = request.data.get('password')

        if not password or type(password) != str:
            raise ParseError('You must provide a password')

        error_messages = []
        try:
            validate_password(password=password)
        except ValidationError as error:
            error_messages = error.messages

        return Response({'errors': error_messages})


class CheckTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CheckTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response({'valid': serializer.check_token()})


class CheckPasswordView(APIView):
    def post(self, request):
        serializer = CheckPasswordSerializer(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)

        return Response({'valid': True})
