from django.db import models

# Create your models here.

#model for tree water content data (TreeSense Data)
class TreeMoistureContent(models.Model):
    time = models.DateTimeField()
    value = models.FloatField()

    def __str__(self):
        return f"{self.time}: {self.value}"