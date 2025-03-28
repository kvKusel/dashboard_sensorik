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

# Set up logging
logger = logging.getLogger(__name__)

        
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
            readings = SoilMoistureReading.objects.filter(device=device) \
                .order_by('-timestamp')[:25]  # Get the last 25 readings
                
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

            # Fetch only the last 25 readings, ordered by most recent first
            readings = pHReading.objects.filter(device=device) \
                .order_by('-timestamp')[:25]
                
                
            if readings.exists():
                response_data = list(readings.values('timestamp', 'ph_value'))
                logger.info(f"Response data: {response_data}")

                return JsonResponse(response_data, safe=False)
            else:
                return JsonResponse({"error": "Query result is empty"}, status=404)

        except Exception as e:
            logger.error(f"Error in pHDataHochbeetProject: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
        

