from django.db import models
from django.conf import settings

# Create your models here.

class Item(models.Model):
    user = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE
    )  
    name = models.CharField()
    price_bought = models.DecimalField(decimal_places=2, max_digits=10, null=True)
    price_sold = models.DecimalField(decimal_places=2, max_digits=10, null=True)
    created_at = models.DateTimeField(auto_now_add=True)