import threading

from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import get_template
from django.urls import reverse

from app.utils.token import get_token_from_user, encode_uid


class EmailService:
    @staticmethod
    def _send_mail(**kwargs):
        # TODO : See to use EmailMultiAlternatives to handle both text and html email. https://docs.djangoproject.com/fr/4.1/topics/email/#sending-alternative-content-types
        email = EmailMessage(**kwargs)
        email.content_subtype = 'html'
        email.send()

    @staticmethod
    def _send_mail_async(**kwargs):
        threading.Thread(target=EmailService._send_mail, kwargs=kwargs).start()

    @staticmethod
    def send_user_creation_email(user):
        subject = 'Beer Crackerz - Création de compte'
        to = (user.email,)

        template = get_template('email/user-creation.html')
        uidb64 = encode_uid(user.pk)
        token = get_token_from_user(user)
        link = f'{settings.SERVER_URL}{reverse("user-activation")}?uidb64={uidb64}&token={token}'
        context = {'user': user, 'link': link}
        body = template.render(context)

        EmailService._send_mail_async(subject=subject, to=to, body=body)

    @staticmethod
    def send_reset_password_email(user):
        subject = 'Beer Crackerz - Réinitialisation de mot de passe'
        to = (user.email,)

        template = get_template('email/password-reset.html')
        uidb64 = encode_uid(user.pk)
        token = get_token_from_user(user)
        link = f'{settings.SERVER_URL}{reverse("welcome")}?uidb64={uidb64}&token={token}'
        context = {'user': user, 'link': link}
        body = template.render(context)

        EmailService._send_mail_async(subject=subject, to=to, body=body)


