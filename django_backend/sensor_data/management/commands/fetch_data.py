# django_backend/project/management/commands/fetch_moisture_data.py

from django.core.management.base import BaseCommand
from django.http import JsonResponse
import requests
import json
import os
import re
from datetime import datetime

from sensor_data.models import TreeMoistureContent

class Command(BaseCommand):
    help = 'Fetches moisture content data from Treesense API and stores it'

    def handle(self, *args, **kwargs):
        try:
            # Perform authentication to obtain the access token
            access_token = self.authenticate()

            if access_token:
                # Get the latest timestamp from the database
                latest_timestamp = TreeMoistureContent.objects.order_by('-time').first()
                latest_time = latest_timestamp.time if latest_timestamp else datetime.min
                
                # Define the URL of the API endpoint to fetch moisture content data
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
                    
                    # Extract timestamp and moisture_content from each sublist, create objects for new elements
                    data_objects = []
                    for sublist in extracted_values:
                        time_str = sublist[0]
                        time = datetime.strptime(time_str, '%Y-%m-%dT%H:%M:%SZ')
                        if time > latest_time:
                            value = float(sublist[5]) * 100
                            # Create a TreeMoistureContent object and add to list
                            data_objects.append(TreeMoistureContent(time=time, value=value))
                    
                    # Bulk create all objects to optimize database operations
                    if data_objects:
                        TreeMoistureContent.objects.bulk_create(data_objects)
                    
                    # Print or log success message
                    self.stdout.write(self.style.SUCCESS('Data fetched and stored successfully'))
                    
                    # Return a success response if needed
                    return JsonResponse({"message": "Data fetched and stored successfully"}, status=200)
                else:
                    # Return an error response if the request failed
                    self.stdout.write(self.style.ERROR(f'Failed to fetch data. Status code: {response.status_code}'))
                    return JsonResponse({"error": "Failed to fetch data"}, status=response.status_code)
            else:
                # If authentication fails or access token is not available, return error response
                self.stdout.write(self.style.ERROR('Authentication failed or access token not available'))
                return JsonResponse({"error": "Authentication failed or access token not available"}, status=401)

        except Exception as e:
            # Print the error message to the terminal or log it
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
            return JsonResponse({"error": str(e)}, status=500)

    def authenticate(self):
        try:
            # Define login endpoint URL and the login data
            login_url = 'https://api.treesense.net/login'
            email = os.getenv("LOGIN_EMAIL")
            password = os.getenv("LOGIN_PASSWORD")

            if not email or not password:
                self.stdout.write(self.style.WARNING('Login credentials not found in environment variables.'))
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
                self.stdout.write(self.style.ERROR(f'Failed to authenticate. Status code: {response.status_code}'))
                return None

        except Exception as e:
            # Print the error message to the terminal or log it
            self.stdout.write(self.style.ERROR(f'Error during authentication: {str(e)}'))
            return None
