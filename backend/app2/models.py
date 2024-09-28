from django.db import models
#------------------------------------------Msueum Model ------------------------------------------------------------------

from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
class Museum(models.Model):
    # Unique identifier for each museum
   
    museum_id = models.AutoField(primary_key=True)
    unique_id = models.CharField(max_length=8, editable=False, unique=True)
    
    # Basic details
    name = models.CharField(max_length=200)
    state = models.CharField(max_length=100, blank=True, null=True)  # Updated
    city = models.CharField(max_length=100, blank=True, null=True)   # Updated
    address = models.TextField(blank=True, null=True)                # Updated
    image = models.ImageField(upload_to='museums/images/', blank=True, null=True)
    password = models.CharField(max_length=128,null=False,blank = False,default=1234) 
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,default=1)
    fare  = models.IntegerField(default=0)
    # Additional details
    description = models.TextField(blank=True, null=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(max_length=254, blank=True, null=True)
    website = models.URLField(max_length=200, blank=True, null=True)
    closing_days = models.CharField(max_length=100, blank=True, null=True)
   
    
    # Meta data
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Museum"
        verbose_name_plural = "Museums"

    def __str__(self):
        return self.name
    
    

#--------------------------------------------Availablity Model--------------------------------------------------------------


class Availability(models.Model):
    # Days of the week choices
    DAYS_OF_WEEK = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]

    # Reference to Museum
    museum = models.ForeignKey(Museum, on_delete=models.CASCADE, related_name='availabilities')
    
    # Day of the week field
    day = models.CharField(max_length=9, choices=DAYS_OF_WEEK)

    # Date field for ticket availability (optional if you want to track specific dates)
    date = models.DateField(blank=True, null=True)
    
    # Time fields for specific periods during the day
    start_time = models.TimeField(help_text="Start time for the slot, e.g., '09:00 AM'")
    end_time = models.TimeField(help_text="End time for the slot, e.g., '11:00 AM'")
    
    # Number of tickets available for that time slot
    tickets_available = models.PositiveIntegerField(default=0)
    
    # Indicates if the museum is closed on this day
    is_closed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('museum', 'day', 'start_time', 'end_time')
        ordering = ['museum', 'day', 'start_time']
        verbose_name = "Availability"
        verbose_name_plural = "Availabilities"

    def __str__(self):
        return f"{self.museum.name} - {self.day} - {self.start_time} to {self.end_time}"

# --------------------------------------------Token crednetila model ------------------------------------------------------
