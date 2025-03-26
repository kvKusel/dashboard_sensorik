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
    