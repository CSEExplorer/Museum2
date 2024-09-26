from django.contrib import admin
from .models import Museum, Availability

@admin.register(Museum)
class MuseumAdmin(admin.ModelAdmin):
    list_display = ('name', 'state', 'city', 'contact_number', 'email','unique_id','password')
    search_fields = ('name', 'state', 'city')
    list_filter = ('state', 'city')

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('museum', 'day', 'start_time', 'end_time', 'tickets_available', 'is_closed')
    search_fields = ('museum__name', 'day')
    list_filter = ('museum', 'day')

