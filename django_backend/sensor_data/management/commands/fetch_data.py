import os
import sys
import django
import requests
import json
import re
import time  # Import the time module
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils.timezone import now as tz_now, make_aware, utc

# Ensure the Django settings module is set
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_backend.settings.base')

# Add the project root to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..'))
if project_root not in sys.path:
    sys.path.append(project_root)

# Setup Django
django.setup()

# Print the Python path and current working directory to debug the issue
print("Python Path:", sys.path)
print("Current Working Directory:", os.getcwd())

# Try to import the models
try:
    from sensor_data.models import Device, TreeMoistureReading, ElectricalResistanceReading, TreeHealthReading
    print("Successfully imported sensor_data.models")
except ModuleNotFoundError as e:
    print(f"Error importing sensor_data.models: {e}")

class Command(BaseCommand):
    help = 'Fetches data from Treesense API and stores it'

    def authenticate(self):
        try:
            # Define login endpoint URL and the login data
            login_url = 'https://api.treesense.net/login'
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

    def fetch_tree_moisture_data(self, access_token):
        # Get or create the device
        device, created = Device.objects.get_or_create(
            device_id='A84041B42187E5C6',
            defaults={'name': 'Cox Orangenrenette', 'location': 'Default Location'}
        )

        # Get the latest timestamp from the database for this device
        latest_reading = TreeMoistureReading.objects.filter(device=device).order_by('-timestamp').first()
        if latest_reading:
            latest_time = latest_reading.timestamp
        else:
            latest_time = make_aware(datetime.min, timezone=utc)

        api_url = f'https://api.treesense.net/moisture-content/{device.device_id}'
        headers = {'Authorization': f'Bearer {access_token}'}

        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            response_json = response.json()

            extracted_values = [re.split(',', element) for element in response_json[2:]]

            data_objects = []
            for sublist in extracted_values:
                time_str = sublist[0]
                time_parsed = datetime.strptime(time_str, '%Y-%m-%dT%H:%M:%SZ')
                time_parsed = make_aware(time_parsed, timezone=utc)
                if time_parsed > latest_time:
                    moisture_value = float(sublist[5]) * 100
                    data_objects.append(TreeMoistureReading(
                        device=device,
                        timestamp=time_parsed,  # Use time_parsed
                        moisture_value=moisture_value
                    ))

            if data_objects:
                TreeMoistureReading.objects.bulk_create(data_objects)

            self.stdout.write(self.style.SUCCESS('Tree moisture data fetched and stored successfully'))
        else:
            self.stdout.write(self.style.ERROR(f'Failed to fetch tree moisture data. Status code: {response.status_code}'))

    def fetch_electrical_resistance_data(self, access_token):
        # Get or create the device
        device, created = Device.objects.get_or_create(
            device_id='A84041B42187E5C6',
            defaults={'name': 'Cox Orangenrenette', 'location': 'Default Location'}
        )

        # Get the latest timestamp from the database for this device
        latest_reading = ElectricalResistanceReading.objects.filter(device=device).order_by('-timestamp').first()
        if latest_reading:
            latest_time = latest_reading.timestamp
        else:
            latest_time = make_aware(datetime.min, timezone=utc)

        api_url = f'https://api.treesense.net/data/{device.device_id}'
        headers = {'Authorization': f'Bearer {access_token}'}

        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            response_json = response.json()

            extracted_values = [re.split(',', element) for element in response_json[2:]]

            data_objects = []
            for sublist in extracted_values:
                time_str = sublist[0]
                time_parsed = datetime.strptime(time_str, '%Y-%m-%dT%H:%M:%SZ')
                time_parsed = make_aware(time_parsed, timezone=utc)
                if time_parsed > latest_time:
                    resistance_value = float(sublist[3])
                    data_objects.append(ElectricalResistanceReading(
                        device=device,
                        timestamp=time_parsed,  # Use time_parsed
                        resistance_value=resistance_value
                    ))

            if data_objects:
                ElectricalResistanceReading.objects.bulk_create(data_objects)

            self.stdout.write(self.style.SUCCESS('Electrical resistance data fetched and stored successfully'))
        else:
            self.stdout.write(self.style.ERROR(f'Failed to fetch electrical resistance data. Status code: {response.status_code}'))

    def fetch_tree_health_data(self, access_token):
        # Get or create the device
        device, created = Device.objects.get_or_create(
            device_id='A84041B42187E5C6',
            defaults={'name': 'Cox Orangenrenette', 'location': 'Default Location'}
        )

        api_url = 'https://api.treesense.net/trees'
        headers = {'Authorization': f'Bearer {access_token}'}

        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            response_json = response.json()

            data_objects = []
            for item in response_json:
                if 'A84041B42187E5C6' in item['hardware_serials']:
                    time_parsed = tz_now()
                    health_state = item['health_state']
                    data_objects.append(TreeHealthReading(
                        device=device,
                        timestamp=time_parsed,  # Use current time as the timestamp
                        health_state=health_state
                    ))

            if data_objects:
                TreeHealthReading.objects.bulk_create(data_objects)

            self.stdout.write(self.style.SUCCESS('Tree health data fetched and stored successfully'))
        else:
            self.stdout.write(self.style.ERROR(f'Failed to fetch tree health data. Status code: {response.status_code}'))

    def handle(self, *args, **kwargs):
        while True:
            try:
                self.stdout.write(self.style.NOTICE('Attempting to run fetch_data command...'))

                access_token = self.authenticate()

                if access_token:
                    self.fetch_tree_moisture_data(access_token)
                    self.fetch_electrical_resistance_data(access_token)
                    self.fetch_tree_health_data(access_token)
                    self.stdout.write(f"Next execution in 20 minutes at {tz_now() + timedelta(minutes=20)}")

                else:
                    self.stdout.write(self.style.ERROR('Authentication failed or access token not available'))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))

            # Wait for 20 minutes before the next execution
            time.sleep(20 * 60)  # No name conflict now
