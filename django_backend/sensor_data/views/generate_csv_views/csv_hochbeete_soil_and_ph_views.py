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
    