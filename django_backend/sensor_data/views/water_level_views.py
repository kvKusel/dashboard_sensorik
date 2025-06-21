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

#############################             water level data  - GET method    ###########################################

class waterLevelDataView(View):
    def get(self, request, *args, **kwargs):
        try:
            query_type = request.GET.get("query_type")
            if not query_type:
                return JsonResponse({"error": "Query type is required"}, status=400)

            device_ids = {
                "water_level_kv": "eui-a8404169c187e059-water-lvl-kv",
                "water_level_rutsweiler": "6749D19385550035",
                "water_level_kreimbach_kaulbach": "6749D19422850054",
                "water_level_wolfstein": "6749D19427550061",
                "water_level_lauterecken_1": "6749E17530450043",
                "water_level_kreimbach_1": "6749E09866560038",
                "water_level_kreimbach_3": "6749E09611440028",
                "water_level_lohnweiler_1": "6749E17323330042",
                "water_level_hinzweiler_1": "6749E17419910043",
                "water_level_untersulzbach": "pegel_untersulzbach",
                "water_level_lohnweiler_rlp": "pegel_lohnweiler_land",
                
                "water_level_ohmbachsee": "pegel_stausee_ohmbach",
                "water_level_nanzdietschweiler": "pegel_nanzdietschweiler",
                "water_level_rammelsbach": "pegel_rammelsbach",
                "water_level_eschenau": "pegel_eschenau",
                "water_level_sulzhof": "pegel_sulzhof",
                "water_level_odenbach_steinbruch": "pegel_odenbach_steinbruch",
                "water_level_odenbach": "pegel_odenbach",
                "water_level_niedermohr": "pegel_niedermohr",
                "water_level_loellbach": "pegel_loellbach",



            }

            device_id = device_ids.get(query_type)
            if not device_id:
                return JsonResponse({"error": "Invalid query type"}, status=400)

            try:
                device = Device.objects.get(device_id=device_id)
            except Device.DoesNotExist:
                return JsonResponse({"error": "Device not found"}, status=404)

            # Get the time range from the request
            time_range = request.GET.get("time_range", "24h")  # Default to '24h'
            now = timezone.now()

            # Calculate the time boundary
            if time_range == "24h":
                time_boundary = now - timezone.timedelta(hours=24)
            elif time_range == "7d":
                time_boundary = now - timezone.timedelta(days=7)
            elif time_range == "30d":
                time_boundary = now - timezone.timedelta(days=30)
            elif time_range == "365d":
                time_boundary = now - timezone.timedelta(days=365)
            else:
                time_boundary = now - timezone.timedelta(hours=24)  # Default to '24h' if invalid

            # Filter readings by timestamp
            readings = waterLevelReading.objects.filter(device=device, timestamp__gte=time_boundary).order_by('timestamp')

            if readings.exists():
                response_data = list(readings.values('timestamp', 'water_level_value'))
                return JsonResponse(response_data, safe=False)
            else:
                return JsonResponse({"message": "No data available for the selected time period."}, status=204)

        except Exception as e:
            logger.error(f"Error in water level data: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
        