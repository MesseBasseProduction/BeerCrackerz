from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator


class UserRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50,
                                     validators=[UniqueValidator(queryset=get_user_model().objects.all())])
    email = serializers.EmailField(max_length=50,
                                   validators=[UniqueValidator(queryset=get_user_model().objects.all())])
    password1 = serializers.CharField(max_length=15)
    password2 = serializers.CharField(max_length=15)

    def create(self, validated_data):
        user = get_user_model()(**validated_data)
        validate_password(password=validated_data.get('password'), user=user)

        user.save()
        return user

    def to_representation(self, instance):
        data = {'username': instance.username, 'email': instance.email}
        return data

    # No need to implement this method as it is a POST only serializer
    def update(self, instance, validated_data):
        return instance

    def validate(self, data):
        password1 = data.pop('password1')
        password2 = data.pop('password2')

        if password1 != password2:
            raise serializers.ValidationError('PASSWORD_NOT_MATCH')

        data['password'] = make_password(password1)
        return data
