# --------------------------------------------User profile serializers-----------------------------------------------------

from rest_framework import serializers
from . models import UserProfile
from django.contrib.auth.models import User


class UserProfileSerializer(serializers.ModelSerializer):
    # Include fields from the related User model
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'phone_number', 'address', 'city', 'state','profile_image']

# ------------------------------------otp serializer---------------------------------------------------------------------

from rest_framework import serializers
from .models import VerificationCode

class VerificationCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationCode
        fields = ['user', 'code', 'created_at']


# -------------------------------------------Signup serializers for checking email ---------------------------------------

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
import re

User = get_user_model()

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid email format.")
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already registered.")
        
        return value

    def validate_password(self, value):
        # Ensure the password is at least 5 characters long
        if len(value) < 5:
            raise serializers.ValidationError("Password must be at least 5 characters long.")
        
        # Check for at least one capital letter
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one capital letter.")
        
        # Check for at least one digit
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        
        return value

