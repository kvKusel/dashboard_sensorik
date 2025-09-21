# django_backend/myapp/management/commands/populate_sample_soilmoisture.py
import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from sensor_data.models import SoilMoistureReading

class Command(BaseCommand):
    help = "Populate sample soil moisture readings for the last 24 hours (5 values per device)"

    def handle(self, *args, **kwargs):
        # 1. Delete existing
        SoilMoistureReading.objects.all().delete()

        # 2. Devices to simulate
        device_ids = [1, 14, 15, 16, 17]

        # 3. Time range
        end_time = datetime.now() - timedelta(minutes=15)
        start_time = end_time - timedelta(hours=24)

        step = (end_time - start_time) / 4  # 5 values total

        # 4. Populate
        for device_id in device_ids:
            current_time = start_time
            while current_time <= end_time:
                soil_value = round(random.uniform(7, 25), 2)
                SoilMoistureReading.objects.create(
                    timestamp=current_time,
                    soil_moisture_value=soil_value,
                    device_id=device_id,
                )
                current_time += step

        self.stdout.write(self.style.SUCCESS(
            f"Sample soil moisture readings populated for {len(device_ids)} devices!"
        ))
