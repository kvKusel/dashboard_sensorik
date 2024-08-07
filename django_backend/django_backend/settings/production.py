
# Import base settings
from .base import *

DEBUG = False

ALLOWED_HOSTS = [
    "sensorikbackend.eba-acgbgkr4.eu-north-1.elasticbeanstalk.com",
    "scdash.eu.pythonanywhere.com",
]

# Allow for requests from the react server
CORS_ALLOWED_ORIGINS = [
    "https://www.landschaft-lieben.de",
    "https://master.d289olbq1w6lrz.amplifyapp.com",
]

CORS_ORIGIN_WHITELIST = [
    "https://www.landschaft-lieben.de",
    "https://master.d289olbq1w6lrz.amplifyapp.com",
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'scdash$default',
        'USER': 'scdash',
        'PASSWORD': os.getenv("db_password"),
        'HOST': 'scdash.mysql.eu.pythonanywhere-services.com',
        'PORT': '3306',
    }
}