from django.urls import path

from .views import IndexView, WelcomeView, ErrorView, LoginAsideView, RegisterAsideView, ForgotPasswordAsideView, ResetPasswordAsideView, SpotPopupView, ShopPopupView, BarPopupView, DeleteMarkModalView, EditBarModalView, EditShopModalView, EditSpotModalView, HideShowModalView, NewBarModalView, NewShopModalView, NewSpotModalView, UserModalView, UpdatePPModalView, StartupHelpModalView

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('welcome/', WelcomeView.as_view(), name='welcome'),
    path('error/', ErrorView.as_view(), name='error'),
    # Aside template urls for Auth features
    path('aside/login', LoginAsideView.as_view(), name='loginAside'),
    path('aside/register', RegisterAsideView.as_view(), name='registerAside'),
    path('aside/forgotpassword', ForgotPasswordAsideView.as_view(), name='forgotPasswordAside'),
    path('aside/resetpassword', ResetPasswordAsideView.as_view(), name='resetPasswordAside'),    
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
    path('modal/addbar', NewBarModalView.as_view(), name='newBarModal'),
    path('modal/addshop', NewShopModalView.as_view(), name='newShopModal'),
    path('modal/addspot', NewSpotModalView.as_view(), name='newSpotModal'),
    path('modal/user', UserModalView.as_view(), name='userModal'),
    path('modal/updatepp', UpdatePPModalView.as_view(), name='updatePPModal'),
    path('modal/startuphelp', StartupHelpModalView.as_view(), name='startupHelpModal')
]
