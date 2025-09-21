from .base import *
import os

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'scdash_local',
        'USER': 'scdash_local_user',
        'PASSWORD': '1234',
        'HOST': 'db',
        'PORT': '3306',
    }
}