from django.shortcuts import render

def sensor(request):
    return render(request, 'frontend/index.html')