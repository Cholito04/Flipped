from django.test import TestCase
from ninja.testing import TestClient
from django.contrib.auth import get_user_model
from ninja_simple_jwt.jwt.token_operations import get_access_token_for_user
from .api import router
from .models import Item

# Create your tests here.

class ItemTest(TestCase):
    def setUp(self):
        self.ninja_client = TestClient(router)
        self.user = get_user_model().objects.create_user(username="username", password="password")
        Item.objects.create(user_id=self.user.id, name="jeans", price_bought=0, price_sold=None)
        Item.objects.create(user_id=self.user.id, name="shirt", price_bought=5.24, price_sold=30.32)
        self.token = self.get_token()
        
    def get_token(self):
        token, _ = get_access_token_for_user(self.user)
        return str(token)
    
    def test_create(self):
        self.data = {"name": "shoes", "price_bought": 10, "price_sold": 15}
        response = self.ninja_client.post("/", json=self.data, headers={"Authorization": f"Bearer {self.token}"})
        self.assertEqual(response.json(), {"item_id": 3, "user": self.user.username})
        
    def test_get(self):
        response = self.ninja_client.get("/get/1", headers={"Authorization": f"Bearer {self.token}"})
        self.assertEqual(response.json()["name"], "jeans")
        self.assertEqual(response.json()["id"], 1)
        
    def test_get_list(self):
        response = self.ninja_client.get("/", headers={"Authorization": f"Bearer {self.token}"})
        print(response.json())