from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView


# Whole pages views (index and welcome)
class IndexView(LoginRequiredMixin, TemplateView):
    template_name = 'index.html'
    login_url = '/welcome'
    redirect_field_name = 'next'


class WelcomeView(TemplateView):
    template_name = 'welcome.html'


class ErrorView(TemplateView):
    template_name = 'error.html'


# Aside views for Auth features
class LoginAsideView(TemplateView):
    template_name = 'aside/login.html'


class RegisterAsideView(TemplateView):
    template_name = 'aside/register.html'


class ForgotPasswordAsideView(TemplateView):
    template_name = 'aside/forgot-password.html'


class ResetPasswordAsideView(TemplateView):
    template_name = 'aside/reset-password.html'


# Popup views for markers
class SpotPopupView(TemplateView):
    template_name = 'popup/spot.html'


class ShopPopupView(TemplateView):
    template_name = 'popup/shop.html'


class BarPopupView(TemplateView):
    template_name = 'popup/bar.html'


# Modal views
class DeleteMarkModalView(TemplateView):
    template_name = 'modal/deletemark.html'


class EditBarModalView(TemplateView):
    template_name = 'modal/editbar.html'


class EditShopModalView(TemplateView):
    template_name = 'modal/editshop.html'


class EditSpotModalView(TemplateView):
    template_name = 'modal/editspot.html'


class HideShowModalView(TemplateView):
    template_name = 'modal/hideshow.html'


class NewBarModalView(TemplateView):
    template_name = 'modal/addbar.html'


class NewShopModalView(TemplateView):
    template_name = 'modal/addshop.html'


class NewSpotModalView(TemplateView):
    template_name = 'modal/addspot.html'


class UserModalView(TemplateView):
    template_name = 'modal/user.html'


class UpdatePPModalView(TemplateView):
    template_name = 'modal/updatepp.html'
