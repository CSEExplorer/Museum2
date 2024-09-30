from django.contrib import admin
from .models import Museum, Availability

@admin.register(Museum)
class MuseumAdmin(admin.ModelAdmin):
    list_display = ('name', 'state', 'city', 'contact_number', 'email','unique_id','password')
    search_fields = ('name', 'state', 'city')
    list_filter = ('state', 'city')

# --------------------------------------------Availability admin and timeslot admin-----------------------------------------------------

from django.contrib import admin
from .models import Availability, Shift
from .models import Availability

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('museum', 'date', 'day', 'opening_time', 'closing_time', 'is_closed')
    search_fields = ('museum__name', 'day')
    list_filter = ('museum', 'is_closed')
    ordering = ('museum', 'date')
    readonly_fields = ('day',)




@admin.register(Shift)
class ShiftAdmin(admin.ModelAdmin):
    list_display = ('availability', 'shift_type', 'tickets_available')
    search_fields = ('availability__museum__name', 'shift_type')
    list_filter = ('availability__museum', 'shift_type')
    ordering = ('availability', 'shift_type')





