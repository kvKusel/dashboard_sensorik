#!/home/scdash/.virtualenvs/venv/bin/python

import os
import sys
import django

# Add the path to the Django project
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.append(BASE_DIR)

# Set the environment variable for Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_backend.settings.production')

# Set up Django
django.setup()

# Now import your models and other Django components
from sensor_data.models import ForecastedPrecipitation, HistoricalPrecipitation
from django.core.management.base import BaseCommand
import requests
from django.utils import timezone
from django.utils.timezone import now


class Command(BaseCommand):
    help = 'Fetch forecasted and historical precipitation data from OpenWeatherMap and store it in the database'

    def handle(self, *args, **kwargs):
        lat = 49.582988
        lon = 7.606534
        apiKey = os.getenv("API_KEY_OPENWEATHERMAP")  

        # Forecasted data
        forecast_url = f'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey}&units=metric'
        self.fetch_forecasted_data(forecast_url)

        # Historical data
        historical_url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={apiKey}&units=metric'
        self.fetch_historical_data(historical_url)

    def fetch_forecasted_data(self, url):
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            # Clear existing forecasted data
            ForecastedPrecipitation.objects.all().delete()

            # Extract and save forecasted data
            for entry in data['list']:
                timestamp = entry['dt']
                precipitation = entry.get('rain', {}).get('3h', 0)  # Default to 0 if no rain data
                ForecastedPrecipitation.objects.create(timestamp=timestamp, precipitation=precipitation)

            self.stdout.write(self.style.SUCCESS('Successfully fetched and saved forecasted precipitation data.'))
        except requests.RequestException as e:
            self.stderr.write(f"Error fetching forecasted weather data: {e}")
        except Exception as e:
            self.stderr.write(f"An error occurred while fetching forecasted data: {e}")

    def fetch_historical_data(self, url):
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            # Extract precipitation data
            timestamp = int(now().timestamp())  # Current UNIX timestamp
            precipitation = data.get('rain', {}).get('1h', 0)  # Use 0 if no rain data available

            # Save to database
            HistoricalPrecipitation.objects.create(timestamp=timestamp, precipitation=precipitation)

            self.stdout.write(self.style.SUCCESS('Successfully fetched and saved current precipitation data.'))
        except requests.RequestException as e:
            self.stderr.write(f"Error fetching current weather data: {e}")
        except Exception as e:
            self.stderr.write(f"An error occurred: {e}")
