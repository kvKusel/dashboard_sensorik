# Import base settings
from .base import *

DEBUG = False

ALLOWED_HOSTS = ["django-env.eba-5rnwgdid.eu-north-1.elasticbeanstalk.com"]

# Allow for requests from the react server
CORS_ALLOWED_ORIGINS = []