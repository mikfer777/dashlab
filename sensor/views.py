from django.shortcuts import render
from sensor.models import Sensor
from sensor.serializers import SensorSerializer
from rest_framework import generics

class SensorListCreate(generics.ListCreateAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer

def sensor(request):
    return render(request, 'frontend/index.html')