from django.shortcuts import get_object_or_404, render

from django.contrib.auth import get_user_model,authenticate,login,logout

# ---------------------------------------------SIGNUP--------------------------------------------------------------------

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
            try:
                # Save the user and user profile
                serializer.save()
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
    

#-----------------------------------------Login With Email OTP--------------------------------------------------------------

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


#---------------------------------------------------Museum view--------------------------------------------------------

from app2.models import Museum
from app2.serializers import MuseumSerializer


@api_view(['GET'])
def museum_list(request):
    city = request.GET.get('city', '')
    museums = Museum.objects.filter(city__icontains=city)

    serializer = MuseumSerializer(museums, many=True)
    return Response(serializer.data)


#----------------------------------------------------- Booking logic  ------------------------------------------------------

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from io import BytesIO
from xhtml2pdf import pisa
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from rest_framework import status
from app2.models import Museum, Shift
from app1.models  import Booking



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_ticket(request, museum_id):
 
    museum = get_object_or_404(Museum, pk=museum_id)
    shift_id = request.data.get('shift_id')
    email = request.data.get('email')

    # Get the shift object
    try:
        shift = Shift.objects.get(id=shift_id, museum=museum)
    except Shift.DoesNotExist:
        return JsonResponse({"error": "Shift does not exist."}, status=status.HTTP_404_NOT_FOUND)

    # Decrement available tickets
    if shift.tickets_available > 0:
        shift.tickets_available -= 1
        shift.save()
    else:
        return JsonResponse({"error": "No tickets available for this shift."}, status=status.HTTP_400_BAD_REQUEST)

# -----------------------------------------------get shifts--------------------------------------------------------------
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from app2.models import Museum, Shift
from app2.serializers import ShiftSerializer

@api_view(['GET'])
def get_museum_shifts(request, museum_id):
    museum = get_object_or_404(Museum, museum_id=museum_id)
    
    # Filter only Morning and Evening shifts for the given museum
    shifts = Shift.objects.filter(availability__museum=museum, shift_type__in=['Morning', 'Evening'])

    if not shifts.exists():
        return Response({"error": "No shifts available for this museum"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ShiftSerializer(shifts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# ---------------------------------------------create paymnet order----------------------------------------------------/

import razorpay
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@api_view(['POST'])
def create_order(request, museum_id):
    """
    This view creates an order using Razorpay's API.
    The amount is passed in the POST request and multiplied by 100 to convert to paise.
    The receipt is generated using the user's email.
    """
    try:
        # Retrieve amount and email from the POST request
        amount = request.data.get('amount')  # The amount should be in rupees
        email = request.data.get('email')  # Use email as the receipt identifier

        # Ensure amount and email are provided
        if not amount or not email:
            return Response({"error": "Amount and email are required."}, status=400)

        # Convert amount to paise (Razorpay works with paise)
        amount_in_paise = int(amount)

        # Create an order with Razorpay
        order_data = {
            'amount': amount_in_paise,  # Amount in paise
            'currency': 'INR',
            'receipt': f'receipt_{email}',
            'payment_capture': '1',  # Auto capture payment
        }

        # Call Razorpay to create the order
        order = razorpay_client.order.create(data=order_data)

        # Return the order details in the response
        return Response(order)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# ------------------------------------------verify payment----------------------------------------------------------------

from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response

import razorpay
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from razorpay.errors import SignatureVerificationError



@api_view(['POST'])
def verify_payment(request):
    try:
        # Step 1: Get the necessary data from the request
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')

        # Check if all necessary parameters are present
        if not razorpay_payment_id or not razorpay_order_id or not razorpay_signature:
            return Response({'error': 'Missing payment details'}, status=400)

        # Step 2: Create the payload for signature verification
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }

        # Step 3: Verify the signature using Razorpay's utility
        try:
            razorpay_client.utility.verify_payment_signature(params_dict)
        except SignatureVerificationError:
            return Response({'error': 'Payment signature verification failed'}, status=400)

        # Step 4: After successful verification, proceed with post-payment logic
        # You can confirm the booking, send an email, save payment details, etc.
        
        # Example: Save the payment to the database (you need to have a Payment model)
        # Payment.objects.create(
        #     razorpay_payment_id=razorpay_payment_id,
        #     razorpay_order_id=razorpay_order_id,
        #     status="Success"
        # )

        return Response({'status': 'Payment verified', 'payment_id': razorpay_payment_id})

    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
# ----------------------------------------confirm booking status------------------------------------------------------------ 
from django.core.mail import EmailMessage
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.utils import timezone
from rest_framework.decorators import api_view

from .models import Booking
from app2.models import Museum,Shift # Import your Booking and Museum models
from django.contrib.auth.models import User
from io import BytesIO
from xhtml2pdf import pisa
from django.core.mail import send_mail, EmailMessage
from django.template.loader import render_to_string
@csrf_exempt

def confirm_booking_status(request):
    if request.method == 'POST':
        email = request.data.get('email')
        shift_id = request.data.get('shift_id')
        museum_id  = request.data.get('id')
        # Fetch user from email
        user = get_object_or_404(User, email=email)
        museum = get_object_or_404(Museum, museum_id=museum_id)
        shift =  get_object_or_404(Shift, id=shift_id)
       
        booking = Booking(
            user=user,
            shift=shift,
            museum=museum,
            date_of_visit=timezone.now().date(),  # Set this according to your booking logic
            number_of_tickets=1  # Adjust this as necessary
        )
        booking.save()

    html = render_to_string('ticket_template.html', {'museum': museum, 'shift': shift})

    # Generate PDF
    pdf_buffer = BytesIO()
    pisa_status = pisa.CreatePDF(html, dest=pdf_buffer)

    if pisa_status.err:
        return JsonResponse({"error": "Failed to generate PDF."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    pdf_buffer.seek(0)
    pdf_file = pdf_buffer.read()

    # Send email with PDF attachment
    email_message = EmailMessage(
        subject='Booking Confirmation',
        body='Your ticket is attached as a PDF.',
        from_email='your_email@gmail.com',
        to=[email],
    )
    email_message.attach('ticket.pdf', pdf_file, 'application/pdf')
    email_message.send()
    return JsonResponse({'message': 'Booking confirmed and email sent!'}, status=200)
    return JsonResponse({'error': 'Invalid request method.'}, status=400)
