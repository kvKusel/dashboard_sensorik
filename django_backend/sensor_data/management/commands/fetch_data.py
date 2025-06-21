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
import pandas as pd
from io import StringIO, BytesIO
from django.utils.timezone import now as tz_now, make_aware, utc
from django.db import connections, connection, transaction
import ftplib


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
    from sensor_data.models import Device, TreeMoistureReading, ElectricalResistanceReading, TreeHealthReading, WeatherData, HistoricalPrecipitation, ForecastedPrecipitation, waterLevelReading
    print("Successfully imported sensor_data.models")
except ModuleNotFoundError as e:
    print(f"Error importing sensor_data.models: {e}")
    
    
    
class Command(BaseCommand):
    help = 'Fetch precipitation data, weahter data and Treesense data, then store them in the database'

    def handle(self, *args, **kwargs):
        while True:  # Infinite loop to repeatedly fetch data every 20 minutes
            self.stdout.write(self.style.NOTICE('Attempting to fetch data...'))

            # Fetch and save the water level data from RLP API              
            self.fetch_water_level_data()


            # Fetch precipitation data
            self.fetch_precipitation_data()
            
            # fetch weather station data from FTP server
            self.fetch_ftp_weather_data()


            # Authenticate and fetch tree data
            access_token = self.authenticate()  # Get the token
            if access_token:
                self.fetch_tree_data(access_token)  # Pass token here
            else:
                self.stdout.write(self.style.ERROR("Authentication failed, skipping tree moisture data fetch."))

            # Wait for 60 minutes before running again
            self.stdout.write(self.style.NOTICE(f"Next execution in 15 minutes at {tz_now() + timedelta(minutes=60)}"))
            time.sleep(15 * 60)  # Sleep for 15 minutes (15 minutes * 60 seconds)
            
            
            
######################################################          # Fetch and save the weather station data for Weatherstation Lohnweiler      ########################################################


    def fetch_ftp_weather_data(self):
            """Fetch weather data from FTP server"""
            # Get FTP credentials from environment variables
            ftp_host = os.getenv('FTP_HOST')
            ftp_username = os.getenv('FTP_USERNAME')
            ftp_password = os.getenv('FTP_PASSWORD')
            csv_filename = os.getenv('FTP_CSV_FILENAME', 'weather_data.csv')  # Default filename
            device_id = 'ftp_weather_station'
            
            if not all([ftp_host, ftp_username, ftp_password]):
                self.stdout.write(self.style.WARNING('FTP credentials not found in environment variables. Skipping FTP weather data fetch.'))
                return
            
            try:
                # Connect to FTP server and fetch data
                csv_data = self.fetch_csv_from_ftp(ftp_host, ftp_username, ftp_password, csv_filename)
                
                if csv_data:
                    # Process and save the data
                    self.process_and_save_ftp_data(csv_data, device_id)
                    self.stdout.write(self.style.SUCCESS('FTP weather data fetched and stored successfully'))
                else:
                    self.stdout.write(self.style.ERROR('Failed to fetch CSV data from FTP server'))
                    
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error processing FTP weather data: {e}'))

    def fetch_csv_from_ftp(self, host, username, password, filename):
        """Fetch CSV file from FTP server"""
        try:
            # Connect to FTP server
            ftp = ftplib.FTP_TLS(host)
            ftp.login(username, password)
            
            # Explicitly switch to secure data connection
            ftp.prot_p()
            
            self.stdout.write(self.style.SUCCESS(f'Connected to FTP server with SSL/TLS: {host}'))
            
            # List files to verify the file exists
            files = ftp.nlst()
            if filename not in files:
                self.stdout.write(self.style.ERROR(f'File {filename} not found on FTP server. Available files: {files}'))
                ftp.quit()
                return None
            
            # Download the file content
            csv_bytes = BytesIO()
            ftp.retrbinary(f'RETR {filename}', csv_bytes.write)
            ftp.quit()

            csv_data = csv_bytes.getvalue().decode('latin1')  # or 'iso-8859-1'

            self.stdout.write(self.style.SUCCESS(f'Successfully downloaded {filename} from FTP server'))
            
            return csv_data
            
        except ftplib.all_errors as e:
            self.stdout.write(self.style.ERROR(f'FTP error: {e}'))
            return None
        
        
        
            
            
    def process_and_save_ftp_data(self, csv_data, device_id):
        """Process CSV data and save new records to database"""

        # Temporarily disable auto_now_add on the timestamp field
        timestamp_field = WeatherData._meta.get_field('timestamp')
        original_auto_now_add = timestamp_field.auto_now_add
        timestamp_field.auto_now_add = False

        try:
            # Parse CSV data
            df = pd.read_csv(StringIO(csv_data), sep=';', engine='python')

            # Get or create the device
            device, created = Device.objects.get_or_create(
                device_id=device_id,
                defaults={'name': f'FTP Weather Station {device_id}'}
            )

            # Get the latest timestamp from database for this device
            latest_reading = WeatherData.objects.filter(device=device).order_by('-timestamp').first()
            latest_timestamp = latest_reading.timestamp if latest_reading else None

            # Process each row
            new_records = []
            skipped_count = 0

            for index, row in df.iterrows():
                try:
                    # Parse timestamp from 'Messzeit'
                    if 'Messzeit' in df.columns:
                        timestamp_str = str(row['Messzeit']).strip()
                        try:
                            # Parse the timestamp
                            naive_timestamp = datetime.strptime(timestamp_str, '%d.%m.%Y %H:%M')
                            from django.utils import timezone as django_timezone
                            timestamp = django_timezone.make_aware(naive_timestamp)
                        except ValueError:
                            continue
                    else:
                        continue

                    # Skip if we already have this timestamp
                    if latest_timestamp and timestamp <= latest_timestamp:
                        skipped_count += 1
                        continue

                    # Extract weather data - adjust column names based on your CSV
                    weather_record = WeatherData(
                        device=device,
                        timestamp=timestamp,
                        temperature=self.safe_float(row.get('Lufttemperatur [C]', 0)),
                        humidity=self.safe_float(row.get('Luftfeuchte [%]', 0)),
                        wind_speed=self.safe_float(row.get('mittl. Windgeschwindigkeit [m/s]', 0)),
                        wind_direction=self.safe_float(row.get('Windrichtung [Grad]', 0)),
                        precipitation=self.safe_float(row.get('Niederschlag [mm]', 0)),
                        air_pressure=self.safe_float(row.get('Luftdruck [hPa]', 0)),
                        uv=None,
                        luminosity=None,
                        rainfall_counter=0
                    )

                    new_records.append(weather_record)

                except Exception:
                    continue

            if new_records:
                with transaction.atomic():
                    WeatherData.objects.bulk_create(new_records)
            
        except Exception:
            pass

        finally:
            # Restore the original auto_now_add setting
            timestamp_field.auto_now_add = original_auto_now_add

            

    def safe_float(self, value):
        """Safely convert value to float, handling various formats"""
        if value is None or pd.isna(value):
            return 0.0
        
        try:
            # Handle comma as decimal separator
            if isinstance(value, str):
                value = value.replace(',', '.')
            return float(value)
        except (ValueError, TypeError):
            return 0.0
            
            
            
            
######################################################          # Fetch and save the water level data from RLP API  (Pegel Untersulzbach, Lohnweiler...)      ########################################################
    def fetch_water_level_data(self):
        sources = [
            {
                "url": "https://geodaten-wasser.rlp-umwelt.de/api/export/messstellen_wasserstand_messwerte.csv?w=messstellennummer%3D2546070400",
                "device_id": "pegel_untersulzbach",
                "name": "Pegel Untersulzbach"
            },
            {
                "url": "https://geodaten-wasser.rlp-umwelt.de/api/export/messstellen_wasserstand_messwerte.csv?w=messstellennummer%3D2546077000",
                "device_id": "pegel_lohnweiler_land",
                "name": "Pegel Lohnweiler / RLP"
            },
            {
                "url": "https://geodaten-wasser.rlp-umwelt.de/api/export/messstellen_wasserstand_messwerte.csv?w=messstellennummer%3D2546052200",
                "device_id": "pegel_stausee_ohmbach",
                "name": "Pegel Stausee Ohmbach"
            },
            {
                "url": "https://geodaten-wasser.rlp-umwelt.de/api/export/messstellen_wasserstand_messwerte.csv?w=messstellennummer%3D2546015800",
                "device_id": "pegel_nanzdietschweiler",
                "name": "Pegel Nanzdietschweiler"
            },
            {
                "url": "https://geodaten-wasser.rlp-umwelt.de/api/export/messstellen_wasserstand_messwerte.csv?w=messstellennummer%3D2546061300",
                "device_id": "pegel_rammelsbach",
                "name": "Pegel Rammelsbach 2"
            },
            {
                "url": "https://geodaten-wasser.rlp-umwelt.de/api/export/messstellen_wasserstand_messwerte.csv?w=messstellennummer%3D2546030700",
                "device_id": "pegel_eschenau",
                "name": "Pegel Eschenau"
            },
            {
                "url": "https://geodaten-wasser.rlp-umwelt.de/api/export/messstellen_wasserstand_messwerte.csv?w=messstellennummer%3D2546080600",
                "device_id": "pegel_sulzhof",
                "name": "Pegel Sulzhof"
            },
            {
                "url": "https://geodaten-wasser.rlp-umwelt.de/api/export/messstellen_wasserstand_messwerte.csv?w=messstellennummer%3D2546085000",
                "device_id": "pegel_odenbach_steinbruch",
                "name": "Pegel Odenbach Steinbruch"
            },
            {
                "url": "https://geodaten-wasser.rlp-umwelt.de/api/export/messstellen_wasserstand_messwerte.csv?w=messstellennummer%3D2546040900",
                "device_id": "pegel_odenbach",
                "name": "Pegel Odenbach"
            },
            {
                "url": "https://geodaten-wasser.rlp-umwelt.de/api/export/messstellen_wasserstand_messwerte.csv?w=messstellennummer%3D2546058800",
                "device_id": "pegel_niedermohr",
                "name": "Pegel Niedermohr"
            },
            {
                "url": "https://geodaten-wasser.rlp-umwelt.de/api/export/messstellen_wasserstand_messwerte.csv?w=messstellennummer%3D2546090800",
                "device_id": "pegel_loellbach",
                "name": "Pegel Löllbach"
            }
            
        ]
        

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "Accept": "text/csv,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Referer": "https://geodaten-wasser.rlp-umwelt.de/",
            "Connection": "keep-alive",
        }

        for source in sources:
            try:
                response = requests.get(source["url"], headers=headers)
                response.raise_for_status()
                df = pd.read_csv(StringIO(response.text), sep=';')

                device, _ = Device.objects.get_or_create(
                    device_id=source["device_id"],
                    defaults={"name": source["name"]}
                )

                last_entry = waterLevelReading.objects.filter(device=device).order_by('-timestamp').first()
                last_timestamp = last_entry.timestamp if last_entry else None

                for _, row in df.iterrows():
                    try:
                        timestamp = datetime.strptime(row["Datum"], "%d.%m.%Y %H:%M") - timedelta(hours=1)
                        timestamp = make_aware(timestamp, timezone.utc)
                        if last_timestamp is None or timestamp > last_timestamp:
                            waterLevelReading.objects.create(
                                timestamp=timestamp,
                                water_level_value=row["Wasserstand in cm"],
                                device=device
                            )
                    except Exception as e:
                        print(f"Skipping row for {source['device_id']} due to error: {e}")

                self.stdout.write(self.style.SUCCESS(f"{source['name']} data fetched and stored successfully."))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to fetch/store data for {source['name']}: {e}"))



######################################################          # Fetch and save the forecasted and historical precipitation data from OpenWeatherMap API         ########################################################   

        
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
