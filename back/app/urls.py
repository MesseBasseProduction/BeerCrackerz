from django.urls import path

from .views import IndexView, WelcomeView

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('welcome/', WelcomeView.as_view(), name='index'),
]
