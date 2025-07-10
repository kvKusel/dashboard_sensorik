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


##################################################               index page             ##################################################################
def index(request):
    return render(request, 'index.html')





    
    #############################            precipitation data forecast for Wolfstein (for bar chart)        ###########################################


class ForecastDataViewWolfstein(View):
    def get(self, request, *args, **kwargs):
        # Fetch the latest 40 forecast data points
        data = ForecastedPrecipitation.objects.order_by('-timestamp')[:40]
        response_data = [
            {
                "timestamp": item.timestamp,
                "precipitation": item.precipitation,
            }
            for item in data
        ]
        return JsonResponse(response_data, safe=False)



#############################            historical precipitation data for Wolfstein (for bar chart)        ###########################################
    
    

class HistoricalPrecipitationView(View):
    def get(self, request, *args, **kwargs):
        try:
            # Get the time range from the request
            time_range = request.GET.get("time_range", "24h")
            
            # Get current datetime in the desired timezone (Berlin/CET)
            berlin_tz = timezone.get_current_timezone()  # or use pytz.timezone('Europe/Berlin')
            now = timezone.now()
            
            # Calculate start and end dates based on time_range
            if time_range == "24h":
                start_date = now - timedelta(hours=24)
                end_date = now
            elif time_range == "7d":
                start_date = now - timedelta(days=7)
                end_date = now
            elif time_range == "30d":
                start_date = now - timedelta(days=30)
                end_date = now
            elif time_range == "365d":
                start_date = now - timedelta(days=365)
                end_date = now
            else:
                return JsonResponse({"error": "Invalid time range"}, status=400)

            # Convert to Unix epochs (timestamps)
            start_timestamp = int(start_date.timestamp())
            end_timestamp = int(end_date.timestamp())
            
            # Filter readings between start and end timestamps
            readings = HistoricalPrecipitation.objects.filter(
                timestamp__gte=start_timestamp,
                timestamp__lte=end_timestamp
            ).order_by('timestamp')
        
            if readings.exists():
                # Debug: Show first and last readings
                first_reading = readings.first()
                last_reading = readings.last()
         
                response_data = list(readings.values('timestamp', 'precipitation'))
                return JsonResponse(response_data, safe=False)
            else:
                return JsonResponse({"message": "No data available for the selected time period."}, status=204)
                
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500) 
        


        
############################            historical precipitation data for weather station Lohnweiler (for bar chart)        ###########################################


class FTPWeatherDataView(View):
    def get(self, request, *args, **kwargs):
        try:
            # Read time range from query parameters
            time_range = request.GET.get("time_range", "24h")

            now = timezone.now()
            if time_range == "24h":
                start_date = now - timedelta(hours=24)
            elif time_range == "7d":
                start_date = now - timedelta(days=7)
            elif time_range == "30d":
                start_date = now - timedelta(days=30)
            elif time_range == "365d":
                start_date = now - timedelta(days=365)
            else:
                return JsonResponse({"error": "Invalid time range"}, status=400)

            # Fetch the device representing the FTP weather station
            device_id = "ftp_weather_station"
            try:
                device = Device.objects.get(device_id=device_id)
            except Device.DoesNotExist:
                return JsonResponse({"error": "FTP weather station device not found"}, status=404)

            # Query WeatherData for the device and time range
            readings = WeatherData.objects.filter(
                device=device,
                timestamp__gte=start_date,
                timestamp__lte=now
            ).order_by("timestamp")

            if readings.exists():
                response_data = list(
                    readings.values("timestamp", "temperature", "humidity", "wind_speed", "precipitation")
                )
                return JsonResponse(response_data, safe=False)
            else:
                return JsonResponse({"message": "No data available for the selected time period."}, status=204)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
