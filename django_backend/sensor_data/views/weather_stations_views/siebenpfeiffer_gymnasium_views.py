from django.http import JsonResponse
from django.views import View

from sensor_data.models import Device, SoilMoistureReading, WeatherData

#############################             weather station data Siebenpfeiffer Gymnasium        ###########################################
class WeatherDataView(View):

    def get(self, request, *args, **kwargs):
        try:
            device_id = request.GET.get('device_id')
            if device_id:
                device = Device.objects.get(device_id=device_id)
                weather_data = WeatherData.objects.filter(device=device).order_by('-timestamp')[:100]
                soil_moisture_data = SoilMoistureReading.objects.filter(device=device).order_by('-timestamp')[:100]
            else:
                weather_data = WeatherData.objects.all().order_by('-timestamp')[:100]
                soil_moisture_data = SoilMoistureReading.objects.all().order_by('-timestamp')[:100]

            weather_data_list = []
            for record in weather_data:
                weather_data_list.append({
                    'timestamp': record.timestamp.isoformat(),
                    'temperature': record.temperature,
                    'humidity': record.humidity,
                    'wind_speed': record.wind_speed,
                    'wind_direction': record.wind_direction,
                    'precipitation': record.precipitation,
                    'air_pressure': record.air_pressure,
                })

            soil_moisture_data_list = []
            for record in soil_moisture_data:
                soil_moisture_data_list.append({
                    'timestamp': record.timestamp.isoformat(),
                    'soil_moisture_value': record.soil_moisture_value,
                })

            response_data = {
                'weather_data': weather_data_list,
                'soil_moisture_data': soil_moisture_data_list,
            }

            return JsonResponse(response_data, safe=False)
        except Device.DoesNotExist:
            return JsonResponse({'error': 'Device not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)