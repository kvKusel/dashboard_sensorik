# django_backend/myapp/management/commands/populate_sample_weatherdata.py
import random
import math
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from sensor_data.models import WeatherData


class Command(BaseCommand):
    help = "Populate sample weather data for device 44 and 2 (last 3 months, hourly, aligned timestamps)"

    def handle(self, *args, **kwargs):
        # 1. Delete existing
        WeatherData.objects.all().delete()

        # 2. Devices to populate
        device_ids = [44, 2]

        # 3. Build shared time range (hourly points, ending ~15 min ago)
        end_time = timezone.now() - timedelta(minutes=15)
        start_time = end_time - timedelta(days=90)
        time_points = []
        cur = start_time.replace(minute=0, second=0, microsecond=0)
        while cur <= end_time:
            time_points.append(cur)
            cur += timedelta(hours=1)

        # 4. Generate values per device
        for device_id in device_ids:
            # slightly different baselines for each device
            if device_id == 44:
                base_temp, base_hum, base_pressure = 21.0, 60.0, 976.0
            else:  # device_id == 2
                base_temp, base_hum, base_pressure = 19.0, 75.0, 978.0

            for i, ts in enumerate(time_points):
                # diurnal cycle + randomness
                diurnal = math.sin(2 * math.pi * (i % 24) / 24)
                temperature = round(base_temp + diurnal * 3.0 + random.uniform(-0.7, 0.7), 1)
                humidity = round(min(100, max(0, base_hum - diurnal * 6.0 + random.uniform(-2, 2))), 1)
                wind_speed = round(abs(random.gauss(2.5, 1.2)), 1)
                wind_direction = random.choice([0, 45, 90, 135, 180, 225, 270, 315])
                precipitation = 0 if random.random() < 0.9 else round(random.uniform(0.5, 12.0), 1)
                air_pressure = round(base_pressure + math.cos(i / 48.0) * 6.0 + random.uniform(-1.0, 1.0), 1)
                rainfall_counter = precipitation if precipitation > 0 else 0

                WeatherData.objects.create(
                    timestamp=ts,
                    temperature=temperature,
                    humidity=humidity,
                    wind_speed=wind_speed,
                    wind_direction=wind_direction,
                    precipitation=precipitation,
                    air_pressure=air_pressure,
                    uv=None,
                    luminosity=None,
                    device_id=device_id,
                    rainfall_counter=rainfall_counter,
                )

        self.stdout.write(self.style.SUCCESS(
            f"Sample weather data populated for devices {device_ids}"
        ))
