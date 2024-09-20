from . import views
from django.urls import path,include
from .views import signup,login_view_normal,logout_view,get_user_profile,login_view_emailotp,verify_otp



urlpatterns=[
    path('api/signup/', signup, name='signup'),
    path('api/logout/', logout_view, name='logout'),
    path('api/user/profile/', get_user_profile, name='get_user_profile'),
    path('api/login/', login_view_emailotp, name='login'),
    path('api/verify_otp/', verify_otp, name='verify_otp'),
]





