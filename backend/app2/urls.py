from django.urls import path

from .views import MuseumSignupView,MuseumLoginView,logout_view


urlpatterns = [
    # URL pattern for museum signup
    path('signup/', MuseumSignupView.as_view(), name='museum_signup'),
    path('login/',MuseumLoginView.as_view(),name='museum_login'),
    path('logout/',logout_view,name='musuem_logout')
]
