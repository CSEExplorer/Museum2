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

from datetime import datetime, time, timedelta
from django.db import models

class Availability(models.Model):
    # Reference to Museum
    museum = models.ForeignKey(Museum, on_delete=models.CASCADE, related_name='availabilities')

    # Date field for specific date availability
    date = models.DateField(blank=True, null=True)

    # Day of the week (this will be automatically set based on date)
    day = models.CharField(max_length=9, blank=True, editable=False)

    # Opening and Closing times of the museum
    opening_time = models.TimeField(default=time(10, 0))  # Default to 10:00 AM
    closing_time = models.TimeField(default=time(18, 0), help_text="Closing time of the museum, e.g., '06:00 PM'")  # Default to 6:00 PM

    # Indicates if the museum is closed on this day
    is_closed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('museum', 'date')
        ordering = ['museum', 'date']
        verbose_name = "Availability"
        verbose_name_plural = "Availabilities"

    def save(self, *args, **kwargs):
        """Override the save method to set the day based on the date."""
        if self.date:
            self.day = self.date.strftime('%A')  # Get the day name from the date
        super().save(*args, **kwargs)  # Call the original save method

    def __str__(self):
        return f"{self.museum.name} - {self.day} ({self.date})"


    

# --------------------------------------------  Shift  model ------------------------------------------------------
from django.db import models

class Shift(models.Model):
    SHIFT_CHOICES = [
        ('Morning', 'Morning Shift'),
        ('Evening', 'Evening Shift'),
    ]

    availability = models.ForeignKey('Availability', on_delete=models.CASCADE, related_name='shifts')
    shift_type = models.CharField(max_length=10, choices=SHIFT_CHOICES)
    tickets_available  = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('availability', 'shift_type')
        verbose_name = "Shift"
        verbose_name_plural = "Shifts"

    def __str__(self):
        return f"{self.availability.museum.name} - {self.shift_type} - Tickets: {self.tickets_available}"

# -----------------------------------------Booking detail save ------------------------------------------------------------4
