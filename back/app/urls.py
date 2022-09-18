from django.urls import path

from .views import IndexView, WelcomeView, LoginAsideView, RegisterAsideView, ForgotPasswordAsideView, SpotPopupView, ShopPopupView, BarPopupView, DeleteMarkModalView, EditBarModalView, EditShopModalView, EditSpotModalView, HideShowModalView, NewBarModalView, NewShopModalView, NewSpotModalView, UserModalView

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('welcome/', WelcomeView.as_view(), name='index'),
    # Aside template urls for Auth features
    path('aside/login', LoginAsideView.as_view(), name='loginAside'),
    path('aside/register', RegisterAsideView.as_view(), name='registerAside'),
    path('aside/forgotpassword', ForgotPasswordAsideView.as_view(), name='forgotPasswordAside'),
    # Markers popup template urls
    path('popup/spot', SpotPopupView.as_view(), name='spotPopup'),
    path('popup/shop', ShopPopupView.as_view(), name='shopPopup'),
    path('popup/bar', BarPopupView.as_view(), name='barPopup'),
    # App modal template urls
    path('modal/deletemark', DeleteMarkModalView.as_view(), name='deleteMarkModal'),
    path('modal/editbar', EditBarModalView.as_view(), name='editBarModal'),
    path('modal/editshop', EditShopModalView.as_view(), name='editShopModal'),
    path('modal/editspot', EditSpotModalView.as_view(), name='editSpotModal'),
    path('modal/hideshow', HideShowModalView.as_view(), name='hideShowModal'),
    path('modal/newbar', NewBarModalView.as_view(), name='newBarModal'),
    path('modal/newshop', NewShopModalView.as_view(), name='newShopModal'),
    path('modal/newspot', NewSpotModalView.as_view(), name='newSpotModal'),
    path('modal/user', UserModalView.as_view(), name='userModal')
]
