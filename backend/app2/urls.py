from django.urls import path

from .views import MuseumSignupView,MuseumLoginView,logout_view,get_museum_details


urlpatterns = [
    # URL pattern for museum signup
    path('signup/', MuseumSignupView.as_view(), name='museum_signup'),
    path('login/',MuseumLoginView.as_view(),name='museum_login'),
    path('logout/',logout_view,name='musuem_logout'),
    path('museum-details/',get_museum_details, name='museum-details'),
]

