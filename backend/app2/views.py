
# -------------------------------Signup View Msuem-------------------------------------------------------------------------
from django.forms import ValidationError
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import MuseumSignupSerializer


class MuseumSignupView(generics.CreateAPIView):
    serializer_class = MuseumSignupSerializer

    def perform_create(self, serializer):
        museum = serializer.save()
        unique_id = museum.user.username 
        email = museum.user.email
        if email:
            try:
                send_unique_id_email(email, unique_id)
            except Exception as e:
                raise ValidationError(f"Error sending email: {str(e)}")
        return Response({
            "message": "Signup successful",
            "unique_id": museum.user.username
        }, status=status.HTTP_201_CREATED)


# -------------------------------- sending mail for unique id -----------------------------------------------------------------

from django.core.mail import send_mail
from django.conf import settings

def send_unique_id_email(email, unique_id):
    subject = 'Your Unique Museum ID'
    message = f'Hello,\n\nYour unique ID for logging in is: {unique_id}\n\nThank you!'
    from_email = settings.EMAIL_HOST_USER

    send_mail(subject, message, from_email, [email])


# ----------------------------------------login view -----------------------------------------------------------------
from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Museum

class MuseumLoginView(generics.GenericAPIView):

    def post(self, request, *args, **kwargs):
        # Get the unique_id and password from the request
        unique_id = request.data.get('unique_id')
        password = request.data.get('password')

        if not unique_id or not password:
            return Response({"error": "Unique ID and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate the user using the unique_id as the username
        user = authenticate(username=unique_id, password=password)

        if user is not None:
            # Authentication successful, fetch the associated museum instance
            try:
                museum = Museum.objects.get(user=user)
            except Museum.DoesNotExist:
                return Response({"error": "Museum not found."}, status=status.HTTP_404_NOT_FOUND)

            # Generate or retrieve the existing token for the user
            token, created = Token.objects.get_or_create(user=user)

            return Response({
                "message": "Login successful",
                "token": token.key,
                "name": museum.name,
                "uniqueId":unique_id,
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid unique ID or password."}, status=status.HTTP_400_BAD_REQUEST)

# ---------------------------------------------logout view ---------------------------------------------------------------
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
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



# ------------------------------fetching Musuem details all -------------------------------------------------------------

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Museum
from .serializers import MuseumSerializer

@api_view(['GET','POST'])
def get_museum_details(request):
    """
    Retrieve museum details along with availability by uniqueId.
    """
    try:
        # Extract uniqueId from request data
        unique_id = request.data.get('uniqueId')
        
        if not unique_id:
            return Response({'error': 'Unique ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the museum by unique_id
        museum = Museum.objects.get(unique_id=unique_id)
       
        serializer = MuseumSerializer(museum)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Museum.DoesNotExist:
        return Response({'error': 'Museum not found'}, status=status.HTTP_404_NOT_FOUND)


# ---------------------------------------------Add Avialblity -----------------------------------------------------------------------------
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Availability, Shift, Museum
from .serializers import AvailabilitySerializer, ShiftSerializer

@api_view(['POST'])
def create_availability_with_shifts(request):
    
    availability_data = request.data.get('availability')
    shifts_data = request.data.get('shifts')
    
    if not availability_data or not shifts_data:
        return Response({'error': 'Availability or shifts data is missing'}, status=status.HTTP_400_BAD_REQUEST)

    # Find the museum based on uniqueId
    try:
        museum = Museum.objects.get(unique_id=availability_data['museum'])
    except Museum.DoesNotExist:
        return Response({'error': 'Museum not found'}, status=status.HTTP_404_NOT_FOUND)

    # Create or update availability
    availability_date = availability_data['date']
    availability, created = Availability.objects.get_or_create(
        museum=museum,
        date=availability_date,
       
    )

    if created:
        # Availability created successfully
        availability.save()
    else:
        # Availability already exists, you might want to handle updates here
        return Response({'message': 'Availability already exists for this date'}, status=status.HTTP_400_BAD_REQUEST)

   
    for shift_data in shifts_data:
        shift_serializer = ShiftSerializer(data={**shift_data, 'availability': availability.id})
        if shift_serializer.is_valid():
            shift_serializer.save()
        else:
            # If any shift is invalid, you might want to delete the created availability
            availability.delete()
            return Response(shift_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        'availability': AvailabilitySerializer(availability).data,
        'shifts': ShiftSerializer(Shift.objects.filter(availability=availability), many=True).data
    }, status=status.HTTP_201_CREATED)
