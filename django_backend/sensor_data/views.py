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
from sensor_data.models import TreeMoistureReading, Device, ElectricalResistanceReading, TreeHealthReading




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
            elif query_type == "air_pressure":
                df = query_weather_station_air_pressure(client, org=influxdb_org)    
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