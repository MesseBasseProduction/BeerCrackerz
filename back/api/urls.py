from django.urls import include, path
from rest_framework import routers

from api.views import UserViewSet, SpotViewSet, ShopViewSet, BarViewSet, user_connected, UserRegisterView
from api.views.auth import LoginView, LogoutView

router = routers.DefaultRouter()
router.register(r'user', UserViewSet, basename='user')
router.register(r'spot', SpotViewSet, basename='spot')
router.register(r'shop', ShopViewSet, basename='shop')
router.register(r'bar', BarViewSet, basename='bar')

urlpatterns = [
    path('user/me/', user_connected, name='user_connected'),
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/register/', UserRegisterView.as_view(), name='register'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
