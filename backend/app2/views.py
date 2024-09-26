
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
                "name": museum.name
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid unique ID or password."}, status=status.HTTP_400_BAD_REQUEST)
