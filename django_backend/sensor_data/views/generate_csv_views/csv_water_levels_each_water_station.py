from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.views import View
from django.db import connection
import csv
from datetime import datetime

class ExportWaterLevelDataView(View):
    def get(self, request, *args, **kwargs):
        # Get device_id from query parameters
        device_id = request.GET.get('device_id')
        
        if not device_id:
            return HttpResponseBadRequest('device_id parameter is required')
        
        # Validate device_id is numeric
        try:
            device_id = int(device_id)
        except ValueError:
            return HttpResponseBadRequest('device_id must be a valid integer')
        
        # Mapping for device names (for filename generation)
        device_name_mapping = {
            31: "wolfstein",
            30: "rutsweiler", 
            34: "kreimbach1",
            32: "kreimbach3",
            36: "kreimbach4",
            33: "lauterecken1",
            14: "kreisverwaltung",
            42: "lohnweiler1",
            35: "hinzweiler1",
            43: "untersulzbach",
            44: "lohnweilerrlp",
        }
        
        # Get device name for filename, default to device_id if not found
        device_name = device_name_mapping.get(device_id, f"device_{device_id}")

        query = """
        SELECT 
            timestamp,
            water_level_value
        FROM sensor_data_waterlevelreading
        WHERE device_id = %s
        ORDER BY timestamp ASC;
        """

        with connection.cursor() as cursor:
            cursor.execute(query, [device_id])
            results = cursor.fetchall()
        
        # Check if any data was found
        if not results:
            return HttpResponseBadRequest(f'No data found for device_id {device_id}')

        if request.GET.get('format') == 'json':
            data = [
                {
                    'timestamp': row[0],
                    'water_level_cm': row[1]
                }
                for row in results
            ]
            return JsonResponse(data, safe=False)

        response = HttpResponse(content_type='text/csv')
        filename = f"{device_name}_pegelstaende.csv"
        response['Content-Disposition'] = f'attachment; filename=\"{filename}\"'

        writer = csv.writer(response)
        writer.writerow(['Timestamp', 'Water Level [cm]'])
        for row in results:
            writer.writerow(row)

        return response