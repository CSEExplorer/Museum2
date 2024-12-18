# --------------------------------------------User profile serializers-----------------------------------------------------

from rest_framework import serializers
from . models import UserProfile
from django.contrib.auth.models import User


class UserProfileSerializer(serializers.ModelSerializer):
    # Include fields from the related User model
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')
    profile_image = serializers.URLField(required=False)
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


# -------------------------------------------Signup serializers for checking email and saving datat to UserProfile ---------------------------------------

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.core.validators import validate_email
import re

User = get_user_model()

class SignUpSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(required=True, max_length=15, validators=[RegexValidator(r'^\+?1?\d{9,15}$')])
    address = serializers.CharField(required=False, max_length=300)
    first_name=serializers.CharField(required=True,max_length=10)
    last_name=serializers.CharField(required=False,max_length=10)
    
    class Meta:
        model = User
        fields = ['username','first_name' ,'last_name','email', 'password', 'phone_number', 'address']
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
    def create(self, validated_data):
        # Extract profile fields
        phone_number = validated_data.pop('phone_number')
        address = validated_data.pop('address')
       
        
        # Create the user
        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        # Create the user profile
        UserProfile.objects.create(
            user=user,
            phone_number=phone_number,
            address=address,
        )
        
        return user


# ---------------------------------------serializers for Availiblity by month --------------------------------------    
# serializers.py

from rest_framework import serializers
from app2.models import Availability, Shift

class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ['shift_type', 'tickets_available']  # Fields to return in the response

class AvailabilitySerializer(serializers.ModelSerializer):
    shifts = ShiftSerializer(many=True)  # Include the shifts in the response

    class Meta:
        model = Availability
        fields = ['date', 'day', 'opening_time', 'closing_time', 'is_closed', 'shifts']
