from django.db import models

class Device(models.Model):
    device_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.device_id})"

class TreeMoistureReading(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='moisture_readings')
    timestamp = models.DateTimeField()
    moisture_value = models.FloatField()

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.device.name} - {self.timestamp}: {self.moisture_value}"

class ElectricalResistanceReading(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='resistance_readings')
    timestamp = models.DateTimeField()
    resistance_value = models.FloatField()

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.device.name} - {self.timestamp}: {self.resistance_value}"

class TreeHealthReading(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='health_readings')
    timestamp = models.DateTimeField()
    health_state = models.IntegerField()

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.device.name} - {self.timestamp}: {self.health_state}"