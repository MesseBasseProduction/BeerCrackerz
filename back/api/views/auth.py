from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.response import Response
from rest_framework.views import APIView


class LoginView(APIView):
    # @method_decorator(sensitive_post_parameters())
    # @method_decorator(csrf_protect)
    @method_decorator(never_cache)
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        if not username or not password:
            raise ParseError()

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED, data={'error': 'userNotRegister'})

        return Response(status=status.HTTP_200_OK, data={'status': 200})


class LogoutView(APIView):
    @method_decorator(never_cache)
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK, data={'status': 200})
