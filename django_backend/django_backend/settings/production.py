# Import base settings
from .base import *

DEBUG = False

ALLOWED_HOSTS = [
    "sensorikbackend.eba-acgbgkr4.eu-north-1.elasticbeanstalk.com",
    "teststeststests.shop",
    "www.teststeststests.shop",
]

# Allow for requests from the react server
CORS_ALLOWED_ORIGINS = ["https://master.d289olbq1w6lrz.amplifyapp.com/",
                        'https://teststeststests.shop',
                        'https://www.teststeststests.shop']

CORS_ORIGIN_WHITELIST = [
    'https://www.teststeststests.shop',
    'https://teststeststests.shop',
]