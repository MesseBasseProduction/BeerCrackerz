import threading

from django.core.mail import EmailMessage


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
