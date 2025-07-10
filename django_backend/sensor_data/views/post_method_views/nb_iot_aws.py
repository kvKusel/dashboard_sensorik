import csv
import json
import logging
import os
import re
from collections import defaultdict
from datetime import datetime, timedelta

import pandas as pd
import requests
from django.db import connection
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
from influxdb_client import InfluxDBClient
from sensor_data.models import (Device, ForecastedPrecipitation,
                                HistoricalPrecipitation, SoilMoistureReading,
                                WeatherData, pHReading, waterLevelReading)

#from .utils import ConstrainedDataAnalyzer


#load environment variables
load_dotenv()



# Set up logging
logger = logging.getLogger(__name__)


#############################             water level sensors data - Milesight - POST method     ###########################################


# Device location mapping, change later to proper locations!
DEVICE_LOCATIONS = {
    "6749D19385550035": "an der Messstelle 'Rutsweiler a.d. Lauter'",
    "6749D19427550061": "an der Messstelle 'Wolfstein'",
    "6749D19422850054": "an der Messstelle 'Kreimbach-Kaulbach'",

}

def send_alert_email(device_id, timestamp, water_level):
    """Send an email alert via Mailgun."""
    mailgun_api_url = os.getenv('MAILGUN_API_URL')
    mailgun_api_key = os.getenv('MAILGUN_API_KEY')

    # Check for missing environment variables
    if not mailgun_api_url or not mailgun_api_key:
        logger.error("Mailgun API URL or key is missing.")
        return None

    try:
        # Format the timestamp
        formatted_timestamp = (timestamp + timedelta(hours=1)).strftime("%d-%m-%Y um %H:%M Uhr")
        
        # Map device ID to location
        device_location = DEVICE_LOCATIONS.get(device_id, f"vom Gerät {device_id}")

        # Format the email content
        email_text = (
            f"Ein Wasserstand von {water_level} cm wurde {device_location} "
            f"am {formatted_timestamp} festgestellt. Bitte die Situation beobachten."
        )

        # Send the email using Mailgun API
        response = requests.post(
            mailgun_api_url,
            auth=("api", mailgun_api_key),
            data={
                "from": "Smart City Kusel <mailgun@sandboxc7ebde0b60544445a6f147c44033518f.mailgun.org>",
                "to": ["karol.porebski89@gmail.com"],  # Add recipients here
                "subject": "Wasserstandsmeldung",
                "text": email_text
            },
        )

        # Log the response from Mailgun
        if response.status_code == 200:
            logger.info(f"Email successfully sent to karol.porebski89@gmail.com: {response.text}")
        else:
            logger.error(f"Failed to send email: {response.status_code}, {response.text}")

        return response

    except requests.exceptions.RequestException as e:
        logger.error(f"Error sending email: {e}")
        return None
    
    
    
ALLOWED_DEVICE_IDS_AWS = {
#sensor Kreimbach_3 (by the Brauerei) (old one - battery died, got swapped with a new sensor)
# "6749D19422850054": {
#     'type': 'water_level_sensor',
#     'field_mapping': {
#         'water_level': 'distance',
#         'battery': 'battery'
#     }
# },
#sensor Kreimbach_3 (by the Brauerei) (new one - replaced the old sensor 6749D19422850054 on June 30, 2025) 
"6749E17125480048": {
    'type': 'water_level_sensor',
    'field_mapping': {
        'water_level': 'distance',
        'battery': 'battery'
    }
},
"6749D19385550035": {
    'type': 'water_level_sensor',
    'field_mapping': {
        'water_level': 'distance',
        'battery': 'battery'
    }
},
"6749D19427550061": {
    'type': 'water_level_sensor',
    'field_mapping': {
        'water_level': 'distance',
        'battery': 'battery'
    }
},
#sensor Kreimbach_2 (Kanal)
"6749E09611440028": {
    'type': 'water_level_sensor',
    'field_mapping': {
        'water_level': 'distance',
        'battery': 'battery'
    }
},
#sensor Lauterecken_1 (C100)
"6749E17530450043": {
    'type': 'water_level_sensor',
    'field_mapping': {
        'water_level': 'distance',
        'battery': 'battery'
    }
},
#sensor Kreimbach_1 (C050)
"6749E09866560038": {
    'type': 'water_level_sensor',
    'field_mapping': {
        'water_level': 'distance',
        'battery': 'battery'
    }
},
#sensor Lohnweiler_1
"6749E17323330042": {
    'type': 'water_level_sensor',
    'field_mapping': {
        'water_level': 'distance',
        'battery': 'battery'
    }
},
#sensor Hinzweiler_1
"6749E17419910043": {
    'type': 'water_level_sensor',
    'field_mapping': {
        'water_level': 'distance',
        'battery': 'battery'
    }
},
# sensor Lohnweiler (Lauter), installed on June 30, 2025, next to the official sensor of SGD Sued 
"6749E17799680048": {
    'type': 'water_level_sensor',
    'field_mapping': {
        'water_level': 'distance',
        'battery': 'battery'
    }
},

}

# Define the fixed sensor-to-bottom distances for each device
SENSOR_TO_BOTTOM_DISTANCES = {
    #sensor Kreimbach_3 (bei Brauerei)
    "6749E17125480048": 336,
    #sensor Rustweiler a.d. Lauter
    "6749D19385550035": 355,
    #sensor Wolfstein    
    "6749D19427550061": 355,
    
    #sensor Kreimbach_2 (Kanal)
    "6749E09611440028": 88,                 
    
    #sensor Lauterecken_1
    "6749E17530450043": 400, 
    
    #sensor Kreimbach_1
    "6749E09866560038": 453,
    
    #sensor Lohnweiler_1
    "6749E17323330042": 122,
                    
    #sensor Hinzweiler_1
    "6749E17419910043": 151,   

    # sensor Lohnweiler (Lauter), installed on June 30, 2025, next to the official sensor of SGD Sued 
    "6749E17799680048":  428,                 
}

@method_decorator(csrf_exempt, name='dispatch')
class AWSIotCore_Milesight_Sensors(View):

    def post(self, request, *args, **kwargs):
        try:
            logger.info(f"Received webhook data: {request.body}")
            data = json.loads(request.body)

            # Extract device_id from the correct location in the payload
            device_id = data['sn']

            # Check if the device ID is allowed
            if device_id not in ALLOWED_DEVICE_IDS_AWS:
                logger.warning(f"Received data from unauthorized device: {device_id}")
                return JsonResponse({'status': 'ignored', 'message': 'Device not recognized'}, status=200)

            device_info = ALLOWED_DEVICE_IDS_AWS[device_id]
            device, created = Device.objects.get_or_create(device_id=device_id)

            # Extract payload from the correct location
            payload = data['sensor_data']
            device_type = device_info['type']
            field_mapping = device_info['field_mapping']

            logger.debug(f"Device type: {device_type}")
            logger.debug(f"Payload: {payload}")

            if device_type == 'water_level_sensor':
                if field_mapping['water_level'] not in payload:
                    logger.error(f"Missing field {field_mapping['water_level']} in payload: {payload}")
                    return JsonResponse({'status': 'error', 'message': f"Missing field {field_mapping['water_level']} in payload"}, status=400)

                # Extract and clean the water level value and battery
                water_level_str = payload[field_mapping['water_level']]
                battery_value = payload[field_mapping['battery']]

                try:
                    # Convert water level string to float
                    sensor_to_water_level = float(water_level_str)

                    # Get the fixed sensor-to-bottom distance
                    sensor_to_bottom = SENSOR_TO_BOTTOM_DISTANCES.get(device_id)

                    if sensor_to_bottom is None:
                        logger.error(f"Unknown sensor-to-bottom distance for device {device_id}")
                        return JsonResponse({'status': 'error', 'message': 'Unknown sensor calibration'}, status=400)

                    # Calculate actual water level and ensure it's a whole number
                    actual_water_level = int(round(sensor_to_bottom - sensor_to_water_level))
                    if actual_water_level < 0:
                        actual_water_level = 0

                except ValueError:
                    logger.error(f"Invalid water level value: {water_level_str} in payload: {payload}")
                    return JsonResponse({'status': 'error', 'message': f"Invalid water level value: {water_level_str}"}, status=400)

                water_level_data = {
                    'device': device,
                    'timestamp': timezone.now(),  # Use timezone-aware datetime
                    'water_level_value': actual_water_level  # Store the calculated whole number water level
                }

                if battery_value is not None:
                    water_level_data['battery'] = battery_value

                waterLevelReading.objects.create(**water_level_data)

                # Trigger email alert if water level is below threshold
                # if int(water_level_str) < 150:
                #     timestamp = timezone.now()
                #     send_alert_email(device_id, timestamp, water_level_str)
                #     logger.info(f"Email alert sent for device {device_id} with water level {water_level_str} cm.")

                logger.info(f"Successfully created waterLevelReading entry for device {device_id} with actual water level {actual_water_level} cm.")

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

        
      