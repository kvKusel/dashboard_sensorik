import os
import sys
import django
import requests
import json
import re
import time  
from datetime import datetime, timedelta, timezone
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.utils.timezone import now


from django.utils.timezone import now as tz_now, make_aware, utc
from django.db import connections, connection

# Add the project root to the Python path - uncomment for production environment!
path = '/home/scdash/django_project/dashboard_smartcity/django_backend'
if path not in sys.path:
    sys.path.append(path)
    print(f"Added {path} to sys.path")
    
# Ensure the Django settings module is set, set to production in production environment!
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_backend.settings.production')

# Add the project root to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..'))
if (project_root not in sys.path):
    sys.path.append(project_root)

# Setup Django
django.setup()

# Try to import the models
try:
    from sensor_data.models import Device, TreeMoistureReading, ElectricalResistanceReading, TreeHealthReading, WeatherData, HistoricalPrecipitation, ForecastedPrecipitation
    print("Successfully imported sensor_data.models")
except ModuleNotFoundError as e:
    print(f"Error importing sensor_data.models: {e}")
    
    
    
class Command(BaseCommand):
    help = 'Fetch precipitation data and Treesense data, then store them in the database'

    def handle(self, *args, **kwargs):
        while True:  # Infinite loop to repeatedly fetch data every 20 minutes
            self.stdout.write(self.style.NOTICE('Attempting to fetch data...'))

            # Fetch precipitation data
            self.fetch_precipitation_data()

            # Authenticate and fetch tree data
            access_token = self.authenticate()  # Get the token
            if access_token:
                self.fetch_tree_data(access_token)  # Pass token here
            else:
                self.stdout.write(self.style.ERROR("Authentication failed, skipping tree moisture data fetch."))

            # Wait for 60 minutes before running again
            self.stdout.write(self.style.NOTICE(f"Next execution in 60 minutes at {tz_now() + timedelta(minutes=60)}"))
            time.sleep(60 * 60)  # Sleep for 60 minutes (60 minutes * 60 seconds)

        
    def fetch_precipitation_data(self):
        """Fetches forecasted and historical precipitation data."""
        lat = 49.582988
        lon = 7.606534
        apiKey = os.getenv("API_KEY_OPENWEATHERMAP")

        forecast_url = f'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey}&units=metric'
        historical_url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={apiKey}&units=metric'

        try:
            response = requests.get(forecast_url)
            response.raise_for_status()
            data = response.json()

            ForecastedPrecipitation.objects.all().delete()
            for entry in data['list']:
                timestamp = entry['dt']
                precipitation = entry.get('rain', {}).get('3h', 0)
                ForecastedPrecipitation.objects.create(timestamp=timestamp, precipitation=precipitation)

            self.stdout.write(self.style.SUCCESS('Saved forecasted precipitation data.'))

            response = requests.get(historical_url)
            response.raise_for_status()
            data = response.json()
            timestamp = int(now().timestamp())
            precipitation = data.get('rain', {}).get('1h', 0)

            HistoricalPrecipitation.objects.create(timestamp=timestamp, precipitation=precipitation)
            self.stdout.write(self.style.SUCCESS('Saved historical precipitation data.'))

        except requests.RequestException as e:
            self.stderr.write(f"Error fetching precipitation data: {e}")
            
            
            
            
##################################################                  TREESENSE DATA              #####################################################            
            
            
    def authenticate(self):
        try:
            # Define login endpoint URL and the login data
            login_url = 'https://api.treesense.net/v1/login'
            email = os.getenv("LOGIN_EMAIL")
            password = os.getenv("LOGIN_PASSWORD")

            if not email or not password:
                self.stdout.write(self.style.ERROR("Login credentials not found in environment variables."))
                return None

            # Define login payload (username and password)
            payload = {
                "email": email,
                "password": password
            }

            # Set up headers
            headers = {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }

            # Send a POST request to the login endpoint with the payload
            response = requests.post(login_url, json=payload, headers=headers)

            # Check if the request was successful (status code 200)
            if response.status_code == 200:
                # Extract the access token from the response JSON
                access_token = response.json().get('accessToken')
                return access_token
            else:
                # Handle authentication failure or other error
                self.stdout.write(self.style.ERROR(f"Failed to authenticate. Status code: {response.status_code}"))
                return None

        except Exception as e:
            # Print the error message to the terminal
            self.stdout.write(self.style.ERROR(f"Error during authentication: {str(e)}"))
            return None
 
            
    def fetch_tree_data(self, access_token):
        # Re-open the connection before operations
        connections.close_all()
        connections['default'].connect()

        # Mapping device_id to sensor IDs for API calls
        device_sensor_mapping = {
            'A84041B42187E5C6': 532,
            'A840414A6187E5C5': 619,
            'A840418F1187E5C4': 620,
        }

        # Define the base URL for health and data APIs
        health_api_url = 'https://api.treesense.net/v1/trees'
        data_api_url = 'https://api.treesense.net/v1/data'

        headers = {'Authorization': f'Bearer {access_token}'}

        # Fetch tree health data first
        response = requests.get(health_api_url, headers=headers)

        if response.status_code == 200:
            response_json = response.json()

            # Process each device's health data
            for device_info in response_json['features']:
                # Get or create the device
                device, created = Device.objects.get_or_create(
                    device_id=device_info['properties']['hardware_serials'][0],
                    defaults={'name': device_info['properties']['name']}  # Only use 'name' here
                )

                # Continue with your logic for fetching and saving tree health readings
                health_state = device_info['properties']['health_state']
                time_parsed = tz_now()  # Assuming tz_now() provides the current timestamp
                data_objects = [TreeHealthReading(
                    device=device,
                    timestamp=time_parsed,
                    health_state=health_state
                )]

                if data_objects:
                    TreeHealthReading.objects.bulk_create(data_objects)
                    self.stdout.write(self.style.SUCCESS(f'Tree health data for {device.device_id} fetched and stored successfully'))


        else:
            self.stdout.write(self.style.ERROR(f'Failed to fetch tree health data. Status code: {response.status_code}'))

        # Now fetch moisture and resistance data
        for device_id, sensor_id in device_sensor_mapping.items():
            # Get or create the device
            device, created = Device.objects.get_or_create(device_id=device_id)

            # Get the latest timestamp from the database for this device
            latest_reading = TreeMoistureReading.objects.filter(device=device).order_by('-timestamp').first()
            latest_time = latest_reading.timestamp if latest_reading else make_aware(datetime.min, timezone.utc)

            # Fetch moisture and resistance data from the data API
            api_url = f'{data_api_url}?sensor={sensor_id}'
            response = requests.get(api_url, headers=headers)

            if response.status_code == 200:
                response_json = response.json()

                if "data" not in response_json or not response_json["data"]:
                    self.stdout.write(self.style.WARNING(f'No valid data found for device {device_id}'))
                    continue

                moisture_data_objects = []
                resistance_data_objects = []

                for entry in response_json["data"]:
                    try:
                        time_parsed = datetime.strptime(entry["time"], '%Y-%m-%dT%H:%M:%SZ')
                        time_parsed = make_aware(time_parsed, timezone.utc)
                    except ValueError as e:
                        self.stdout.write(self.style.ERROR(f"Skipping invalid time format: {entry['time']} - Error: {e}"))
                        continue  # Skip if time format is invalid

                    if time_parsed > latest_time:
                        try:
                            moisture_content = entry.get("moisture_content")
                            moisture_percentage = int(moisture_content * 100) if moisture_content is not None else None

                            resistance_value = entry.get("resistance")
                            resistance_value = float(resistance_value) if resistance_value is not None else None

                            # Save moisture data if valid
                            if moisture_percentage is not None:
                                moisture_data_objects.append(TreeMoistureReading(
                                    device=device,
                                    timestamp=time_parsed,
                                    moisture_value=moisture_percentage
                                ))

                            # Save resistance data if valid
                            if resistance_value is not None:
                                resistance_data_objects.append(ElectricalResistanceReading(
                                    device=device,
                                    timestamp=time_parsed,
                                    resistance_value=resistance_value
                                ))

                        except (ValueError, KeyError) as e:
                            self.stdout.write(self.style.ERROR(f"Skipping invalid row: {entry} - Error: {e}"))
                            continue  # Skip problematic rows

                if moisture_data_objects:
                    TreeMoistureReading.objects.bulk_create(moisture_data_objects)
                    self.stdout.write(self.style.SUCCESS(f'Tree moisture data for device {device_id} fetched and stored successfully'))

                if resistance_data_objects:
                    ElectricalResistanceReading.objects.bulk_create(resistance_data_objects)
                    self.stdout.write(self.style.SUCCESS(f'Electrical resistance data for device {device_id} fetched and stored successfully'))

            else:
                self.stdout.write(self.style.ERROR(f'Failed to fetch tree moisture data for device {device_id}. Status code: {response.status_code}'))
     
  

# Run the command if this script is executed directly
if __name__ == "__main__":
    from django.core.management import call_command
    call_command('fetch_data')
