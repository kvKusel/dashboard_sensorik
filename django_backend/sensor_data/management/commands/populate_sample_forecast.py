# django_backend/myapp/management/commands/populate_sample_forecast.py
import random
import time
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from sensor_data.models import ForecastedPrecipitation

class Command(BaseCommand):
    help = "Populate 5-day forecasted precipitation"

    def handle(self, *args, **kwargs):
        # Delete existing forecast data
        ForecastedPrecipitation.objects.all().delete()

        # Forecast parameters
        now = datetime.now()
        forecast_days = 5
        step_hours = 1  # adjust granularity

        for day_offset in range(forecast_days):
            day = now + timedelta(days=day_offset)
            for hour in range(0, 24, step_hours):
                timestamp = int(time.mktime((day.replace(hour=hour, minute=0, second=0, microsecond=0)).timetuple()))
                ForecastedPrecipitation.objects.create(
                    timestamp=timestamp,
                    precipitation=round(random.uniform(0, 10), 2)  # random precipitation in mm
                )

        self.stdout.write(self.style.SUCCESS(f"Forecasted precipitation populated for next {forecast_days} days!"))
