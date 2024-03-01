from django.core.exceptions import ValidationError


class UppercaseValidator:
    def validate(self, password, user=None):
        has_uppercase = any(char.isupper() for char in password)
        
        if not has_uppercase:
            raise ValidationError('This password must contain at least one uppercase character.',
                                  code='password_uppercase_missing')

    def get_help_text(self):
        return 'Your password must contain at least one uppercase character.'
