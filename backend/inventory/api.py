from ninja import Router
from . import schemas, models
from ninja_simple_jwt.auth.ninja_auth import HttpJwtAuth
from django.shortcuts import get_object_or_404
from typing import List
from django.contrib.auth import get_user_model
from django.db.models import Sum

router = Router(auth=HttpJwtAuth(), tags=["inventory"])
User = get_user_model()


@router.post("/items",  response=schemas.ItemOut, summary="Create Item",
             description="Creates a new item in a user's inventory")
def create_item(request, payload: schemas.ItemIn):
    user = get_object_or_404(User, id=request.user.id)
    brand = get_object_or_404(
        models.Brand,
        id=payload.brand_id,
        user=user
    )

    style = get_object_or_404(
        models.Style,
        id=payload.style_id,
        user=user
    )

    item = models.Item.objects.create(
        user=user,
        name=payload.name,
        brand=brand,
        style=style,
        size=payload.size,
        category=payload.category,
        price_bought=payload.price_bought,
        price_sold=payload.price_sold,
    )

    return item


@router.delete("/items/{item_id}")
def delete_item(request, item_id: int):
    item = get_object_or_404(
        models.Item,
        id=item_id,
        user=request.user
    )

    item.delete()

    return {"success": True}


@router.get("/items/{item_id}", response=schemas.ItemOut, summary="Get Item",
            description="Retrieve an item from a user's inventory")
def get_item(request, item_id: int):
    item = get_object_or_404(models.Item, id=item_id, user=request.user)
    return item


@router.get("/items", response=List[schemas.ItemOut])
def list_items(request):
    return models.Item.objects.filter(user=request.user)


@router.post("/brands",  response=schemas.BrandOut, summary="Create brand",
             description="Creates a new brand in a user's inventory")
def create_brand(request, payload: schemas.BrandIn):
    user = get_object_or_404(User, id=request.user.id)
    brand = models.Brand.objects.create(
        user=user,
        brand=payload.brand
    )

    return brand


@router.get("/brands", response=List[schemas.BrandOut])
def list_brands(request):
    return models.Brand.objects.filter(user_id=request.user.id)


@router.post("/styles",  response=schemas.StyleOut, summary="Create style",
             description="Creates a new brand in a user's inventory")
def create_style(request, payload: schemas.StyleIn):
    user = get_object_or_404(User, id=request.user.id)
    style = models.Style.objects.create(
        user=user,
        style=payload.style
    )
    return style


@router.get("/styles", response=List[schemas.StyleOut])
def list_styles(request):
    return models.Style.objects.filter(user_id=request.user.id)


@router.get("/stats", response=schemas.StatsOut)
def inventory_stats(request):

    items = models.Item.objects.filter(user_id=request.user.id)

    total_invested = (
        items.aggregate(total=Sum("price_bought"))["total"] or 0
    )

    total_revenue = (
        items.aggregate(total=Sum("price_sold"))["total"] or 0
    )

    total_profit = total_revenue - total_invested

    return {
        "total_invested": float(total_invested),
        "total_revenue": float(total_revenue),
        "total_profit": float(total_profit),
    }
