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
from .utils import upload_file_to_gcs

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
        serializer = UserProfileSerializer(profile, data=request.data, partial=True) 
        # print(request.FILES['profile_image'])
        print("Incoming data:", request.data)
        
        if 'profile_image' in request.FILES:
                file_obj = request.FILES['profile_image']
                
                # Define the destination blob name (path) in the GCS bucket
                destination_blob_name = f"profiles/{request.user.id}/{file_obj}"
                
                # Upload the file to Google Cloud Storage
                profile_image_url = upload_file_to_gcs(file_obj, bucket_name='museum-profile-images-2024', destination_blob_name=destination_blob_name)
                print("Uploaded image URL:", profile_image_url)

                # Update the profile with the new image URL
                request.data['profile_image'] = profile_image_url
        if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
        
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=400)
    

#-----------------------------------------Login With only username and password--------------------------------------------------------------

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
def login_view_simple(request):
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
                # Log the user in
                login(request, user)
                
                # Generate or retrieve the auth token for the user
                token, created = Token.objects.get_or_create(user=user)

                # Response indicating successful login
                return JsonResponse({'message': 'Login successful', 'token': token.key}, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
           
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return JsonResponse({'error': 'Something went wrong. Please try again.'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
# ------------------------------login with otp  only --------------------------------------------------------------------------------

from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import VerificationCode
from django.core.mail import send_mail
@csrf_exempt
@api_view(['POST'])
def send_otp(request):
    # Step 1: Get email from the request body
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user exists with this email
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    # Step 2: Generate OTP
    otp = generate_otp()

    send_mail(
                    'Your OTP Code',
                    f'Your OTP code is {otp}',
                    'yourapp@example.com',
                    [email],
                    fail_silently=False,
                )
    
    # Step 4: Save or update OTP in VerificationCode table
    VerificationCode.objects.update_or_create(
        user=user,
        defaults={'code': otp, 'created_at': timezone.now()}
    )
    
    return Response({"message": "OTP sent successfully","sucess":True}, status=status.HTTP_200_OK)

        

# ------------------------------------------verify otp-------------------------------------------------------------------------
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
    
# ----------------------------------------confirm booking status  by sending mail ------------------------------------------------------------ 
from io import BytesIO
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from django.core.mail import EmailMessage
from django.http import JsonResponse
import json
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import  Booking
from app2.models import Museum

from django.contrib.auth import get_user_model

User = get_user_model()
@csrf_exempt
def confirm_booking_status(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Parse JSON body
            email = data.get('email')
            selectedShifts = data.get('selectedShifts')  # Get the full shift array
            museum_id = data.get('id')

            # Validate the required fields
            if not email or not selectedShifts or not museum_id:
                return JsonResponse({'error': 'Missing required fields.'}, status=400)

            # Fetch the user and museum objects
            user = get_object_or_404(User, email=email)
            museum = get_object_or_404(Museum, museum_id=museum_id)

            # Save the booking (you can also extend this logic to save the shifts separately)
            booking = Booking(
                user=user,
                museum=museum,
                date_of_visit=timezone.now().date(),  # Adjust if needed
                number_of_tickets=len(selectedShifts)
            )
            booking.save()

            # Prepare the HTML template for the ticket
            html = render_to_string('ticket_template.html', {
                'user': user,
                'museum': museum,
                'selectedShifts': selectedShifts,
                
            })

            # Generate PDF from HTML
            pdf_buffer = BytesIO()
            pisa_status = pisa.CreatePDF(html, dest=pdf_buffer)

            if pisa_status.err:
                return JsonResponse({"error": "Failed to generate PDF."}, status=500)

            pdf_buffer.seek(0)
            pdf_file = pdf_buffer.read()

            # Send the email with the ticket PDF attached
            email_message = EmailMessage(
                subject='Booking Confirmation',
                body='Your ticket is attached as a PDF. Enjoy your visit!',
                from_email='your_email@gmail.com',
                to=[email],
            )
            email_message.attach('ticket.pdf', pdf_file, 'application/pdf')
            email_message.send()

            return JsonResponse({'message': 'Booking confirmed and email sent!'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
# -----------------------------------------Availablity and shifts  By sending museumId and month-------------------------------------------------------
# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models.functions import ExtractMonth
from app2.models import Availability
from .serializers import AvailabilitySerializer

class AvailabilityByMonthView(APIView):
    def get(self, request,museumId, currentMonth, *args, **kwargs):
        try:
            # Filter availabilities by month using the date field
            # availabilities = Availability.objects.annotate(month=ExtractMonth('date')).filter(month=currentMonth)
            availabilities = Availability.objects.annotate(month=ExtractMonth('date')).filter(month=currentMonth, museum_id=museumId)
            
            # print(availabilities)
            # Serialize the availabilities
            serializer = AvailabilitySerializer(availabilities, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------------------------------password_reset_email functionality ------------------------------------------------------------------------------



import json
from django.shortcuts import render
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.crypto import get_random_string
from django.utils.translation import gettext as _
from django.http import JsonResponse
from django.contrib.sites.shortcuts import get_current_site
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
User = get_user_model()

@csrf_exempt
def password_reset_request(request):
    if request.method == "POST":
        try:
            # Try to parse the request body as JSON
            data = json.loads(request.body)
            email = data.get('email')
            print(email)  # Log the email to ensure it's coming through correctly

            # Check if email exists in the database
            try:
                user = User.objects.get(email__iexact=email)
                print(user)

                # Generate token and UID
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)

                # Construct password reset URL
                if settings.DOMAIN=='localhost:3000':
                    protocol='http'
                else :
                    protocol='https'
                reset_url = f"{protocol}://{settings.DOMAIN}/reset-password/{uid}/{token}/"
                # Send the password reset email
                subject = _("Password Reset Request")
                message = render_to_string('password_reset_email.html', {
                    'user': user,
                    'reset_url': reset_url,
                })
                send_mail(subject, message, 'no-reply@yourdomain.com', [user.email])

                return JsonResponse({"status": "Password reset link sent to your email."})
            except User.DoesNotExist:
                return JsonResponse({"error": "Email not found."}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)

    


# -----------------------------------------password_reset_confirm----------------------------------------------------------------------------------------------------
from django.utils.http import urlsafe_base64_decode
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
User = get_user_model()


@csrf_exempt

def password_reset_confirm(request, uidb64, token):
    
    try:
        # Decode user ID from the base64 encoded string
        uid = urlsafe_base64_decode(uidb64).decode()
        
        user = User.objects.get(pk=uid)
        print(f"UID: {uid}, Token: {token}")
    except (User.DoesNotExist, ValueError, TypeError):
        # print(uidb64+" "+token)
        return JsonResponse({"error": "Invalid token or user ID."}, status=400)

    # Check if the token is valid for the user
    if default_token_generator.check_token(user, token):
        if request.method == "POST":
            data = json.loads(request.body)
            new_password = data.get('password')
            

            if new_password:
               
                    # Reset password
                    user.set_password(new_password)
                    user.save()
                    return JsonResponse({"message": "Password reset successful."}, status=200)
               
            else:
                return JsonResponse({"error": "Both password fields are required."}, status=400)
    else:
        # Token is invalid or expired
        return JsonResponse({"error": "Invalid token or request."}, status=400)




# -----------------------------------------------------dialogflow-----------------------------------------------------------


from google.cloud import dialogflow_v2 as dialogflow
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from google.oauth2 import service_account
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
import os
import requests

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dialogflow_webhook(request):
    # Extract user information
    user = request.user  # Get the logged-in user object
    user_name = user.username if user.is_authenticated else 'Guest'
    user_message = request.data.get('message')
    if not user_message:
        return Response({"error": "Message text not provided."}, status=400)

    session_id = request.data.get('sessionId')

    # Load Dialogflow credentials and initialize session
    project_id = 'flash-adapter-439018-s4'
    try:
        dialogflow_credentials = service_account.Credentials.from_service_account_file(
            os.path.join(BASE_DIR, 'service_account_keys', 'dialogflow-service-account.json')
        )
    except Exception as e:
        return Response({'error': f'Could not load credentials: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    session_client = dialogflow.SessionsClient(credentials=dialogflow_credentials)
    session = session_client.session_path(project_id, session_id)

    text_input = dialogflow.TextInput(text=user_message, language_code='en')
    query_input = dialogflow.QueryInput(text=text_input)

    response = session_client.detect_intent(session=session, query_input=query_input)
    dialogflow_response_text = response.query_result.fulfillment_text
    intent_name = response.query_result.intent.display_name

    # Handle responses based on intent name
    if intent_name == "WelcomeIntent":
        response_message = f"Hello, {user_name}!"  
        

    elif intent_name == "ProfileIntent":
        # Assuming `get_user_profile` is available at `/api/user/profile/`
        profile_url = request.build_absolute_uri('/api/user/profile/')
        token = request.auth  # or `request.META.get('HTTP_AUTHORIZATION')` if using token in header
        headers = {'Authorization': f'Token {token}'}

        try:
            profile_response = requests.get(profile_url, headers=headers)
            if profile_response.status_code == 200:
                profile_data = profile_response.json()
                profile_message = f"Here is your profile information:\n"
                profile_message += f"Name: {profile_data.get('username', 'N/A')}\n"
                profile_message += f"Email: {profile_data.get('email', 'N/A')}\n"
                profile_message += f"Phone: {profile_data.get('phone_number', 'N/A')}\n"
                profile_message += f"Address: {profile_data.get('address', 'N/A')}\n"
                profile_message += f"City: {profile_data.get('city', 'N/A')}\n"
                profile_message += f"State: {profile_data.get('state', 'N/A')}\n"
                # profile_message += f"photo: {profile_data.get('profile_image', 'N/A')}\n"
                response_message = profile_message
            else:
                response_message = "Unable to fetch profile information."
        except requests.RequestException as e:
            response_message = f"Error fetching profile information: {str(e)}"
    else:
        response_message = dialogflow_response_text  # Default response for other intents

    return JsonResponse({'response': response_message})
