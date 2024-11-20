from django.urls import include, path
from rest_framework import routers

from api.views import UserViewSet, SpotViewSet, ShopViewSet, BarViewSet, UserRegisterView
from api.views.auth import LoginView, LogoutView, ActivationView, PasswordResetRequest, PasswordReset

router = routers.DefaultRouter()
router.register(r'user', UserViewSet, basename='user')
router.register(r'spot', SpotViewSet, basename='spot')
router.register(r'shop', ShopViewSet, basename='shop')
router.register(r'bar', BarViewSet, basename='bar')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/register/', UserRegisterView.as_view(), name='register'),
    path('auth/activation/', ActivationView.as_view(), name='user-activation'),
    path('auth/password-reset-request/', PasswordResetRequest.as_view(), name='password-reset-request'),
    path('auth/password-reset/', PasswordReset.as_view(), name='password-reset-request'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
