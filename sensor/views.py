from django.shortcuts import render
from sensor.models import Sensor, Product, Review, XbeeModule, XbeeData, SensorModule, SensorData
from sensor.serializers import SensorSerializer, ProductSerializer, ReviewSerializer, XbeeSensorSerializer, \
    XbeeDataSensorSerializer, SensorModuleSerializer, SensorDataSerializer

from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework import generics

def sensor(request):
    return render(request, 'frontend/index.html')

class SensorListCreate(generics.ListCreateAPIView):
    queryset = Sensor.objects.all()
    # permission_classes = (IsAuthenticated,)
    serializer_class = SensorSerializer

# Return a single Sensor (even for anonymous users) and allows admin
# to update and delete a single Product.
class SensorDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    # permission_classes = (IsAuthenticated,)
    # permission_classes = (IsAdminOrReadOnly, )
    lookup_url_kwarg = 'sensor_id'

#
class XbeeSensorListCreate(generics.ListCreateAPIView):
    queryset = XbeeModule.objects.all()
    # permission_classes = (IsAuthenticated,)
    serializer_class = XbeeSensorSerializer

# Return a single Sensor (even for anonymous users) and allows admin
# to update and delete a single xbeeModule.
#
class XbeeSensorDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = XbeeModule.objects.all()
    serializer_class = XbeeSensorSerializer
    # permission_classes = (IsAuthenticated,)
    # permission_classes = (IsAdminOrReadOnly, )
    lookup_url_kwarg = 'xbee_id'

#
class XbeeDataSensorListCreate(generics.ListCreateAPIView):
    queryset = XbeeData.objects.all()
    # permission_classes = (IsAuthenticated,)
    serializer_class = XbeeDataSensorSerializer

# Return a single Sensor (even for anonymous users) and allows admin
# to update and delete a single xbeeModule.
#
class XbeeDataSensorDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = XbeeData.objects.all()
    serializer_class = XbeeDataSensorSerializer
    # permission_classes = (IsAuthenticated,)
    # permission_classes = (IsAdminOrReadOnly, )
    lookup_url_kwarg = 'xbeeData_id'

# Lists and Creates entries of Product.
#
# GET  products/: return a list of Products
# POST products/: create a Product
#      data = {
#          "description": "Sbriciolona",
#          "name": "Sbriciolona",
#          "price": "8.50"
#      }
class ProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsAuthenticated,)
    lookup_url_kwarg = 'product_id'


# Return a single Product (even for anonymous users) and allows admin
# to update and delete a single Product.
#
# GET    products/<product_id>/: return a Product
# PUT    products/<product_id>/: update a Product
# PATCH  products/<product_id>/: patch a Product
# DELETE products/<product_id>/: delete a Product
class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsAuthenticated,)
    lookup_url_kwarg = 'product_id'


# Lists and Creates entries of Review.
#
# GET  products/<product_id>/reviews/: return a list of Reviews
# POST products/<product_id>/reviews/: create a Review
#      data = {
#          "title": "Best food ever",
#          "review": "Really the best food I have ever tried",
#          "rating": 5
#      }
class ReviewList(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    lookup_url_kwarg = 'product_id'

    def perform_create(self, serializer):
        # We automatically set the user using the one who is logged in
        serializer.save(
            created_by=self.request.user,
            product_id=self.kwargs['product_id'])

    def get_queryset(self):
        product = self.kwargs['product_id']
        return Review.objects.filter(product__id=product)


# Return a single Review (even for anonymous users) and allows user
# who created it to update and delete a single Review.
#
# GET    products/<product_id>/reviews/<review_id>/: return a Review
# PUT    products/<product_id>/reviews/<review_id>/: update a Review
# PATCH  products/<product_id>/reviews/<review_id>/: patch a Review
# DELETE products/<product_id>/reviews/<review_id>/: delete a Review
class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, IsAuthenticated)
    lookup_url_kwarg = 'review_id'

    def get_queryset(self):
        review = self.kwargs['review_id']
        return Review.objects.filter(id=review)


#
class SensorModuleListCreate(generics.ListCreateAPIView):
    queryset = SensorModule.objects.all()
    # permission_classes = (IsAuthenticated,)
    serializer_class = SensorModuleSerializer

# Return a single Sensor (even for anonymous users) and allows admin
# to update and delete a single xbeeModule.
#
class SensorModuleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = SensorModule.objects.all()
    serializer_class = SensorModuleSerializer
    # permission_classes = (IsAuthenticated,)
    # permission_classes = (IsAdminOrReadOnly, )
    lookup_url_kwarg = 'sensormodule_id'


#
class SensorDataListCreate(generics.ListCreateAPIView):
    queryset = SensorData.objects.all()
    # permission_classes = (IsAuthenticated,)
    serializer_class = SensorDataSerializer

# Return a single Sensor (even for anonymous users) and allows admin
# to update and delete a single xbeeModule.
#
class SensorDataDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = SensorData.objects.all()
    serializer_class = SensorDataSerializer
    # permission_classes = (IsAuthenticated,)
    # permission_classes = (IsAdminOrReadOnly, )
    lookup_url_kwarg = 'sensordata_id'
