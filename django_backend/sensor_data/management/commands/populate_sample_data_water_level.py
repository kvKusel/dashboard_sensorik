# django_backend/myapp/management/commands/populate_sample_waterlevel.py
import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from sensor_data.models import waterLevelReading
from django.utils.timezone import now

class Command(BaseCommand):
    help = "Populate sample water level readings for each device every 3 days for last 3 months"

    def handle(self, *args, **kwargs):
        # 1. Delete existing data
        waterLevelReading.objects.all().delete()

        # 2. Get unique device IDs
        device_ids = waterLevelReading.objects.values_list('device_id', flat=True).distinct()
        if not device_ids:
            # If table is empty, use all water-level device IDs
            device_ids = list(range(18, 27)) + [42, 43, 45, 46, 47, 48, 49, 50, 51, 52, 53] + [54, 55]


        today = datetime.today().date()
        start_date = today - timedelta(days=90)  # ~3 months

        for device_id in device_ids:
            current_date = start_date
            while current_date <= today:
                # create sample reading
                waterLevelReading.objects.create(
                    timestamp=datetime.combine(current_date, datetime.min.time()),  # midnight
                    water_level_value=random.randint(1, 120),  # adjust range if needed
                    device_id=device_id,
                    battery=None
                )
                current_date += timedelta(days=3)  # step every 3 days

            # extra "latest" reading ~15 minutes ago
            waterLevelReading.objects.create(
                timestamp=now() - timedelta(minutes=15),
                water_level_value=random.randint(1, 120),
                device_id=device_id,
                battery=None
            )
            
        self.stdout.write(self.style.SUCCESS(
            f"Sample water level readings populated for {len(device_ids)} devices!"
        ))
