from ninja import Router, Query
from . import schemas, models
from ninja_simple_jwt.auth.ninja_auth import HttpJwtAuth
from django.shortcuts import get_object_or_404
from typing import List
from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.utils import timezone
from django.db.models import Avg, F, ExpressionWrapper, DurationField

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
        status=payload.status,
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
def list_items(request, filters: schemas.ItemFilterSchema = Query(...)):
    items = models.Item.objects.filter(user=request.user)
    return filters.filter(items)


@router.patch("/items/{item_id}", response=schemas.ItemOut)
def update_item(request, item_id: int, payload: schemas.ItemUpdate):
    item = get_object_or_404(models.Item, id=item_id, user=request.user)

    for attr, value in payload.dict(exclude_unset=True).items():
        if attr == "brand_id":
            item.brand = get_object_or_404(models.Brand,
                                           id=value, user=request.user)
        elif attr == "style_id":
            item.style = get_object_or_404(models.Style,
                                           id=value, user=request.user)
        elif attr == "status":
            if value == "sold" and item.status != "sold":
                item.sold_at = timezone.now()
            elif value != "sold":
                item.sold_at = None  # reset if unmarked as sold
            item.status = value
        else:
            setattr(item, attr, value)

    item.save()
    return item


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
    total_items = items.count()
    items_sold = items.filter(status="sold").count()
    sell_through_rate = round((items_sold / total_items * 100),
                              1) if total_items > 0 else 0.0

    avg_sell_time = items.filter(
        status="sold", sold_at__isnull=False
    ).annotate(
        sell_time=ExpressionWrapper(
            F("sold_at") - F("created_at"), output_field=DurationField()
        )
    ).aggregate(avg=Avg("sell_time"))["avg"]

    avg_sell_days = avg_sell_time.days if avg_sell_time else None

    return {
        "total_invested": float(total_invested),
        "total_revenue": float(total_revenue),
        "total_profit": float(total_profit),
        "items_sold": items_sold,
        "sell_through_rate": sell_through_rate,
        "avg_sell_days": avg_sell_days,
    }
