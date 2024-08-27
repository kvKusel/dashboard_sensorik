import requests
from django.http import JsonResponse
from django.db import connection
import csv
from django.views import View
from influxdb_client import InfluxDBClient
from .queries import query_soil_moisture_pleiner_mostbirne, query_soil_moisture_roter_boskoop, query_soil_moisture_schoener_von_nordhausen, query_soil_moisture_cox_orangenrenette, query_soil_moisture_jonathan, query_weather_station_precipitation, query_weather_station_temperature, query_weather_station_uv_index, query_weather_station_humidity, query_weather_station_air_pressure, query_weather_station_wind_speed, query_weather_station_wind_direction
import os
import json
from collections import defaultdict
from datetime import datetime, timedelta
import re
from django.http import HttpResponse
import pandas as pd
from django.shortcuts import render
from sensor_data.models import TreeMoistureReading, Device, ElectricalResistanceReading, TreeHealthReading, WeatherData, SoilMoistureReading, pHReading, waterLevelReading
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging
from django.utils import timezone


# render the index page
def index(request):
    return render(request, 'index.html')


#right now the data is not saved into the database (models.py), fix it in the future (using worker?) 

##################################################              soil moisture sensors endpoint        #########################################################################


class SoilDataView(View):
    def get(self, request, *args, **kwargs):
        try:
            # Read InfluxDB configuration from environment variables
            influxdb_host_url = os.getenv("INFLUXDB_HOST_URL")
            influxdb_token = os.getenv("INFLUXDB_TOKEN")
            influxdb_org = os.getenv("INFLUXDB_ORG")
            
            client = InfluxDBClient(url=influxdb_host_url, token=influxdb_token, org=influxdb_org)

            # Determine the type of query based on the request
            query_type = request.GET.get("query_type")

            if query_type == "pleiner_mostbirne":
                df = query_soil_moisture_pleiner_mostbirne(client, org=influxdb_org)
                if df is not None:
                    # Convert the 'value' column to float format from string
                    df['value'] = df['value'].astype(float)
                    # Convert the 'time' column to datetime format
                    df['time'] = pd.to_datetime(df['time'])

                    # Round '_time' to nearest hour
                    df['time'] = df['time'].dt.round('H')

                    # Group by '_time' and calculate the mean of '_value' for each hour
                    df = df.groupby('time').mean().reset_index()
                    df['value'] = df['value'].astype(str)      
                    
            elif query_type == "roter_boskoop":
                df = query_soil_moisture_roter_boskoop(client, org=influxdb_org)
                if df is not None:
                    # Convert the 'value' column to float format from string
                    df['value'] = df['value'].astype(float)
                    # Convert the 'time' column to datetime format
                    df['time'] = pd.to_datetime(df['time'])

                    # Round '_time' to nearest hour
                    df['time'] = df['time'].dt.round('H')

                    # Group by '_time' and calculate the mean of '_value' for each hour
                    df = df.groupby('time').mean().reset_index()
                    df['value'] = df['value'].astype(str)      
                    
            elif query_type == "schoener_von_nordhausen":
                df = query_soil_moisture_schoener_von_nordhausen(client, org=influxdb_org)
                if df is not None:
                    # Convert the 'value' column to float format from string
                    df['value'] = df['value'].astype(float)
                    # Convert the 'time' column to datetime format
                    df['time'] = pd.to_datetime(df['time'])

                    # Round '_time' to nearest hour
                    df['time'] = df['time'].dt.round('H')

                    # Group by '_time' and calculate the mean of '_value' for each hour
                    df = df.groupby('time').mean().reset_index()
                    df['value'] = df['value'].astype(str)      
            elif query_type == "cox_orangenrenette":
                df = query_soil_moisture_cox_orangenrenette(client, org=influxdb_org)
                if df is not None:
                    # Convert the 'value' column to float format from string
                    df['value'] = df['value'].astype(float)
                    # Convert the 'time' column to datetime format
                    df['time'] = pd.to_datetime(df['time'])

                    # Round '_time' to nearest hour
                    df['time'] = df['time'].dt.round('H')

                    # Group by '_time' and calculate the mean of '_value' for each hour
                    df = df.groupby('time').mean().reset_index()
                    df['value'] = df['value'].astype(str)      
            elif query_type == "jonathan":
                df = query_soil_moisture_jonathan(client, org=influxdb_org)
                if df is not None:
                    # Convert the 'value' column to float format from string
                    df['value'] = df['value'].astype(float)
                    # Convert the 'time' column to datetime format
                    df['time'] = pd.to_datetime(df['time'])

                    # Round '_time' to nearest hour
                    df['time'] = df['time'].dt.round('H')

                    # Group by '_time' and calculate the mean of '_value' for each hour
                    df = df.groupby('time').mean().reset_index()
                    df['value'] = df['value'].astype(str)      
            else:
                return JsonResponse({"error": "Invalid query type"}, status=400)

            # Convert DataFrame to JSON
            if df is not None:
                json_data = df.to_json(orient="records", date_format="iso")
                return JsonResponse(json_data, safe=False)             
            else:
                return JsonResponse({"error": "Query result is empty"}, status=404)

        except Exception as e:
            # Print the error message to the terminal
            print(f"Error in SoilDataView: {str(e)}")

            # Return a JSON response indicating the error
            return JsonResponse({"error": str(e)}, status=500)
        

##################################################              weather station endpoint        #########################################################################
        

class WeatherStationDataView(View):
    def get(self, request, *args, **kwargs):
        try:
            # Read InfluxDB configuration from environment variables
            influxdb_host_url = os.getenv("INFLUXDB_HOST_URL")
            influxdb_token = os.getenv("INFLUXDB_TOKEN")
            influxdb_org = os.getenv("INFLUXDB_ORG")
            
            # Create an InfluxDB client
            client = InfluxDBClient(url=influxdb_host_url, token=influxdb_token, org=influxdb_org)

            # Determine the type of query based on the request
            query_type = request.GET.get("query_type")

            # Execute the appropriate query based on the query type
            if query_type == "precipitation":
                df = query_weather_station_precipitation(client, org=influxdb_org)
                df.drop(df.tail(1).index, inplace=True)
            elif query_type == "temperature":
                df = query_weather_station_temperature(client, org=influxdb_org)
                df.drop(df.tail(1).index, inplace=True)
            elif query_type == "uv_index":
                df = query_weather_station_uv_index(client, org=influxdb_org)
            elif query_type == "humidity":
                df = query_weather_station_humidity(client, org=influxdb_org)  
                df.drop(df.tail(1).index, inplace=True)
            elif query_type == "air_pressure":
                df = query_weather_station_air_pressure(client, org=influxdb_org)    
                df.drop(df.tail(1).index, inplace=True)
                df["value"] = (df["value"] / 100) + 40  # Divide each value by 100


            elif query_type == "wind_speed":
                df = query_weather_station_wind_speed(client, org=influxdb_org)           
            elif query_type == "wind_direction":
                df = query_weather_station_wind_direction(client, org=influxdb_org)              
            else:
                return JsonResponse({"error": "Invalid query type"}, status=400)

            # Convert DataFrame to JSON
            if df is not None:
                json_data = df.to_json(orient="records", date_format="iso")
                return JsonResponse(json_data, safe=False)                             
            else:
                return JsonResponse({"error": "Query result is empty"}, status=404)

        except Exception as e:
            # Print the error message to the terminal
            print(f"Error in WeatherStationDataView: {str(e)}")

            # Return a JSON response indicating the error
            return JsonResponse({"error": str(e)}, status=500)


##################################################              TreeSense electrical resistance endpoint        ################################################################

class ElectricalResistanceDataView(View):
    def get(self, request, *args, **kwargs):
        # Fetch the latest data from the database
        try:
            device = Device.objects.get(device_id='A84041B42187E5C6')
            latest_readings = ElectricalResistanceReading.objects.filter(device=device).order_by('-timestamp')[:120]  # Adjust the number of records as needed

            data = []
            for reading in latest_readings:
                data.append({
                    'time': reading.timestamp.isoformat(),
                    'value': reading.resistance_value,
                })

            return JsonResponse(data, safe=False)

        except Device.DoesNotExist:
            return JsonResponse({'error': 'Device not found'}, status=404)

##################################################              TreeSense tree moisture content endpoint        ################################################################


class TreeMoistureContentDataView(View):
    def get(self, request, *args, **kwargs):
        # Fetch the latest data from the database
        try:
            device = Device.objects.get(device_id='A84041B42187E5C6')
            latest_readings = TreeMoistureReading.objects.filter(device=device).order_by('-timestamp')[:120]  # Adjust the number of records as needed

            data = []
            for reading in latest_readings:
                data.append({
                    'time': reading.timestamp.isoformat(),
                    'value': reading.moisture_value,
                })

            return JsonResponse(data, safe=False)

        except Device.DoesNotExist:
            return JsonResponse({'error': 'Device not found'}, status=404)       

##################################################              TreeSense tree general health endpoint        ################################################################

class TreeHealthDataView(View):
    def get(self, request, *args, **kwargs):
        device_id = request.GET.get('device_id', None)
        
        if not device_id:
            return JsonResponse({'error': 'Device ID is required'}, status=400)
       
        # Fetch the latest data from the database
        try:
            device = Device.objects.get(device_id=device_id)
            latest_readings = TreeHealthReading.objects.filter(device=device).order_by('-timestamp')[:16]  # Adjust the number of records as needed

            data = []
            for reading in latest_readings:
                data.append({
                    'time': reading.timestamp.isoformat(),
                    'status': reading.health_state,
                })

            return JsonResponse(data, safe=False)

        except Device.DoesNotExist:
            return JsonResponse({'error': 'Device not found'}, status=404)
        

#############################              TTN Webhooks - weathers station Siebenpfeiffer Gymnasium        ###########################################
logger = logging.getLogger(__name__)

ALLOWED_DEVICE_IDS = {
    "24e124454d083548-wetter-schule": {
        'type': 'weather_station',
        'field_mapping': {
        'temperature': 'temperature',
        'humidity': 'humidity',
        'wind_speed': 'wind_speed',
        'wind_direction': 'wind_direction',
        'precipitation': 'rainfall_total',
        'air_pressure': 'pressure',
        'uv': 'uv',
        'luminosity': 'luminosity',
        'rainfall_counter': 'rainfall_counter'
        }
    },
    "a840413cc1884fb6-hochbeet-moisture1": {
        'type': 'soil_moisture_sensor',
        'field_mapping': {
            'soil_moisture_value': 'water_SOIL'
        }
    },
    "a8404182ba5900fe-moisture-dragino-2": {
        'type': 'soil_moisture_sensor',
        'field_mapping': {
            'soil_moisture_value': 'water_SOIL'
        }
    },
    "a840414c035908cd-moisture-dragino-3": {
        'type': 'soil_moisture_sensor',
        'field_mapping': {
            'soil_moisture_value': 'water_SOIL'
        }
    },
    "a84041df075908cc-moisture-dragino-4": {
        'type': 'soil_moisture_sensor',
        'field_mapping': {
            'soil_moisture_value': 'water_SOIL'
        }
    },
    "a84041bf545908c5-moisture-dragino-5": {
        'type': 'soil_moisture_sensor',
        'field_mapping': {
            'soil_moisture_value': 'water_SOIL'
        }
    },
    "a84041ea2b5908ce-moisture-dragino-6": {
        'type': 'soil_moisture_sensor',
        'field_mapping': {
            'soil_moisture_value': 'water_SOIL'
        }
    },
    "a84041f571875f2b-ph-dragino2-schule": {
        'type': 'ph_sensor',
        'field_mapping': {
            'ph_value': 'PH1_SOIL'
        }
    },
    "a84041a8e1875f29-ph-dragino1-schule": {
        'type': 'ph_sensor',
        'field_mapping': {
            'ph_value': 'PH1_SOIL'
        }
    },
"2cf7f1c054400013-ph-sensecap2-schule": {
    'type': 'ph_sensor_sensecap',
    'field_mapping': {
        'temperature': 4097,
        'ph_value': 4106
    }
},
"2cf7f1c05440005d-ph-sensecap-schule": {
    'type': 'ph_sensor_sensecap',
    'field_mapping': {
        'temperature': 4097,
        'ph_value': 4106
    }
},
"eui-a8404169c187e059-water-lvl-kv": {
    'type': 'water_level_sensor',
    'field_mapping': {
        'water_level': "Distance",
    }
}

}



@method_decorator(csrf_exempt, name='dispatch')
class TTNWebhookView(View):

    def post(self, request, *args, **kwargs):
        try:
            logger.info(f"Received webhook data: {request.body}")
            data = json.loads(request.body)

            # Extract device_id from the correct location in the payload
            device_id = data['end_device_ids']['device_id']

            # Check if the device ID is allowed
            if device_id not in ALLOWED_DEVICE_IDS:
                logger.warning(f"Received data from unauthorized device: {device_id}")
                return JsonResponse({'status': 'ignored', 'message': 'Device not recognized'}, status=200)

            device_info = ALLOWED_DEVICE_IDS[device_id]
            device, created = Device.objects.get_or_create(device_id=device_id)

            # Extract payload from the correct location
            payload = data['uplink_message']['decoded_payload']
            device_type = device_info['type']
            field_mapping = device_info['field_mapping']

            logger.debug(f"Device type: {device_type}")
            logger.debug(f"Payload: {payload}")

            if device_type == 'soil_moisture_sensor':
                # Check if the required field is in the payload
                if field_mapping['soil_moisture_value'] not in payload:
                    logger.error(f"Missing field {field_mapping['soil_moisture_value']} in payload: {payload}")
                    return JsonResponse({'status': 'error', 'message': f"Missing field {field_mapping['soil_moisture_value']} in payload"}, status=400)

                moisture_data = {
                    'device': device,
                    'timestamp': timezone.now(),  # Use timezone-aware datetime
                    'soil_moisture_value': float(payload[field_mapping['soil_moisture_value']])
                }

                SoilMoistureReading.objects.create(**moisture_data)
                logger.info(f"Successfully created SoilMoistureReading entry for device {device_id}")
                
            elif device_type == 'weather_station':
                # Create weather data dictionary
                weather_data = {
                    'device': device,
                    'timestamp': timezone.now(),  # Use timezone-aware datetime
                    'temperature': float(payload[field_mapping['temperature']]),
                    'humidity': float(payload[field_mapping['humidity']]),
                    'wind_speed': float(payload[field_mapping['wind_speed']]),
                    'wind_direction': float(payload[field_mapping['wind_direction']]),
                    'precipitation': float(payload[field_mapping['precipitation']]),
                    'air_pressure': float(payload[field_mapping['air_pressure']]),
                    'uv': float(payload[field_mapping['uv']]) if field_mapping['uv'] in payload else None,
                    'luminosity': float(payload[field_mapping['luminosity']]) if field_mapping['luminosity'] in payload else None,
                    'rainfall_counter': float(payload[field_mapping['rainfall_counter']])
                }

                WeatherData.objects.create(**weather_data)
                logger.info(f"Successfully created WeatherData entry for device {device_id}")




            elif device_type == 'ph_sensor':
                if field_mapping['ph_value'] not in payload:
                    logger.error(f"Missing field {field_mapping['ph_value']} in payload: {payload}")
                    return JsonResponse({'status': 'error', 'message': f"Missing field {field_mapping['ph_value']} in payload"}, status=400)

                ph_data = {
                    'device': device,
                    'timestamp': timezone.now(),  # Use timezone-aware datetime
                    'ph_value': float(payload[field_mapping['ph_value']])
                }

                pHReading.objects.create(**ph_data)
                logger.info(f"Successfully created pHReading entry for device {device_id}")

            elif device_type == 'ph_sensor_sensecap':
                messages = payload.get('messages', [])
                ph_value = None
                temperature_value = None
                for message in messages:
                    if message.get('measurementId') == field_mapping['ph_value']:
                        ph_value = message.get('measurementValue')
                    elif message.get('measurementId') == field_mapping['temperature']:
                        temperature_value = message.get('measurementValue')

                if ph_value is not None:
                    ph_data = {
                        'device': device,
                        'timestamp': timezone.now(),  # Use timezone-aware datetime
                        'ph_value': float(ph_value)
                    }

                    new_reading = pHReading.objects.create(**ph_data)
                    logger.info(f"Successfully created pHReading entry (id: {new_reading.id}) for device {device_id} with pH value {ph_value}")
                else:
                    logger.warning(f"No pH value found in payload for device {device_id}")
                    
            elif device_type == 'water_level_sensor':
                if field_mapping['water_level'] not in payload:
                    logger.error(f"Missing field {field_mapping['water_level']} in payload: {payload}")
                    return JsonResponse({'status': 'error', 'message': f"Missing field {field_mapping['water_level']} in payload"}, status=400)

                # Extract and clean the water level value
                water_level_str = payload[field_mapping['water_level']]
                
                # Remove non-numeric characters (except for '.' and '-')
                water_level_str_clean = ''.join(c for c in water_level_str if c.isdigit() or c in ['.', '-'])

                # Convert to float and convert mm to cm
                try:
                    water_level_mm = float(water_level_str_clean)
                    water_level_cm = water_level_mm / 10
                except ValueError:
                    logger.error(f"Invalid water level value: {water_level_str} in payload: {payload}")
                    return JsonResponse({'status': 'error', 'message': f"Invalid water level value: {water_level_str}"}, status=400)

                water_level_data = {
                    'device': device,
                    'timestamp': timezone.now(),  # Use timezone-aware datetime
                    'water_level_value': water_level_cm
                }

                waterLevelReading.objects.create(**water_level_data)
                logger.info(f"Successfully created waterLevelReading entry for device {device_id}")


            return JsonResponse({'status': 'success'})

        except json.JSONDecodeError:
            logger.error("Invalid JSON in webhook payload")
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
        except KeyError as e:
            logger.error(f"Missing required field in webhook payload: {str(e)}")
            return JsonResponse({'status': 'error', 'message': f'Missing required field: {str(e)}'}, status=400)
        except Exception as e:
            logger.exception("Error processing webhook data")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

        
#############################             weather station data Siebenpfeiffer Gymnasium        ###########################################
class WeatherDataView(View):

    def get(self, request, *args, **kwargs):
        try:
            device_id = request.GET.get('device_id')
            if device_id:
                device = Device.objects.get(device_id=device_id)
                weather_data = WeatherData.objects.filter(device=device).order_by('-timestamp')[:100]
                soil_moisture_data = SoilMoistureReading.objects.filter(device=device).order_by('-timestamp')[:100]
            else:
                weather_data = WeatherData.objects.all().order_by('-timestamp')[:100]
                soil_moisture_data = SoilMoistureReading.objects.all().order_by('-timestamp')[:100]

            weather_data_list = []
            for record in weather_data:
                weather_data_list.append({
                    'timestamp': record.timestamp.isoformat(),
                    'temperature': record.temperature,
                    'humidity': record.humidity,
                    'wind_speed': record.wind_speed,
                    'wind_direction': record.wind_direction,
                    'precipitation': record.precipitation,
                    'air_pressure': record.air_pressure,
                })

            soil_moisture_data_list = []
            for record in soil_moisture_data:
                soil_moisture_data_list.append({
                    'timestamp': record.timestamp.isoformat(),
                    'soil_moisture_value': record.soil_moisture_value,
                })

            response_data = {
                'weather_data': weather_data_list,
                'soil_moisture_data': soil_moisture_data_list,
            }

            return JsonResponse(response_data, safe=False)
        except Device.DoesNotExist:
            return JsonResponse({'error': 'Device not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
        
#############################             Soil Moisture Data of Devices from Siebenpfeiffer Gymnasium        ###########################################
class SoilMoistureDataHochbeetProject(View):
    def get(self, request, *args, **kwargs):
        try:
            # Determine the type of query based on the request
            query_type = request.GET.get("query_type")
            if not query_type:
                return JsonResponse({"error": "Query type is required"}, status=400)

            device_ids = {
                "hochbeet_moisture1": "a84041ea2b5908ce-moisture-dragino-6",
                "moisture_dragino_2": "a84041bf545908c5-moisture-dragino-5",
                "moisture_dragino_3": "a840414c035908cd-moisture-dragino-3",
                "moisture_dragino_4": "a84041df075908cc-moisture-dragino-4",
                "moisture_dragino_5": "a840413cc1884fb6-hochbeet-moisture1",
                "moisture_dragino_6": "a8404182ba5900fe-moisture-dragino-2",
            }

            device_id = device_ids.get(query_type)
            if not device_id:
                return JsonResponse({"error": "Invalid query type"}, status=400)

            # Query the device
            try:
                device = Device.objects.get(device_id=device_id)
            except Device.DoesNotExist:
                return JsonResponse({"error": "Device not found"}, status=404)

            # Query the soil moisture readings for the device
            readings = SoilMoistureReading.objects.filter(device=device).order_by('timestamp')

            if readings.exists():
                # Convert queryset to DataFrame
                df = pd.DataFrame(list(readings.values('timestamp', 'soil_moisture_value')))
                df['timestamp'] = pd.to_datetime(df['timestamp'])
                df['timestamp'] = df['timestamp'].dt.round('H')
                df = df.groupby('timestamp').mean().reset_index()
                df['soil_moisture_value'] = df['soil_moisture_value'].astype(str)
                df['timestamp'] = df['timestamp'].dt.strftime('%Y-%m-%dT%H:%M:%SZ')  # Convert to ISO format

                # Prepare response data
                response_data = df.rename(columns={'timestamp': 'time', 'soil_moisture_value': 'value'}).to_dict(orient='records')

                # Return JSON response directly
                return JsonResponse(response_data, safe=False)
            else:
                return JsonResponse({"error": "Query result is empty"}, status=404)

        except Exception as e:
            print(f"Error in SoilMoistureDataHochbeetProject: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
        
        
        
#############################             pH Data of Devices from Siebenpfeiffer Gymnasium        ###########################################


class pHDataHochbeetProject(View):
    def get(self, request, *args, **kwargs):
        try:
            query_type = request.GET.get("query_type")
            if not query_type:
                return JsonResponse({"error": "Query type is required"}, status=400)

            device_ids = {
                "ph_dragino_1": "a84041a8e1875f29-ph-dragino1-schule",
                "ph_dragino_2": "a84041f571875f2b-ph-dragino2-schule",
                "ph_sensecap_2": "2cf7f1c054400013-ph-sensecap2-schule",
                "ph_sensecap_1": "2cf7f1c05440005d-ph-sensecap-schule",
            }

            device_id = device_ids.get(query_type)
            if not device_id:
                return JsonResponse({"error": "Invalid query type"}, status=400)

            try:
                device = Device.objects.get(device_id=device_id)
            except Device.DoesNotExist:
                return JsonResponse({"error": "Device not found"}, status=404)

            readings = pHReading.objects.filter(device=device).order_by('timestamp')

            if readings.exists():
                response_data = list(readings.values('timestamp', 'ph_value'))
                logger.info(f"Response data: {response_data}")

                return JsonResponse(response_data, safe=False)
            else:
                return JsonResponse({"error": "Query result is empty"}, status=404)

        except Exception as e:
            logger.error(f"Error in pHDataHochbeetProject: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
        
        
      
#############################             water level data         ###########################################


class waterLevelDataView(View):
    def get(self, request, *args, **kwargs):
        try:
            query_type = request.GET.get("query_type")
            if not query_type:
                return JsonResponse({"error": "Query type is required"}, status=400)

            device_ids = {
                "water_level_kv": "eui-a8404169c187e059-water-lvl-kv",

            }

            device_id = device_ids.get(query_type)
            if not device_id:
                return JsonResponse({"error": "Invalid query type"}, status=400)

            try:
                device = Device.objects.get(device_id=device_id)
            except Device.DoesNotExist:
                return JsonResponse({"error": "Device not found"}, status=404)

            readings = waterLevelReading.objects.filter(device=device).order_by('timestamp')

            if readings.exists():
                response_data = list(readings.values('timestamp', 'water_level_value'))
                logger.info(f"Response data: {response_data}")

                return JsonResponse(response_data, safe=False)
            else:
                return JsonResponse({"error": "Query result is empty"}, status=404)

        except Exception as e:
            logger.error(f"Error in water level data: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
        
        
        



     
#############################             generate a csv with selected "Hochbeet-Project" data         ###########################################


class ExportAssetDataView(View):
    def get(self, request, *args, **kwargs):
        
        # Calculate the date 30 days ago
        last_30_days = datetime.now() - timedelta(days=30)
        
        asset_name = request.GET.get('asset_name')
        if not asset_name:
            return HttpResponse("Asset name is required", status=400)

        query = """
        WITH ph_data AS (
            SELECT 
                DATE_FORMAT(timestamp, '%%Y-%%m-%%d %%H:00:00') AS timestamp,
                CASE 
                    WHEN device_id = 4 THEN 'Wachstnix'
                    WHEN device_id = 12 THEN 'Kompostplatz 1'
                    WHEN device_id = 5 THEN 'Kohlarabi'
                    WHEN device_id = 16 THEN 'Beethoven'
                    ELSE 'Unknown'
                END AS asset_name,
                ROUND(AVG(ph_value), 1) AS average_ph_value
            FROM sensor_data_phreading
            WHERE timestamp >= %s
            GROUP BY DATE_FORMAT(timestamp, '%%Y-%%m-%%d %%H:00:00'), device_id
        ),
        soil_data AS (
            SELECT 
                DATE_FORMAT(timestamp, '%%Y-%%m-%%d %%H:00:00') AS timestamp,
                CASE 
                    WHEN device_id = 6 THEN 'Kohlarabi'
                    WHEN device_id = 8 THEN 'Beethoven'
                    WHEN device_id = 22 THEN 'Kompostplatz 1'
                    WHEN device_id = 21 THEN 'Übersee'
                    WHEN device_id = 23 THEN 'Shoppingqueen'
                    WHEN device_id = 24 THEN 'Wachstnix'
                    ELSE 'Unknown'
                END AS asset_name,
                ROUND(AVG(soil_moisture_value), 1) AS average_moisture_percentage
            FROM sensor_data_soilmoisturereading
            WHERE timestamp >= %s
            GROUP BY DATE_FORMAT(timestamp, '%%Y-%%m-%%d %%H:00:00'), device_id
        ),
        combined_data AS (
            SELECT 
                COALESCE(ph.timestamp, soil.timestamp) AS timestamp,
                COALESCE(ph.asset_name, soil.asset_name) AS asset_name,
                ph.average_ph_value,
                soil.average_moisture_percentage
            FROM ph_data ph
            LEFT JOIN soil_data soil ON ph.timestamp = soil.timestamp AND ph.asset_name = soil.asset_name
            UNION
            SELECT 
                COALESCE(ph.timestamp, soil.timestamp) AS timestamp,
                COALESCE(ph.asset_name, soil.asset_name) AS asset_name,
                ph.average_ph_value,
                soil.average_moisture_percentage
            FROM ph_data ph
            RIGHT JOIN soil_data soil ON ph.timestamp = soil.timestamp AND ph.asset_name = soil.asset_name
            WHERE ph.timestamp IS NULL
        )
        SELECT *
        FROM combined_data
        WHERE asset_name = %s
        ORDER BY timestamp ASC, asset_name
        """

        with connection.cursor() as cursor:
            cursor.execute(query, [last_30_days, last_30_days, asset_name])
            results = cursor.fetchall()
            
        
        # Check if JSON format is requested
        if request.GET.get('format') == 'json':
            data = []
            for row in results:
                # Convert timestamp to string if it's a datetime object
                timestamp = row[0]
                if isinstance(timestamp, datetime):
                    timestamp = timestamp.isoformat()
                
                data.append({
                    'timestamp': timestamp,
                    'hochbeet': row[1],
                    'ph': row[2],
                    'bodenfeuchte': row[3]
                })
            return JsonResponse(data, safe=False)


        #if not, csv is prepared
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{asset_name}_data.csv"'

        writer = csv.writer(response)
        writer.writerow(['Timestamp', 'Hochbeet', 'pH [-]', 'Bodenfeuchte [%]'])
        for row in results:
            writer.writerow(row)

        return response
    
    
#############################             generate a csv with weather data from "Hochbeet-Project"         ###########################################


class ExportWeatherDataView(View):
    def get(self, request, *args, **kwargs):
        # Calculate the date 30 days ago
        last_30_days = datetime.now() - timedelta(days=30)

        query = """
        SELECT timestamp, temperature, humidity, wind_speed, wind_direction, 
               precipitation, rainfall_counter, air_pressure 
        FROM sensor_data_weatherdata
        WHERE timestamp >= %s
        ORDER BY timestamp ASC
        """

        with connection.cursor() as cursor:
            cursor.execute(query, [last_30_days])
            results = cursor.fetchall()

        # Check if JSON format is requested
        if request.GET.get('format') == 'json':
            # Prepare data for JSON response
            data = []
            for row in results:
                data.append({
                    'timestamp': row[0].isoformat() if row[0] else None,
                    'temperature': row[1],
                    'humidity': row[2],
                    'wind_speed': row[3],
                    'wind_direction': row[4],
                    'precipitation': row[5],
                    'rainfall_counter': row[6],
                    'air_pressure': row[7]
                })
            return JsonResponse(data, safe=False)

        # If not JSON, proceed with CSV response
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="weather_data.csv"'

        writer = csv.writer(response)
        writer.writerow(['Timestamp', 'Temperatur [C]', 'Luftfeuchte [%]', 'Windgeschwindigkeit [m/s]', 
                         'Windrichtung [Grad]', 'Niederschlag [mm/h]', 'Rainfall Counter [1-255]', 'Luftdruck [hPa]'])
        for row in results:
            writer.writerow(row)

        return response