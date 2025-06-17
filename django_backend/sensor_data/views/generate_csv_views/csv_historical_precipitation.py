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
                precipitation
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
                data.append({
                    'timestamp': dt.isoformat(),
                    'precipitation_mm': row[1]
                })
            return JsonResponse(data, safe=False)

        response = HttpResponse(content_type='text/csv')
        filename = f"niederschlagsdaten_{dataset}.csv"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        writer = csv.writer(response)
        writer.writerow(['Timestamp (CET)', 'Precipitation [mm]'])

        for row in results:
            dt = row[0]
            if isinstance(dt, (int, float)):
                dt = datetime.fromtimestamp(dt, tz=cet)
            else:
                dt = dt.astimezone(cet)
            formatted_timestamp = dt.strftime('%Y-%m-%d %H:%M:%S %Z')
            writer.writerow([formatted_timestamp, row[1]])

        return response
