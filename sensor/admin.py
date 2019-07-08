from django.contrib import admin

# Register your models here.
from sensor.models import Sensor, XbeeModule, XbeeData

admin.site.register(Sensor)
admin.site.register(XbeeModule)
admin.site.register(XbeeData)