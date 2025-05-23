# Import base settings
from .base import *

DEBUG = True


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,  # allows default loggers to keep working
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': True,
        },
        'sensor_data': {  # This should match the logger in your chat_logging.py
            'handlers': ['console'],
            'level': 'DEBUG',  # Or 'ERROR' if you only want errors
            'propagate': False,
        },
    },
}
