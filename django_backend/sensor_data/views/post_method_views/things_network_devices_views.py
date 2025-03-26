import requests
from django.http import JsonResponse
from django.db import connection
import csv
from django.views import View
from influxdb_client import InfluxDBClient
import os
import json
from collections import defaultdict
from datetime import datetime, timedelta
import re
from django.http import HttpResponse
import pandas as pd
from django.shortcuts import render
from sensor_data.models import HistoricalPrecipitation, ForecastedPrecipitation, Device, WeatherData, SoilMoistureReading, pHReading, waterLevelReading
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
import os
#from .utils import ConstrainedDataAnalyzer


#load environment variables
load_dotenv()


#############################              TTN Webhooks - weather station Siebenpfeiffer Gymnasium        ###########################################
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

                # Only create entry if precipitation is less than 650 - weather station's hardware bug
                if weather_data['precipitation'] < 650:
                    WeatherData.objects.create(**weather_data)
                    logger.info(f"Successfully created WeatherData entry for device {device_id}")
                else:
                    logger.info(f"Ignored WeatherData entry for device {device_id} due to high precipitation")





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
                    # Deduct 310 cm (it's the distance between the sensor and the river bed)
                    sensor_to_bottom = 310
                    actual_water_level = int(round(sensor_to_bottom - water_level_cm))
                except ValueError:
                    logger.error(f"Invalid water level value: {water_level_str} in payload: {payload}")
                    return JsonResponse({'status': 'error', 'message': f"Invalid water level value: {water_level_str}"}, status=400)

                water_level_data = {
                    'device': device,
                    'timestamp': timezone.now(),  # Use timezone-aware datetime
                    'water_level_value': actual_water_level
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
        
