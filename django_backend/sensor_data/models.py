from django.db import models

# Create your models here.

#model for soil moisture data
class SoilData(models.Model):
    timestamp = models.DateTimeField()
    water_soil = models.FloatField()
    device = models.CharField(max_length=255)

#model for weather station precipitation data
class PrecipitationData(models.Model):
    timestamp = models.DateTimeField()
    precipitation_mm = models.FloatField()

#model for crown moisture data (TreeSense sensors)
class ElectricalResistanceData(models.Model):
    tree_id = models.IntegerField()  # Assuming each tree has a unique ID
    timestamp = models.DateTimeField()
    electrical_resistance = models.FloatField()