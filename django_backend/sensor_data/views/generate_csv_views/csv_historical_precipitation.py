from django.http import HttpResponse, JsonResponse
from django.views import View
from django.db import connection
import csv
from datetime import datetime
import pytz

class ExportPrecipitationDataView(View):
    def get(self, request, *args, **kwargs):
        # Get the dataset parameter from the request
        dataset = request.GET.get('dataset', 'wolfstein')  # Default to wolfstein
        
        # Set up CET timezone
        cet = pytz.timezone('Europe/Berlin')  # CET/CEST timezone
        
        # Choose query and table based on dataset
        if dataset == 'lohnweiler':
            # Query for Lohnweiler data from weatherdata table
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
            # Query for Wolfstein data from historicalprecipitation table (original behavior)
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
        
        # Check if any data was found
        if not results:
            return HttpResponse(f'No precipitation data found for {dataset}', status=404)

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
        # Include dataset name in filename
        filename = f"niederschlagsdaten_{dataset}.csv"
        response['Content-Disposition'] = f'attachment; filename=\"{filename}\"'

        writer = csv.writer(response)
        writer.writerow(['Timestamp (CET)', 'Precipitation [mm]'])
        
        for row in results:
            # Convert Unix timestamp to CET datetime string
            dt = datetime.fromtimestamp(row[0], tz=cet)
            formatted_timestamp = dt.strftime('%Y-%m-%d %H:%M:%S %Z')
            writer.writerow([formatted_timestamp, row[1]])

        return response