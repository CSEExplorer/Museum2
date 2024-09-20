# -----------------------------------------------------------------------Signal to delete  otp ------------------------------------------------------------------------------

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta  # You need to import this for timedelta
from .models import VerificationCode

@receiver(post_save, sender=VerificationCode)
def delete_expired_otps(sender, instance, **kwargs):
    print("Signal triggered!")
    expired_time = timezone.now() - timedelta(minutes=5)
    VerificationCode.objects.filter(created_at__lt=expired_time).delete()
