# django_backend/myapp/management/commands/populate_sample_precipitation.py
import random
import time
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from sensor_data.models import HistoricalPrecipitation

class Command(BaseCommand):
    help = "Populate sample historical precipitation data for last 3 months"

    def handle(self, *args, **kwargs):
        # 1. Delete existing precipitation data
        HistoricalPrecipitation.objects.all().delete()

        # 2. Set start and end times
        end_time = datetime.now() - timedelta(minutes=15)  # latest ~15 mins ago
        start_time = end_time - timedelta(days=90)

        # 3. Step through time (e.g. every 6 hours)
        current_time = start_time
        while current_time <= end_time:
            # Simulate rainfall pattern
            if random.random() < 0.85:
                precipitation = 0
            else:
                precipitation = random.choice([5, 10, 15, 20])  # rainy event

            # Store as UNIX timestamp (int)
            ts = int(time.mktime(current_time.timetuple()))

            HistoricalPrecipitation.objects.create(
                timestamp=ts,
                precipitation=precipitation
            )

            current_time += timedelta(hours=6)  # adjust granularity

        self.stdout.write(self.style.SUCCESS("Sample precipitation data populated!"))
