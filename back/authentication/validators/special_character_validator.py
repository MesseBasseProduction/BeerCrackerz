# List of default allowed special character
from django.core.exceptions import ValidationError

SPECIAL_CHARACTER_ALLOWED = ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ù£€°¨'


class SpecialCharacterValidator:
    def __init__(self, special_characters_allowed=SPECIAL_CHARACTER_ALLOWED):
        self.special_characters_allowed = special_characters_allowed

    def validate(self, password, user=None):
        has_special_character = any(char in self.special_characters_allowed for char in password)

        if not has_special_character:
            raise ValidationError('This password must contain at least one special character.',
                                  code='password_special_character')

    def get_help_text(self):
        return f'Your password must contain at least one special character from the list : ' + self.special_characters_allowed
