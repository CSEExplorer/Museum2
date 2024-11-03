from django.urls import path

from .views import MuseumSignupView,MuseumLoginView,logout_view,get_museum_details,create_availability_with_shifts,fetch_availability
from django.contrib.auth import views as auth_views

urlpatterns = [
    # URL pattern for museum signup
    path('signup/', MuseumSignupView.as_view(), name='museum_signup'),
    path('login/',MuseumLoginView.as_view(),name='museum_login'),
    path('logout/',logout_view,name='musuem_logout'),
    path('museum-details/',get_museum_details, name='museum-details'),
    path('addavailabilities/',create_availability_with_shifts,name='add_availablity'),
    path('giveavailablity/',fetch_availability,name='fetch_availability'),


    path('password-reset/', 
         auth_views.PasswordResetView.as_view(), 
         name='password_reset'),
    path('password-reset/done/', 
         auth_views.PasswordResetDoneView.as_view(), 
         name='password_reset_done'),
    path('reset/<uidb64>/<token>/', 
         auth_views.PasswordResetConfirmView.as_view(), 
         name='password_reset_confirm'),
    path('reset/done/', 
         auth_views.PasswordResetCompleteView.as_view(), 
         name='password_reset_complete'),






]

