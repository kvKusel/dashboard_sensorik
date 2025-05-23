from django.db import models
from django.utils import timezone

class Device(models.Model):
    device_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.device_id})"
    
class WeatherData(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='weather_data')
    timestamp = models.DateTimeField(auto_now_add=True)
    temperature = models.FloatField(null=True, blank=True)
    humidity = models.FloatField(null=True, blank=True)
    wind_speed = models.FloatField(null=True, blank=True)
    wind_direction = models.FloatField(null=True, blank=True)
    precipitation = models.FloatField(null=True, blank=True)
    air_pressure = models.FloatField(null=True, blank=True)
    uv = models.FloatField(null=True, blank=True)  # Optional field
    luminosity = models.FloatField(null=True, blank=True)  # Optional field
    rainfall_counter = models.FloatField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.device.name} - {self.timestamp}"

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
    
class SoilMoistureReading(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='soil_moisture_readings')
    timestamp = models.DateTimeField()
    soil_moisture_value = models.FloatField()

    def __str__(self):
        return f"{self.device.name} - {self.soil_moisture_value} at {self.timestamp}"

    class Meta:
        ordering = ['-timestamp']
        
class pHReading(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='ph_readings')
    timestamp = models.DateTimeField()
    ph_value = models.FloatField()

    def __str__(self):
        return f"{self.device.name} - {self.ph_value} at {self.timestamp}"

    class Meta:
        ordering = ['-timestamp']
        
class waterLevelReading(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='water_level_readings')
    timestamp = models.DateTimeField()
    water_level_value = models.FloatField()
    battery = models.FloatField(null=True, blank=True) 

    def __str__(self):
        return f"{self.device.name} - {self.water_level_value} at {self.timestamp}"

    class Meta:
        ordering = ['-timestamp']
        
class ForecastedPrecipitation(models.Model):
    timestamp = models.BigIntegerField()  # UNIX timestamp
    precipitation = models.FloatField(default=0)  # Default to 0 if no data available

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"Timestamp: {self.timestamp}, Precipitation: {self.precipitation}"
    
    
class HistoricalPrecipitation(models.Model):
    timestamp = models.BigIntegerField()  # UNIX timestamp
    precipitation = models.FloatField(default=0)  # Default to 0 if no data available

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"Timestamp: {self.timestamp}, Precipitation: {self.precipitation}"



#########################################       model to store chatbot messages       ######################################################


class ChatSession(models.Model):
    """Groups related conversations together"""
    session_id = models.CharField(max_length=100, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Session {self.session_id} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class ChatInteraction(models.Model):
    """Stores individual question/answer pairs"""
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='interactions')
    user_message = models.TextField()
    bot_response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        preview = self.user_message[:50] + "..." if len(self.user_message) > 50 else self.user_message
        return f"{self.session.session_id} - {preview}"