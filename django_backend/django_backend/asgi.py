"""
ASGI config for django_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
from dotenv import load_dotenv
from django.core.asgi import get_asgi_application

# Load environment variables from .env file
load_dotenv()

# Get the value of the environment variable DJANGO_SETTINGS_MODULE, default to local if not set
settings_module = os.getenv('DJANGO_SETTINGS_MODULE', 'django_backend.settings.local')

# Set the DJANGO_SETTINGS_MODULE dynamically
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

application = get_asgi_application()
