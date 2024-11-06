from . import views
from django.urls import path,include
from .views import signup,logout_view,get_user_profile,login_view_simple,verify_otp,send_otp,dialogflow_webhook,check_availability_by_date
from .views import museum_list,book_ticket,get_museum_shifts,verify_payment,create_order,confirm_booking_status,AvailabilityByMonthView,password_reset_request,password_reset_confirm





urlpatterns=[
    path('api/signup/', signup, name='signup'),
    path('api/logout/', logout_view, name='logout'),
    path('api/user/profile/', get_user_profile, name='get_user_profile'),
    path('api/login/', login_view_simple, name='login'),
    path('api/verify_otp/', verify_otp, name='verify_otp'),
    path('api/museums/city/', museum_list, name='museum-list'),
    path('api/museums/<int:museum_id>/book/', book_ticket, name='book_ticket'),
    path('api/museums/<int:museum_id>/shifts/', get_museum_shifts, name='get_museum_shifts'),
    path('api/museums/<int:museum_id>/create_order/', create_order, name='create_order'),
    path('api/verify_payment/', verify_payment, name='verify_payment'),
    path('api/send_mail/' ,confirm_booking_status,name='send_mail'),
    path('api/museums/<int:museumId>/availabilities/<int:currentMonth>/', AvailabilityByMonthView.as_view(), name='availabilities-by-month'),
    path('api/password_reset/',password_reset_request, name='password_reset'),
    path('api/reset/<uidb64>/<token>/', password_reset_confirm, name='password_reset_confirm'),
    path('api/send_otp/',send_otp,name='send_otp'),
    path('api/findbydate/',check_availability_by_date,name='find'),
    # path('api/ChatBot/',chatbot_view,name='ChatBot'),
    path('api/dialogflow_webhook/',dialogflow_webhook,name='dialogflow')
    
   
    
]




