from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Museum
from rest_framework.authtoken.models import Token

@receiver(post_delete, sender=Museum)
def delete_user_and_token(sender, instance, **kwargs):
    # Check if the associated user exists and is saved
    user = instance.user
    if user and user.pk:  # Ensure user is saved in the database
        # Delete the user
        Token.objects.filter(user=user).delete()  # Delete the token
        user.delete()  # Delete the user
