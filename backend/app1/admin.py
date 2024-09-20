from django.contrib import admin
from . models import UserProfile


@admin.register(UserProfile) #if donot wan to use decorator then can write admin.site.register(Userprofile,Userprofileadmin)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'city', 'state')

# ----------------------------------------------otp verfication admin -----------------------------------------------

from django.contrib import admin
from .models import VerificationCode

@admin.register(VerificationCode)
class VerificationCodeAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'created_at')
    search_fields = ('user__email', 'code')

# admin.site.register(UserProfile, UserProfileAdmin) --> optional 

