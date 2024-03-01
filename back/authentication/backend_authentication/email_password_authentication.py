from django.contrib.auth import authenticate
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class EmailOrUsernamePasswordAuthentication(BaseAuthentication):
    def authenticate(self, request):
        username_or_email = request.data.get('username')
        password = request.data.get('password')

        if not password or not username_or_email:
            raise AuthenticationFailed('No credentials provided')

        # Will try on several auth backend to authenticate user
        user = authenticate(request, username=username_or_email, password=password)
        if not user:
            raise AuthenticationFailed('Invalid credentials')

        return user, None
