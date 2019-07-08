from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Sensor(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(decimal_places=2, max_digits=20)


class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    review = models.TextField()
    rating = models.IntegerField()
    created_by = models.ForeignKey(User,on_delete=models.CASCADE)


class XbeeModule(models.Model):
    external_id = models.CharField(max_length=10)
    name = models.CharField(max_length=100)
    atsh = models.CharField(max_length=10)
    atsl = models.CharField(max_length=10)
    fw = models.CharField(max_length=10)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)



class XbeeData(models.Model):
    xbeeid = models.ForeignKey(XbeeModule, on_delete=models.CASCADE)
    vbatt = models.DecimalField(decimal_places=5, max_digits=20)
    ptrans = models.IntegerField()
    pcheck = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
