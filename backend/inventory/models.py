from django.db import models
from django.conf import settings


# Create your models here.
class Store(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    store_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.store_name


class Trip(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    trip_name = models.CharField(max_length=255)
    stores = models.ManyToManyField(Store)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.trip_name


class Item(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    store = models.ForeignKey(
        Store,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    name = models.CharField(max_length=255)
    sold_on = models.CharField(max_length=255, blank=True)
    price_bought = models.DecimalField(decimal_places=2, max_digits=10,
                                       null=True, blank=True)
    price_sold = models.DecimalField(decimal_places=2, max_digits=10,
                                     null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
