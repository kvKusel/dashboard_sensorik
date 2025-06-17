from django.http import HttpResponse, JsonResponse
from django.views import View
from django.db import connection
import csv
from datetime import datetime
import pytz

class ExportPrecipitationDataView(View):
    def get(self, request, *args, **kwargs):
        dataset = request.GET.get('dataset', 'wolfstein')
        cet = pytz.timezone('Europe/Berlin')

        if dataset == 'lohnweiler':
            query = """
            SELECT 
                timestamp,
                precipitation,
                temperature,
                humidity,
                wind_speed,
                wind_direction,
                air_pressure
            FROM sensor_data_weatherdata
            WHERE device_id = %s
            ORDER BY timestamp ASC;
            """
            device_id = 45
        else:
            query = """
            SELECT 
                timestamp,
                precipitation
            FROM sensor_data_historicalprecipitation
            ORDER BY timestamp ASC;
            """
            device_id = None

        with connection.cursor() as cursor:
            if device_id is not None:
                cursor.execute(query, [device_id])
            else:
                cursor.execute(query)
            results = cursor.fetchall()

        if not results:
            return HttpResponse(f'No precipitation data found for {dataset}', status=404)

        if request.GET.get('format') == 'json':
            data = []
            for row in results:
                dt = row[0]
                if isinstance(dt, (int, float)):
                    dt = datetime.fromtimestamp(dt, tz=cet)
                else:
                    dt = dt.astimezone(cet)
                if dataset == 'lohnweiler':
                    data.append({
                        'timestamp': dt.isoformat(),
                        'precipitation_mm': row[1],
                        'temperature_c': row[2],
                        'humidity_percent': row[3],
                        'wind_speed_m_s': row[4],
                        'wind_direction_deg': row[5],
                        'air_pressure_hpa': row[6]
                    })
                else:
                    data.append({
                        'timestamp': dt.isoformat(),
                        'precipitation_mm': row[1]
                    })
            return JsonResponse(data, safe=False)

        response = HttpResponse(content_type='text/csv')
        filename = f"niederschlagsdaten_{dataset}.csv"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        writer = csv.writer(response)

        if dataset == 'lohnweiler':
            writer.writerow([
                'Timestamp (CET)', 'Precipitation [mm]', 'Temperature [C]',
                'Humidity [%]', 'Wind Speed [m/s]', 'Wind Direction [deg]', 'Air Pressure [hPa]'
            ])
        else:
            writer.writerow(['Timestamp (CET)', 'Precipitation [mm]'])

        for row in results:
            dt = row[0]
            if isinstance(dt, (int, float)):
                dt = datetime.fromtimestamp(dt, tz=cet)
            else:
                dt = dt.astimezone(cet)
            formatted_timestamp = dt.strftime('%Y-%m-%d %H:%M:%S %Z')
            if dataset == 'lohnweiler':
                writer.writerow([
                    formatted_timestamp, row[1], row[2], row[3], row[4], row[5], row[6]
                ])
            else:
                writer.writerow([formatted_timestamp, row[1]])

        return response
