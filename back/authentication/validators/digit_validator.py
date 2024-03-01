from django.core.exceptions import ValidationError


class DigitValidator:
    def validate(self, password, user=None):
        has_digit = any(char.isdigit() for char in password)

        if not has_digit:
            raise ValidationError('This password must contain at least one digit.',
                                  code='password_digit_missing')

    def get_help_text(self):
        return 'Your password must contain at least one digit.'
