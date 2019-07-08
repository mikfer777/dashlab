from rest_framework import serializers
from sensor.models import Sensor, Product, Review, XbeeModule, XbeeData


class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = ('id', 'name', 'email', 'message','created_at')


class ReviewSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Review
        fields = ('id', 'title', 'review', 'rating', 'created_by')


class ProductSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'price', 'reviews')


class XbeeSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = XbeeModule
        fields = ('external_id', 'name', 'atsh', 'atsl', 'fw', 'description','created_at')


class XbeeDataSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = XbeeData
        fields = ('xbeeid', 'vbatt', 'ptrans', 'pcheck','created_at')