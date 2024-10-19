"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 5.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-x2zu$(fzata(k1=2*8-5#@mwxy_(@a(wkio6cg*z8i2q)r32+a'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    'localhost',  # Allow localhost for local development
    '127.0.0.1',  # Allow localhost IP
    'museum-rr68.onrender.com',  # Add your Render domain
]


# Application definition

INSTALLED_APPS = [
    
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'rest_framework.authtoken',
    'app1.apps.App1Config',
    'app2.apps.App2Config',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

CORS_ALLOW_ALL_ORIGINS = True 

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://museum-rr68.onrender.com",
    "http://museum-rr68.onrender.com",  # If HTTP access is possible
]
CORS_ALLOW_CREDENTIALS = True


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR,'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True



import os



STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Additional static files directories, if any
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
MEDIA_URL= '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

import environ

# Initialize environment variables
env = environ.Env()
environ.Env.read_env()  # Read the .env file

TWILIO_ACCOUNT_SID="AC8ef9c19e395fd386a22afba4edae3a64"
TWILIO_AUTH_TOKEN="fb5768775777b19808b9ee0cfa6d3101"
TWILIO_PHONE_NUMBER="+15005550006"

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST= "smtp.gmail.com"
EMAIL_USE_TLS="True"
EMAIL_PORT=587
EMAIL_HOST_USER="saxenaaditya381@gmail.com"
EMAIL_HOST_PASSWORD="wxrt cmsd uvbc azwe"

RAZORPAY_KEY_ID = 'rzp_test_qRwrfdLBNDfLRV'
RAZORPAY_KEY_SECRET = 'kjlZAL5kpTnQaRU1GI2YTpI5'




import os
from google.oauth2 import service_account


GCS_BUCKET_NAME = 'museum-profile-images-2024'


import os
import json
# Check if the application is running on Render (production)
is_render = os.environ.get('RENDER', 'false') == 'true'

if is_render:
    # Use the environment variable for production
    GOOGLE_APPLICATION_CREDENTIALS = json.loads(os.environ['GOOGLE_SERVICE_ACCOUNT_JSON'])
else:
    # Use the local path for development
    GOOGLE_APPLICATION_CREDENTIALS = os.path.join(BASE_DIR, 'service_account_keys', 'service-account-file.json')




# Any other necessary configurations...

