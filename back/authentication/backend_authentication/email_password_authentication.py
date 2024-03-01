from django.contrib.auth import authenticate
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class EmailOrUsernamePasswordAuthentication(BaseAuthentication):
    def authenticate(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not password or not (username or email):
            raise AuthenticationFailed('No credentials provided')

        user = authenticate(request, username=username, email=email, password=password)
        if not user:
            raise AuthenticationFailed('Invalid credentials')

        return user, None
