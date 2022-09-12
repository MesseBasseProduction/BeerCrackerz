from django.views.generic import TemplateView


class IndexView(TemplateView):
    template_name = 'index.html'


class WelcomeView(TemplateView):
    template_name = 'welcome.html'
