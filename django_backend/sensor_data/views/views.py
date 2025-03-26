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


##################################################              chatbot endpoint        #########################################################################

# analyzer = ConstrainedDataAnalyzer()

# @method_decorator(csrf_exempt, name='dispatch')
# class ChatEndpointView(View):
#     def __init__(self, **kwargs):
#         super().__init__(**kwargs)
#         # Initialize the analyzer once when the view is created
#         self.analyzer = ConstrainedDataAnalyzer()
    
#     def post(self, request, *args, **kwargs):
#         try:
#             data = json.loads(request.body)
#             user_message = data.get('message')
            
#             if not user_message:
#                 return JsonResponse({
#                     'error': 'Message is required'
#                 }, status=400)
            
#             result = self.analyzer.analyze_data(user_message)
            
#             if result.get("success", False):
#                 return JsonResponse({
#                     'message': result['analysis'],
#                     'dataset': result['dataset_used']
#                 })
#             else:
#                 return JsonResponse({
#                     'error': result.get('error', 'Analysis failed')
#                 }, status=500)
                
#         except json.JSONDecodeError:
#             return JsonResponse({
#                 'error': 'Invalid JSON in request body'
#             }, status=400)
#         except Exception as e:
#             return JsonResponse({
#                 'error': str(e)
#             }, status=500)
    
#     def get(self, request, *args, **kwargs):
#         return JsonResponse({
#             'error': 'Only POST requests are allowed'
#         }, status=405)




    
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
                return JsonResponse({"error": "Invalid time range"}, status=400)

            # Filter readings
            readings = HistoricalPrecipitation.objects.filter(timestamp__gte=int(time_boundary.timestamp())).order_by('timestamp')

            if readings.exists():
                response_data = list(readings.values('timestamp', 'precipitation'))
                return JsonResponse(response_data, safe=False)
            else:
                return JsonResponse({"message": "No data available for the selected time period."}, status=204)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)