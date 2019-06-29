from django.contrib import admin

# Register your models here.
from sensor.models import Sensor

admin.site.register(Sensor)