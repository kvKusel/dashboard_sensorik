# import sshtunnel
# import atexit

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

# # SSH connection to pythonanywhere db
# sshtunnel.SSH_TIMEOUT = 5.0
# sshtunnel.TUNNEL_TIMEOUT = 5.0

# # Start the SSH tunnel
# tunnel = sshtunnel.SSHTunnelForwarder(
#     ('ssh.eu.pythonanywhere.com'),  # PythonAnywhere SSH hostname
#     ssh_username='scdash',  # Your PythonAnywhere username
#     ssh_password= os.getenv("pythonanywhere"),  # The password you use to log in to the PythonAnywhere website
#     remote_bind_address=('scdash.mysql.eu.pythonanywhere-services.com', 3306)  # Your PythonAnywhere database hostname
# )
# tunnel.start()

# # Ensure the tunnel is stopped when the Django process exits
# atexit.register(tunnel.stop)


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