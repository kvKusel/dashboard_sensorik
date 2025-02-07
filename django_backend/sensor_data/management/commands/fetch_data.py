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
        
        # Wait for 20 minutes before the next execution
        time.sleep(60 * 60)  # No name conflict now

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

# class Command(BaseCommand):
#     help = 'Fetches data from Treesense and stores it'

#     def authenticate(self):
#         try:
#             # Define login endpoint URL and the login data
#             login_url = 'https://api.treesense.net/login'
#             email = os.getenv("LOGIN_EMAIL")
#             password = os.getenv("LOGIN_PASSWORD")

#             if not email or not password:
#                 self.stdout.write(self.style.ERROR("Login credentials not found in environment variables."))
#                 return None

#             # Define login payload (username and password)
#             payload = {
#                 "email": email,
#                 "password": password
#             }

#             # Set up headers
#             headers = {
#                 'accept': 'application/json',
#                 'Content-Type': 'application/json'
#             }

#             # Send a POST request to the login endpoint with the payload
#             response = requests.post(login_url, json=payload, headers=headers)

#             # Check if the request was successful (status code 200)
#             if response.status_code == 200:
#                 # Extract the access token from the response JSON
#                 access_token = response.json().get('accessToken')
#                 return access_token
#             else:
#                 # Handle authentication failure or other error
#                 self.stdout.write(self.style.ERROR(f"Failed to authenticate. Status code: {response.status_code}"))
#                 return None

#         except Exception as e:
#             # Print the error message to the terminal
#             self.stdout.write(self.style.ERROR(f"Error during authentication: {str(e)}"))
#             return None

#     def fetch_tree_moisture_data(self, access_token):
#         # Re-open the connection before operations
#         connections.close_all()
#         connections['default'].connect()

#         # List of devices
#         devices = [
#             {'device_id': 'A84041B42187E5C6', 'name': 'Cox Orangenrenette', 'location': 'Default Location'},
#             {'device_id': 'A840418F1187E5C4', 'name': 'Pleiner Mostbirne', 'location': 'Streuobstwiese'},
#             {'device_id': 'A840414A6187E5C5', 'name': 'Schöner von Nordhausen', 'location': 'Streuobstwiese'}
#         ]

#         for device_info in devices:
#             # Get or create the device
#             device, created = Device.objects.get_or_create(
#                 device_id=device_info['device_id'],
#                 defaults={'name': device_info['name'], 'location': device_info['location']}
#             )

#             # Get the latest timestamp from the database for this device
#             latest_reading = TreeMoistureReading.objects.filter(device=device).order_by('-timestamp').first()
#             latest_time = latest_reading.timestamp if latest_reading else make_aware(datetime.min, timezone.utc)

#             api_url = f'https://api.treesense.net/moisture-content/{device.device_id}'
#             headers = {'Authorization': f'Bearer {access_token}'}

#             response = requests.get(api_url, headers=headers)

#             if response.status_code == 200:
#                 response_json = response.json()

#                 # Ensure there is data beyond headers
#                 if len(response_json) < 3:
#                     self.stdout.write(self.style.WARNING(f'No valid data found for device {device.device_id}'))
#                     continue

#                 # Extract data rows (skip headers)
#                 extracted_values = [row.split(',') for row in response_json[2:] if ',' in row]

#                 data_objects = []
#                 for sublist in extracted_values:
#                     if len(sublist) < 5:
#                         self.stdout.write(self.style.WARNING(f'Skipping incomplete data row: {sublist}'))
#                         continue  # Skip rows that don't have at least 5 values

#                     time_str = sublist[0]
#                     try:
#                         time_parsed = datetime.strptime(time_str, '%Y-%m-%dT%H:%M:%SZ')
#                         time_parsed = make_aware(time_parsed, timezone.utc)
#                     except ValueError as e:
#                         self.stdout.write(self.style.ERROR(f"Skipping invalid time format: {time_str} - Error: {e}"))
#                         continue  # Skip if time format is invalid

#                     if time_parsed > latest_time:
#                         try:
#                             resistance = float(sublist[3])  # Resistance (moisture indicator)
#                             temperature = float(sublist[4])  # Temperature

#                             data_objects.append(TreeMoistureReading(
#                                 device=device,
#                                 timestamp=time_parsed,
#                                 moisture_value=resistance  # Using resistance as "moisture"
#                             ))
#                         except ValueError as e:
#                             self.stdout.write(self.style.ERROR(f"Skipping invalid row: {sublist} - Error: {e}"))
#                             continue  # Skip problematic rows

#                 if data_objects:
#                     TreeMoistureReading.objects.bulk_create(data_objects)
#                     self.stdout.write(self.style.SUCCESS(f'Tree moisture data for device {device.device_id} fetched and stored successfully'))
#                 else:
#                     self.stdout.write(self.style.WARNING(f'No new data for device {device.device_id}'))
#             else:
#                 self.stdout.write(self.style.ERROR(f'Failed to fetch tree moisture data for device {device.device_id}. Status code: {response.status_code}'))
                
                
            
    # def fetch_electrical_resistance_data(self, access_token):
    #     # Re-open the connection before operations
    #     connections.close_all()
    #     connections['default'].connect()

    #     # List of devices
    #     devices = [
    #         {'device_id': 'A84041B42187E5C6', 'name': 'Cox Orangenrenette', 'location': 'Default Location'},
    #         {'device_id': 'B93052C43298F7D8', 'name': 'Golden Delicious', 'location': 'Orchard A'},
    #         {'device_id': 'C75163D54321G9E1', 'name': 'Granny Smith', 'location': 'Orchard B'}
    #     ]

    #     for device_info in devices:
    #         # Get or create the device
    #         device, created = Device.objects.get_or_create(
    #             device_id=device_info['device_id'],
    #             defaults={'name': device_info['name'], 'location': device_info['location']}
    #         )

    #         # Get the latest timestamp from the database for this device
    #         latest_reading = ElectricalResistanceReading.objects.filter(device=device).order_by('-timestamp').first()
    #         if latest_reading:
    #             latest_time = latest_reading.timestamp
    #         else:
    #             latest_time = make_aware(datetime.min, timezone.utc)

    #         api_url = f'https://api.treesense.net/data/{device.device_id}'
    #         headers = {'Authorization': f'Bearer {access_token}'}

    #         response = requests.get(api_url, headers=headers)

    #         if response.status_code == 200:
    #             response_json = response.json()

    #             extracted_values = [re.split(',', element) for element in response_json[2:] if not element.startswith("_time")]

    #             data_objects = []
    #             for sublist in extracted_values:
    #                 time_str = sublist[0]
    #                 time_parsed = datetime.strptime(time_str, '%Y-%m-%dT%H:%M:%SZ')
    #                 time_parsed = make_aware(time_parsed, timezone.utc)
    #                 if time_parsed > latest_time:
    #                     resistance_value = float(sublist[3])
    #                     data_objects.append(ElectricalResistanceReading(
    #                         device=device,
    #                         timestamp=time_parsed,  # Use time_parsed
    #                         resistance_value=resistance_value
    #                     ))

    #             if data_objects:
    #                 ElectricalResistanceReading.objects.bulk_create(data_objects)

    #             self.stdout.write(self.style.SUCCESS(f'Electrical resistance data for device {device.device_id} fetched and stored successfully'))
    #         else:
    #             self.stdout.write(self.style.ERROR(f'Failed to fetch electrical resistance data for device {device.device_id}. Status code: {response.status_code}'))


    # def fetch_tree_health_data(self, access_token):
    #     # Re-open the connection before operations
    #     connections.close_all()
    #     connections['default'].connect()

    #     # List of devices to fetch data for
    #     devices = [
    #         {
    #             'device_id': 'A84041B42187E5C6',
    #             'name': 'Cox Orangenrenette',
    #             'location': 'Streuobstwiese'
    #         },
    #         {
    #             'device_id': 'A840414A6187E5C5',
    #             'name': 'Schöner von Nordhausen',
    #             'location': 'Streuobstwiese'
    #         },
    #         {
    #             'device_id': 'A840418F1187E5C4',
    #             'name': 'Pleiner Mostbirne',
    #             'location': 'Streuobstwiese'
    #         }
    #     ]



    #     api_url = 'https://api.treesense.net/trees'
    #     headers = {'Authorization': f'Bearer {access_token}'}

    #     response = requests.get(api_url, headers=headers)


    #     if response.status_code == 200:
    #             response_json = response.json()

    #             for device_info in devices:
    #                 # Get or create the device
    #                 device, created = Device.objects.get_or_create(
    #                     device_id=device_info['device_id'],
    #                     defaults={'name': device_info['name'], 'location': device_info['location']}
    #                 )

    #                 data_objects = []
    #                 for item in response_json:
    #                     if device_info['device_id'] in item['hardware_serials']:
    #                         time_parsed = tz_now()
    #                         health_state = item['health_state']
    #                         data_objects.append(TreeHealthReading(
    #                             device=device,
    #                             timestamp=time_parsed,  # Use current time as the timestamp
    #                             health_state=health_state
    #                         ))

    #                 if data_objects:
    #                     TreeHealthReading.objects.bulk_create(data_objects)
    #                     self.stdout.write(self.style.SUCCESS(f'Tree health data for {device.device_id} fetched and stored successfully'))
    #     else:
    #         self.stdout.write(self.style.ERROR(f'Failed to fetch tree health data. Status code: {response.status_code}'))

  
    # def handle(self, *args, **kwargs):
    #     while True:
    #         try:
    #             self.stdout.write(self.style.NOTICE('Attempting to run fetch_data command...'))

    #             access_token = self.authenticate()

    #             if access_token:
    #                 self.fetch_tree_moisture_data(access_token)
    #                 self.fetch_electrical_resistance_data(access_token)
    #                 self.fetch_tree_health_data(access_token)


    #                 self.stdout.write(f"Next execution in 20 minutes at {tz_now() + timedelta(minutes=20)}")

    #             else:
    #                 self.stdout.write(self.style.ERROR('Authentication failed or access token not available'))

    #         except Exception as e:
    #             self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))

    #         # Close connections after operations
    #         connections.close_all()

    #         # Wait for 20 minutes before the next execution
    #         time.sleep(20 * 60)  # No name conflict now
            


# Run the command if this script is executed directly
if __name__ == "__main__":
    from django.core.management import call_command
    call_command('fetch_data')
