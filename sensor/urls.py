"""sensor URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    path('', views.sensor, name='sensor'),
    path('sensor/bar', views.sensor, name='sensor'),
    path('sensor/foo', views.sensor, name='sensor'),
    path('sensor/demo', views.sensor, name='sensor'),
    path('sensor/xbeedrive', views.sensor, name='sensor'),
    path('api/sensors/', views.SensorListCreate.as_view(), name='sensor-list'),
    path('api/sensors/<sensor_id>/', views.SensorDetail.as_view(), name='sensor-details'),
    path('api/products/', views.ProductList.as_view(), name='product-list'),
    path('api/products/<product_id>/', views.ProductDetail.as_view(), name='product-detail'),
    path('api/products/<product_id>/reviews/', views.ReviewList.as_view(), name='review-list'),
    path('api/products/<product_id>/reviews/<review_id>/', views.ReviewDetail.as_view(), name='product-detail'),
    path('api/sensors/rest-auth/', include('rest_auth.urls')),
    path('api/xbeemodules/', views.XbeeSensorListCreate.as_view(), name='xbeemodules-list'),
    path('api/xbeemodules/<xbee_id>/', views.XbeeSensorDetail.as_view(), name='xbeemodules-details'),
    path('api/xbeemodules/<xbee_id>/xbeedata/', views.XbeeDataSensorListCreate.as_view(), name='xbeedata-list'),
    path('api//xbeemodules/<xbee_id>/xbeedata/<xbeedata_id>/', views.XbeeDataSensorDetail.as_view(), name='xbeedata-details'),
]
