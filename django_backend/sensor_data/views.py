import requests
from django.http import JsonResponse
from django.views import View
from influxdb_client import InfluxDBClient
from .queries import query_soil_moisture_pleiner_mostbirne, query_soil_moisture_roter_boskoop, query_soil_moisture_schoener_von_nordhausen, query_soil_moisture_cox_orangenrenette, query_soil_moisture_jonathan, query_weather_station_precipitation, query_weather_station_temperature, query_weather_station_uv_index, query_weather_station_humidity, query_weather_station_air_pressure, query_weather_station_wind_speed, query_weather_station_wind_direction
import os
import json
from collections import defaultdict
from datetime import datetime
import re
from django.http import HttpResponse
import pandas as pd
from django.shortcuts import render
from sensor_data.models import TreeMoistureReading, Device, ElectricalResistanceReading, TreeHealthReading, WeatherData, SoilMoistureReading, pHReading
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging


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
        # Fetch the latest data from the database
        try:
            device = Device.objects.get(device_id='A84041B42187E5C6')
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
            'rainfall_total': 'precipitation',
            'pressure': 'air_pressure',
            'uv': 'uv',
            'luminosity': 'luminosity',
            'rainfall_counter': 'rainfall_counter'
        }
    },
    "a840413cc1884fb6-hochbeet-moisture1": {
        'type': 'soil_moisture_sensor',
        'field_mapping': {
            'water_SOIL': 'soil_moisture_value'
        }
    },
    "a8404182ba5900fe-moisture-dragino-2": {
        'type': 'soil_moisture_sensor',
        'field_mapping': {
            'water_SOIL': 'soil_moisture_value'
        }
    },
    "a840414c035908cd-moisture-dragino-3": {
        'type': 'soil_moisture_sensor',
        'field_mapping': {
            'water_SOIL': 'soil_moisture_value'
        }
    },
    "a84041df075908cc-moisture-dragino-4": {
        'type': 'soil_moisture_sensor',
        'field_mapping': {
            'water_SOIL': 'soil_moisture_value'
        }
    },
    "a84041bf545908c5-moisture-dragino-5": {
        'type': 'soil_moisture_sensor',
        'field_mapping': {
            'water_SOIL': 'soil_moisture_value'
        }
    },
    "a84041ea2b5908ce-moisture-dragino-6": {
        'type': 'soil_moisture_sensor',
        'field_mapping': {
            'water_SOIL': 'soil_moisture_value'
        }
    },
    "a84041f571875f2b-ph-dragino2-schule": {
        'type': 'ph_sensor',
        'field_mapping': {
            'PH1_SOIL': 'ph_value'
        }
    },
    "a84041a8e1875f29-ph-dragino1-schule": {
        'type': 'ph_sensor',
        'field_mapping': {
            'PH1_SOIL': 'ph_value'
        }
    },
    "2cf7f1c054400013-ph-sensecap2-schule": {
        'type': 'ph_sensor_sensecap',
        'field_mapping': {
            'measurementId_4097': 'temperature',
            'measurementId_4106': 'ph_value'
        }
    },
    "2cf7f1c05440005d-ph-sensecap-schule": {
        'type': 'ph_sensor_sensecap',
        'field_mapping': {
            'measurementId_4097': 'temperature',
            'measurementId_4106': 'ph_value'
        }
    }
}


@method_decorator(csrf_exempt, name='dispatch')
class TTNWebhookView(View):

    def post(self, request, *args, **kwargs):
        try:
            logger.info(f"Received webhook data: {request.body}")
            data = json.loads(request.body)
            device_ids = data['data']['end_device_ids']
            device_id = device_ids['device_id']

            # Check if the device ID is allowed
            if device_id not in ALLOWED_DEVICE_IDS:
                logger.warning(f"Received data from unauthorized device: {device_id}")
                return JsonResponse({'status': 'ignored', 'message': 'Device not recognized'}, status=200)

            device_info = ALLOWED_DEVICE_IDS[device_id]
            device, created = Device.objects.get_or_create(device_id=device_id)
            payload = data['data']['uplink_message']['decoded_payload']
            device_type = device_info['type']
            field_mapping = device_info['field_mapping']

            if device_type == 'ph_sensor':
                ph_data = {
                    'device': device,
                    'timestamp': datetime.now(),
                    'ph_value': float(payload['PH1_SOIL'])
                }

                pHReading.objects.create(**ph_data)
                logger.info(f"Successfully created pHReading entry for device {device_id}")

            elif device_type == 'ph_sensor_sensecap':
                measurements = {m['measurementId']: m['measurementValue'] for m in payload['messages']}
                ph_value = measurements.get(4106)
                if ph_value:
                    ph_data = {
                        'device': device,
                        'timestamp': datetime.now(),
                        'ph_value': float(ph_value)
                    }

                    pHReading.objects.create(**ph_data)
                    logger.info(f"Successfully created pHReading entry for device {device_id}")

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
                    'uv': record.uv,
                    'luminosity': record.luminosity,
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