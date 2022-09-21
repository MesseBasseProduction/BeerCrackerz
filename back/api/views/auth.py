from django.contrib.auth import authenticate, login, logout, get_user_model
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.cache import never_cache
from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.response import Response
from rest_framework.views import APIView

from app.utils.token import decode_uid, check_token


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


class ActivationView(View):
    def get(self, request):
        user_model = get_user_model()

        uidb64, token = request.GET.get('uidb64'), request.GET.get('token')
        print(uidb64, token)
        if not uidb64 or not token:
            return self.redirect_to_welcome(activate=False)

        try:
            uid = decode_uid(uidb64)
            user = user_model.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, user_model.DoesNotExist):
            return self.redirect_to_welcome(activate=False)

        if check_token(user, token):
            user.is_active = True
            user.save()
            return self.redirect_to_welcome(activate=True)
        else:
            return self.redirect_to_welcome(activate=False)

    def redirect_to_welcome(self, activate):
        url = f'{reverse("welcome")}?activate={activate}'
        return redirect(url)
