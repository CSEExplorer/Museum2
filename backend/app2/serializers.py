 # ----------------------------------------Signnup MuseumSerializer-----------------------------------------------
# serializers.py
from rest_framework import serializers
from .models import Museum
from django.contrib.auth.hashers import make_password
import re
import random
import string
from django.contrib.auth.models import User

class MuseumSignupSerializer(serializers.ModelSerializer):
  
    name = serializers.CharField()  
    contact_number = serializers.CharField() 
    email = serializers.EmailField() 
    password = serializers.CharField(write_only=True)  
     
    class Meta:
        model = Museum
        fields = ['name', 'contact_number', 'email', 'password']
    
    def generate_unique_id(self, length=8):
        characters = string.ascii_letters + string.digits  # Include both letters and digits
        unique_id = ''.join(random.choices(characters, k=length))
        return unique_id

    def validate_email(self, value):
        
        if Museum.objects.filter(email=value).exists():
            raise serializers.ValidationError("A museum with this email already exists.")
        
        return value
    
    def validate_contact_number(self, value):
       
        if not re.match(r'^\d{10}$', value):
            raise serializers.ValidationError("Contact number must be exactly 10 digits.")
        
        if Museum.objects.filter(contact_number=value).exists():
            raise serializers.ValidationError("A museum with this contact number already exists.")
        
        return value
    # in djenago add custom validate wih validate_<field_name>
    def validate_name(self, value):
        
        if Museum.objects.filter(name=value).exists():
            raise serializers.ValidationError("A museum with this name already exists.")
        
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        email=validated_data['email']
        unique_id = self.generate_unique_id() 
        user = User.objects.create_user(username=unique_id, password=password,email=email) 
        
        museum = Museum(
            user=user,
            name=validated_data['name'],
            contact_number=validated_data['contact_number'],
            unique_id=unique_id, 
            description=None,
            email=email,
            state=None, #none because none=true in databse otherwiese put empty string ""
            city=None,
            address=None,
            website=None,
            closing_days=None,
            
        )
        museum.save()
        return museum
    

# --------------------------------------------Museum Serilazer ----------------------------------------------------------

from rest_framework import serializers
from .models import Museum

class MuseumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Museum
        fields = ['name', 'image', 'fare','museum_id']

# ----------------------------------------------------Giving Shifts ------------------------------------------------------


from rest_framework import serializers
from .models import Shift

class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ['shift_type','tickets_available']



   