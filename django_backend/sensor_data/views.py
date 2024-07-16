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


#deifnitely double check here the refresh token and the log out options, make sure that everything is secure. 
#libraries like Django OAuth Toolkit or Auth0 for more robust authentication and token management?


class ElectricalResistanceDataView(View):
    def get(self, request, *args, **kwargs):
        try:
            
            # Determine the type of query based on the request
            query_type = request.GET.get("query_type")
            
            # Perform authentication to obtain the access token
            access_token = self.authenticate()

            if access_token:
                # Define the URL of the API endpoint to fetch electrical resistance data
                if query_type == "cox_orangenrenette":
                    api_url = 'https://api.treesense.net/data/A84041B42187E5C6'
                    
                    # Set up headers with the access token
                    headers = {'Authorization': f'Bearer {access_token}'}
                    
                    # Make a GET request to the API endpoint
                    response = requests.get(api_url, headers=headers)
                    
                    # Check if the request was successful (status code 200)
                    if response.status_code == 200:
                        response_json = response.json()
                        # Extract the resistance data from the whole response                  
                        extracted_values = []
                        
                        for element in response_json:
                            element = re.split(',', element)
                            extracted_values.append(element)

                        extracted_values = extracted_values[2:]    

                        #extract timestamp and value from each sublist, create a JSON object for each element
                        data = [{'time': sublist[0], 'value': float(sublist[3])} for sublist in extracted_values]
                        data = json.dumps(data)
                        response = HttpResponse(data, content_type='application/json')                                        
                                                                
                        # Return the extracted data as a JSON response
                        return JsonResponse(data, status=200, safe=False)
                else:
                    # Return an error response if the request failed
                    return JsonResponse({"error": "Failed to fetch data"}, status=response.status_code)
            else:
                # If authentication fails or access token is not available, return error response
                return JsonResponse({"error": "Authentication failed or access token not available"}, status=401)

        except Exception as e:
            # Print the error message to the terminal
            print(f"Error in ElectricalResistanceDataView: {str(e)}")

            # Return a JSON response indicating the error
            return JsonResponse({"error": str(e)}, status=500)
    
    def authenticate(self):
        try:
            # Define login endpoint URL and the login data
            login_url = 'https://api.treesense.net/login'
            email = os.getenv("LOGIN_EMAIL")
            password = os.getenv("LOGIN_PASSWORD")

            if not email or not password:
                print("Login credentials not found in environment variables.")
                return None

            # Define login payload (username and password)            
            payload = {
                "email": email,
                "password": password
            }

            # Set up headers
            headers = {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }

            # Send a POST request to the login endpoint with the payload
            response = requests.post(login_url, json=payload, headers=headers)

            # Check if the request was successful (status code 200)
            if response.status_code == 200:
                # Extract the access token from the response JSON
                access_token = response.json().get('accessToken')
                return access_token
            else:
                # Handle authentication failure or other error
                print(f"Failed to authenticate. Status code: {response.status_code}")
                return None

        except Exception as e:
            # Print the error message to the terminal
            print(f"Error during authentication: {str(e)}")
            return None



##################################################              TreeSense tree moisture content endpoint        ################################################################


#deifnitely double check here the refresh token and the log out options, make sure that everything is secure. 
#libraries like Django OAuth Toolkit or Auth0 for more robust authentication and token management?


class TreeMoistureContentDataView(View):
    def get(self, request, *args, **kwargs):
        try:
            
            # Determine the type of query based on the request
            query_type = request.GET.get("query_type")
            
            # Perform authentication to obtain the access token
            access_token = self.authenticate()

            if access_token:
                # Define the URL of the API endpoint to fetch moisture content data
                if query_type == "cox_orangenrenette":
                    api_url = 'https://api.treesense.net/moisture-content/A84041B42187E5C6'
                    
                    # Set up headers with the access token
                    headers = {'Authorization': f'Bearer {access_token}'}
                    
                    # Make a GET request to the API endpoint
                    response = requests.get(api_url, headers=headers)
                    
                    # Check if the request was successful (status code 200)
                    if response.status_code == 200:
                        response_json = response.json()
                        
                        # Skip the first two header elements and process the remaining elements
                        extracted_values = [re.split(',', element) for element in response_json[2:]]
                        
                        # Extract timestamp and moisture_content from each sublist, create a JSON object for each element
                        data = [{'time': sublist[0], 'value': float(sublist[5]) * 100} for sublist in extracted_values]
                        
                        # Convert the data to JSON format
                        data_json = json.dumps(data)
                        
                        # Return the extracted data as a JSON response
                        return JsonResponse(data_json, status=200, safe=False)
                else:
                    # Return an error response if the request failed
                    return JsonResponse({"error": "Failed to fetch data"}, status=response.status_code)
            else:
                # If authentication fails or access token is not available, return error response
                return JsonResponse({"error": "Authentication failed or access token not available"}, status=401)

        except Exception as e:
            # Print the error message to the terminal
            print(f"Error in ElectricalResistanceDataView: {str(e)}")

            # Return a JSON response indicating the error
            return JsonResponse({"error": str(e)}, status=500)
    
    def authenticate(self):
        try:
            # Define login endpoint URL and the login data
            login_url = 'https://api.treesense.net/login'
            email = os.getenv("LOGIN_EMAIL")
            password = os.getenv("LOGIN_PASSWORD")

            if not email or not password:
                print("Login credentials not found in environment variables.")
                return None

            # Define login payload (username and password)            
            payload = {
                "email": email,
                "password": password
            }

            # Set up headers
            headers = {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }

            # Send a POST request to the login endpoint with the payload
            response = requests.post(login_url, json=payload, headers=headers)

            # Check if the request was successful (status code 200)
            if response.status_code == 200:
                # Extract the access token from the response JSON
                access_token = response.json().get('accessToken')
                return access_token
            else:
                # Handle authentication failure or other error
                print(f"Failed to authenticate. Status code: {response.status_code}")
                return None

        except Exception as e:
            # Print the error message to the terminal
            print(f"Error during authentication: {str(e)}")
            return None
        

##################################################              TreeSense tree general health endpoint        ################################################################


#deifnitely double check here the refresh token and the log out options, make sure that everything is secure. 
#libraries like Django OAuth Toolkit or Auth0 for more robust authentication and token management?


class TreeHealthDataView(View):
    def get(self, request, *args, **kwargs):
        try:
            # Perform authentication to obtain the access token
            access_token = self.authenticate()

            if access_token:
                # Define the URL of the API endpoint to fetch electrical resistance data
                api_url = 'https://api.treesense.net/trees'


                
                
                # Set up headers with the access token
                headers = {'Authorization': f'Bearer {access_token}'}
                
                # Make a GET request to the API endpoint
                response = requests.get(api_url, headers=headers)
                
                # Check if the request was successful (status code 200)
                if response.status_code == 200:
                    response_json = response.json()

                                          
                                                                
                    # Return the extracted data as a JSON response
                    return JsonResponse(response_json, status=200, safe=False)
        except Exception as e:
            # Print the error message to the terminal
            print(f"Error in TreeHealthDataView: {str(e)}")

            # Return a JSON response indicating the error
            return JsonResponse({"error": str(e)}, status=500)
    
    def authenticate(self):
        try:
            # Define login endpoint URL and the login data
            login_url = 'https://api.treesense.net/login'
            email = os.getenv("LOGIN_EMAIL")
            password = os.getenv("LOGIN_PASSWORD")

            if not email or not password:
                print("Login credentials not found in environment variables.")
                return None

            # Define login payload (username and password)            
            payload = {
                "email": email,
                "password": password
            }

            # Set up headers
            headers = {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }

            # Send a POST request to the login endpoint with the payload
            response = requests.post(login_url, json=payload, headers=headers)

            # Check if the request was successful (status code 200)
            if response.status_code == 200:
                # Extract the access token from the response JSON
                access_token = response.json().get('accessToken')
                return access_token
            else:
                # Handle authentication failure or other error
                print(f"Failed to authenticate. Status code: {response.status_code}")
                return None

        except Exception as e:
            # Print the error message to the terminal
            print(f"Error during authentication: {str(e)}")
            return None
