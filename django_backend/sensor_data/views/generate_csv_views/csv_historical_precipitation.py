from django.http import HttpResponse, JsonResponse
from django.views import View
from django.db import connection
import csv
from datetime import datetime
import pytz

class ExportPrecipitationDataView(View):
    def get(self, request, *args, **kwargs):
        query = """
        SELECT 
            timestamp,
            precipitation
        FROM sensor_data_historicalprecipitation
        ORDER BY timestamp ASC;
        """

        with connection.cursor() as cursor:
            cursor.execute(query)
            results = cursor.fetchall()
        
        # Check if any data was found
        if not results:
            return HttpResponse('No precipitation data found', status=404)

        # Set up CET timezone
        cet = pytz.timezone('Europe/Berlin')  # CET/CEST timezone
        
        if request.GET.get('format') == 'json':
            data = []
            for row in results:
                # Convert Unix timestamp to CET datetime
                dt = datetime.fromtimestamp(row[0], tz=cet)
                data.append({
                    'timestamp': dt.isoformat(),
                    'precipitation_mm': row[1]
                })
            return JsonResponse(data, safe=False)

        response = HttpResponse(content_type='text/csv')
        filename = "niederschlagsdaten.csv"
        response['Content-Disposition'] = f'attachment; filename=\"{filename}\"'

        writer = csv.writer(response)
        writer.writerow(['Timestamp', 'Precipitation [mm]'])
        
        for row in results:
            # Convert Unix timestamp to CET datetime string
            dt = datetime.fromtimestamp(row[0], tz=cet)
            formatted_timestamp = dt.strftime('%Y-%m-%d %H:%M:%S %Z')
            writer.writerow([formatted_timestamp, row[1]])

        return response