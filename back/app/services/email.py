import threading

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.urls import reverse

from app.utils.token import get_token_from_user, encode_uid


class EmailService:
    @staticmethod
    def _send_mail(**kwargs):
        html_body = kwargs.pop('html_body')
        email = EmailMultiAlternatives(**kwargs)
        if html_body:
            email.attach_alternative(html_body, 'text/html')

        email.send()

    @staticmethod
    def _send_mail_async(**kwargs):
        threading.Thread(target=EmailService._send_mail, kwargs=kwargs).start()

    @staticmethod
    def send_user_creation_email(user):
        uidb64 = encode_uid(user.pk)
        token = get_token_from_user(user)
        link = f'{settings.SERVER_URL}{reverse("user-activation")}?uidb64={uidb64}&token={token}'
        context = {'user': user, 'link': link}

        html_template = get_template('email/html/user-creation.html')
        text_template = get_template('email/text/user-creation.txt')
        html_body = html_template.render(context)
        text_body = text_template.render(context)

        subject = 'BeerCrackerz - Création de compte'
        to = (user.email,)

        EmailService._send_mail_async(subject=subject, to=to, body=text_body, html_body=html_body)

    @staticmethod
    def send_reset_password_email(user):
        uidb64 = encode_uid(user.pk)
        token = get_token_from_user(user)
        link = f'{settings.SERVER_URL}{reverse("welcome")}?uidb64={uidb64}&token={token}'
        context = {'user': user, 'link': link}

        html_template = get_template('email/html/password-reset.html')
        text_template = get_template('email/text/password-reset.txt')
        html_body = html_template.render(context)
        text_body = text_template.render(context)

        subject = 'BeerCrackerz - Réinitialisation de mot de passe'
        to = (user.email,)

        EmailService._send_mail_async(subject=subject, to=to, body=text_body, html_body=html_body)

    @staticmethod
    def send_change_email_request(user, new_email, token):
        link = f'{settings.SERVER_URL}confirm-email?token={token}'
        context = {'user': user, 'link': link}

        html_template = get_template('email/html/request-change-email.html')
        text_template = get_template('email/text/request-change-email.txt')
        html_body = html_template.render(context)
        text_body = text_template.render(context)

        subject = 'BeerCrackerz - Confirmez votre changement d\'adresse email'
        to = (new_email,)

        EmailService._send_mail_async(subject=subject, to=to, body=text_body, html_body=html_body)

    @staticmethod
    def notify_change_email_request(user, new_email):
        context = {'user': user, 'new_email': new_email}

        html_template = get_template('email/html/notify-request-change-email.html')
        text_template = get_template('email/text/notify-request-change-email.txt')
        html_body = html_template.render(context)
        text_body = text_template.render(context)

        subject = 'BeerCrackerz - Une demande de changement d\'adresse email a été effectuée.'
        to = (user.email,)

        EmailService._send_mail_async(subject=subject, to=to, body=text_body, html_body=html_body)

    @staticmethod
    def send_email_changed_email(user, previous_email):
        context = {'user': user}

        html_template = get_template('email/html/email-has-changed.html')
        text_template = get_template('email/text/email-has-changed.txt')
        html_body = html_template.render(context)
        text_body = text_template.render(context)

        subject = 'BeerCrackerz - Votre adresse email a été changée'
        to = (previous_email,)

        EmailService._send_mail_async(subject=subject, to=to, body=text_body, html_body=html_body)
