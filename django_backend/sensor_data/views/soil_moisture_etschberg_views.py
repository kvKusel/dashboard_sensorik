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
from sensor_data.models import (Device, SoilMoistureReading)

#from .utils import ConstrainedDataAnalyzer


#load environment variables
load_dotenv()

# Set up logging
logger = logging.getLogger(__name__)

#############################             soil moisture Etschberg  - GET method    ###########################################

class soilMoistureEtschbergDataView(View):
    def get(self, request, *args, **kwargs):
        try:
            query_type = request.GET.get("query_type")
            if not query_type:
                return JsonResponse({"error": "Query type is required"}, status=400)

            device_ids = {
                "etschberg_1": "soil-moisture-etschberg-1",         #in the southwestern part of the field (bottom left corner)
                "etschberg_2": "soil-moisture-etschberg-2-1811",    #in the southeastern part of the field (bottom right corner)
                "etschberg_3": "soil-moisture-etschberg-3-181a",    #in the middle part of the field
                "etschberg_4": "soil-moisture-etschberg-4-181d",    #in the northwestern part of the field (top left corner)
                "etschberg_5": "soil-moisture-etschberg-5-180c",    #in the northeastern part of the field (top right corner)
        

            }

            device_id = device_ids.get(query_type)
            if not device_id:
                return JsonResponse({"error": "Invalid query type"}, status=400)

            try:
                device = Device.objects.get(device_id=device_id)
            except Device.DoesNotExist:
                return JsonResponse({"error": "Device not found"}, status=404)

            # Get the time range from the request
            time_range = request.GET.get("time_range", "30d")  # Default to '24h'
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
                time_boundary = now - timezone.timedelta(days=30)  # Default to '30d' if invalid

            # Filter readings by timestamp
            readings = SoilMoistureReading.objects.filter(device=device, timestamp__gte=time_boundary).order_by('timestamp')

            if readings.exists():
                response_data = list(readings.values('timestamp', 'soil_moisture_value'))
                logger.info(f"Response data: {response_data}")
                return JsonResponse(response_data, safe=False)
            else:
                return JsonResponse({"message": "No data available for the selected time period."}, status=204)

        except Exception as e:
            logger.error(f"Error in water level data: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
        