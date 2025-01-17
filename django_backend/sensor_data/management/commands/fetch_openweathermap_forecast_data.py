import os
import requests
from django.core.management.base import BaseCommand
from django.utils import timezone
from sensor_data.models import ForecastedPrecipitation, HistoricalPrecipitation
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
