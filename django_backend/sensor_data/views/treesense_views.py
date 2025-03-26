from django.http import JsonResponse
from django.views import View
from sensor_data.models import TreeMoistureReading, Device, ElectricalResistanceReading, TreeHealthReading
from dotenv import load_dotenv
import os


#load environment variables
load_dotenv()



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
        device_id = request.GET.get('device_id', None)
        
        if not device_id:
            return JsonResponse({'error': 'Device ID is required'}, status=400)
       
        # Fetch the latest data from the database
        try:
            device = Device.objects.get(device_id=device_id)
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
        
