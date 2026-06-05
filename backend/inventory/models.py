from django.db import models
from django.conf import settings


# Create your models here.
class Style(models.Model):
    user = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE
    )
    style = models.CharField(max_length=100)

    class Meta:
        unique_together = ["user", "style"]


class Brand(models.Model):
    user = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE
    )
    brand = models.CharField(max_length=100)

    class Meta:
        unique_together = ["user", "brand"]


class Item(models.Model):

    STATUS_CHOICES = [
        ("not_listed", "Not Listed"),
        ("listed", "Listed"),
        ("sold", "Sold"),
    ]

    CATEGORY_CHOICES = [
        ("hoodie", "Hoodie"),
        ("shirt", "Shirt"),
        ("pants", "Pants"),
        ("jacket", "Jacket"),
        ("shoes", "Shoes"),
    ]

    SIZE_CHOICES = [
        ("XS", "XS"),
        ("S", "S"),
        ("M", "M"),
        ("L", "L"),
        ("XL", "XL"),
        ("XXL", "XXL"),
    ]

    user = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)
    brand = models.ForeignKey(
        Brand,
        on_delete=models.SET_NULL,
        null=True
    )
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        null=True
    )
    style = models.ForeignKey(
        Style,
        on_delete=models.SET_NULL,
        null=True
    )
    size = models.CharField(
        max_length=10,
        choices=SIZE_CHOICES,
        null=True
    )
    image_url = models.URLField(blank=True, null=True)
    price_bought = models.DecimalField(decimal_places=2,
                                       max_digits=10, null=True)
    price_sold = models.DecimalField(decimal_places=2,
                                     max_digits=10, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="not_listed",
        null=True
    )

    @property
    def profit(self):
        if self.price_bought and self.price_sold:
            return self.price_sold - self.price_bought
        return None
