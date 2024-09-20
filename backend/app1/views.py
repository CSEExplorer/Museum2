from django.shortcuts import render

from django.contrib.auth import get_user_model,authenticate,login,logout

# ---------------------------------------------SIGNUP--------------------------------------------------------------------

# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .serializers import SignUpSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = SignUpSerializer(data=data)

        if serializer.is_valid():
            validated_data = serializer.validated_data
            try:
                user = User.objects.create_user(
                    username=validated_data['username'],
                    email=validated_data['email'],
                    password=validated_data['password']
                )
                return JsonResponse({'message': 'User created successfully!'}, status=201)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=400)
        else:
            return JsonResponse({'errors': serializer.errors}, status=400)

# ---------------------------------------------LOGIN --------------------------------------------------------------------

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
 
@csrf_exempt
def login_view_normal(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('username')  # Using email as the username
            password = data.get('password')
            if not User.objects.filter(email=email).exists():
                return Response({'error': 'Email does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)

            # Authenticate with username (or email) and password
            user = authenticate(request, username=user.username, password=password)
            if user is not None:
                login(request, user)
                # Generate or get the token for the user
                token, created = Token.objects.get_or_create(user=user)
                return JsonResponse({'message': 'Login successful!', 'token': token.key}, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            # Log the error to the server logs
            print(f"Unexpected error: {str(e)}")
            return JsonResponse({'error': 'Something went wrong. Please try again.'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

# ---------------------------------------------SIGN OUT--------------------------------------------------------------------


@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        token_key = request.headers.get('Authorization').split()[1]
        try:
            token = Token.objects.get(key=token_key)
            token.delete()
            logout(request)
            return JsonResponse({'message': 'Logged out successfully!'}, status=200)
        except Token.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=400)
        except Exception as e:
            print(f"Error during logout: {e}")
            return JsonResponse({'error': 'Internal server error'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    





# ---------------------------------------------GET USER PROFILE--------------------------------------------------------------------

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile
from .serializers import UserProfileSerializer

@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        # Fetch user profile based on authenticated user
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return Response({'detail': 'Profile not found.'}, status=404)

    if request.method == 'GET':
        # Handle GET request
        serializer = UserProfileSerializer(profile)  # data converted in json 
        return Response(serializer.data)
    
    if request.method == 'PUT':
        # Handle PUT request
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)  # `partial=True` allows partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    

# -----------------------------------------Login With Email OTP--------------------------------------------------------------



from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from rest_framework.authtoken.models import Token
from django.utils import timezone
from .models import VerificationCode  # Assuming you have a model to store OTPs
import json
import random
import string

# Generate a random 6-digit OTP
def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

@csrf_exempt
def login_view_emailotp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('username')  # Using email as the username
            password = data.get('password')

            if not User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email does not exist'}, status=400)
            
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
            
            if user is not None:
                # Generate OTP and send it to user's email
                otp = generate_otp()
                VerificationCode.objects.update_or_create(user=user, defaults={'code': otp, 'created_at': timezone.now()})
                
                send_mail(
                    'Your OTP Code',
                    f'Your OTP code is {otp}',
                    'yourapp@example.com',
                    [email],
                    fail_silently=False,
                )
                
                # Response indicating OTP is sent
                return JsonResponse({'message': 'OTP sent to your email.'}, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return JsonResponse({'error': 'Something went wrong. Please try again.'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def verify_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            otp = data.get('otp')
            email = data.get('email')

            user = User.objects.get(email=email)
            verification = VerificationCode.objects.filter(user=user, code=otp).first()

            if verification and (timezone.now() - verification.created_at).seconds < 300:  # 5 minutes expiry
                # Successful OTP verification
                token, created = Token.objects.get_or_create(user=user)
                verification.delete()
                return JsonResponse({'message': 'OTP verified successfully!', 'token': token.key}, status=200)
            else:
                return JsonResponse({'error': 'Invalid or expired OTP'}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Invalid user'}, status=400)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return JsonResponse({'error': 'Something went wrong. Please try again.'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
   