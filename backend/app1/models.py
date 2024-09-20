from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, validators=[RegexValidator(r'^\+?1?\d{9,15}$')])
    address = models.TextField(max_length=300, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    def __str__(self):
        return self.user.username
    
# --------------------------------otp Model------------------------------------------------------------------------------------------------------------------------------------



from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import datetime

class VerificationCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_codes')
    code = models.CharField(max_length=6)  # 6-digit OTP
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        # OTP expires after 5 minutes
        expiry_time = self.created_at + datetime.timedelta(minutes=5)
        return timezone.now() > expiry_time

    def __str__(self):
        return f"{self.user.email} - {self.code}"





