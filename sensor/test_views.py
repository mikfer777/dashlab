import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from sensor.models import SensorData, SensorModule

UserModel = get_user_model()


class APIAdminAPITestCase(APITestCase):
    @pytest.mark.django_db
    def setUp(self):
        self.user = UserModel.objects.create_superuser(
            username='test', email='test@...', password='top_secret')
        token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)


class APIUserAPITestCase(APITestCase):
    @pytest.mark.django_db
    def setUp(self):
        self.user = UserModel.objects.create_user(
            username='test', email='test@...', password='top_secret')
        token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        # Create a review for a product
        url = reverse('review-list', kwargs={'product_id': 1})
        data = {
            "title": "Best food ever",
            "review": "Really the best food I have ever tried",
            "rating": 5
        }
        self.client.post(url, data, format='json')


class TestSensorModuleListAnonymous(APITestCase):
    @pytest.mark.django_db
    def test_can_get_sensormodule_list(self):
        url = reverse('sensormodules-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 8)


class TestSensorModuleListAdmin(APIAdminAPITestCase):
    @pytest.mark.django_db
    def test_admin_can_post_new_SensorModule(self):
        url = reverse('sensormodules-list')

        data = {
            "sensor_uuid": "9d482ce8-a500-4422-9ef7-c2237c55bca8", "name": "win", "type": "win", "description": "win",
            "created_at": "2019-08-12T15:21:21.850Z", "updated_at": "2019-08-12T15:21:21.850Z", "techdata": "win"
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SensorModule.objects.count(), 2)
