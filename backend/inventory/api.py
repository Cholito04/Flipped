from decimal import ROUND_DOWN, Decimal
from ninja.errors import HttpError
from django.db import transaction
from ninja import Router, Query
from . import schemas, models
from ninja_simple_jwt.auth.ninja_auth import HttpJwtAuth
from django.shortcuts import get_object_or_404
from typing import List
from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from django.utils import timezone
from django.db.models import (
    Avg,
    F,
    ExpressionWrapper,
    DurationField,
    DecimalField,
)

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

    store = get_object_or_404(
        models.Store,
        id=payload.store_id,
        user=user
    )

    item = models.Item.objects.create(
        user=user,
        brand=brand,
        style=style,
        size=payload.size,
        category=payload.category,
        store=store,
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

        elif attr == "store_id":
            item.store = get_object_or_404(models.Store,
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


@router.post("/items/bulk", response=List[schemas.ItemOut], summary="Bulk create items")
def bulk_create_items(request, payload: schemas.ItemBulkIn):
    qty = len(payload.items)
    if not 1 <= qty <= 500:
        raise HttpError(400, "Add between 1 and 500 items")
    if payload.total_price < 0:
        raise HttpError(400, "Total price can't be negative")
    if payload.status == "sold":
        raise HttpError(400, "Bulk items can't be added as sold")

    store = get_object_or_404(models.Store, id=payload.store_id, user_id=request.user.id)

    brand_ids = {r.brand_id for r in payload.items}
    style_ids = {r.style_id for r in payload.items}
    brands = {b.id: b for b in models.Brand.objects.filter(user_id=request.user.id, id__in=brand_ids)}
    styles = {s.id: s for s in models.Style.objects.filter(user_id=request.user.id, id__in=style_ids)}
    if len(brands) != len(brand_ids) or len(styles) != len(style_ids):
        raise HttpError(400, "Invalid brand or style")

    # split evenly, then hand out leftover cents so the total is exact
    base = (payload.total_price / qty).quantize(Decimal("0.01"),
                                                rounding=ROUND_DOWN)
    prices = [base] * qty
    for i in range(int((payload.total_price - base * qty) * 100)):
        prices[i] += Decimal("0.01")

    with transaction.atomic():
        return [
            models.Item.objects.create(
                user_id=request.user.id,
                brand=brands[row.brand_id],
                style=styles[row.style_id],
                store=store,
                size=row.size,
                category=row.category,
                status=payload.status,
                price_bought=price,
            )
            for row, price in zip(payload.items, prices)
        ]


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


@router.get("/stores", response=List[schemas.StoreOut])
def list_stores(request):
    return models.Store.objects.filter(user_id=request.user.id)


@router.post("/stores",  response=schemas.StoreOut, summary="Create store",
             description="Creates a new store in a user's inventory")
def create_stores(request, payload: schemas.StoreIn):
    user = get_object_or_404(User, id=request.user.id)
    store = models.Store.objects.create(
        user=user,
        store=payload.store
    )
    return store


@router.get("/stats", response=schemas.StatsOut)
def inventory_stats(request):
    items = models.Item.objects.filter(user_id=request.user.id)
    sold_items = items.filter(status="sold")

    total_invested = items.aggregate(total=Sum("price_bought"))["total"] or 0

    # only sum revenue from actually sold items
    total_revenue = sold_items.aggregate(total=Sum("price_sold"))["total"] or 0

    total_profit = total_revenue - total_invested

    total_count = items.count()
    items_sold = sold_items.count()
    sell_through_rate = round((items_sold / total_count * 100),
                              1) if total_count > 0 else 0.0

    avg_sell_time = sold_items.filter(
        sold_at__isnull=False
    ).annotate(
        sell_time=ExpressionWrapper(
            F("sold_at") - F("created_at"), output_field=DurationField()
        )
    ).aggregate(avg=Avg("sell_time"))["avg"]

    avg_sell_days = avg_sell_time.days if avg_sell_time else None

    # avg profit per sold item
    profit_expr = ExpressionWrapper(
        F("price_sold") - F("price_bought"),
        output_field=DecimalField(max_digits=10, decimal_places=2),
    )

    def best_by(field):
        return (
            sold_items
            .values(field)
            .annotate(
                avg_profit=Avg(profit_expr),
                total_sold=Count("id"),
            )
            .filter(total_sold__gte=2)
            .order_by("-avg_profit")
            .first()
        )

    best_brand = best_by("brand__brand")
    best_style = best_by("style__style")
    best_store = best_by("store__store")

    avg_profit_per_item = sold_items.aggregate(avg=Avg(profit_expr))["avg"] or 0

    return {
        "total_invested": float(total_invested),
        "total_revenue": float(total_revenue),
        "total_profit": float(total_profit),
        "items_sold": items_sold,
        "sell_through_rate": sell_through_rate,
        "avg_sell_days": avg_sell_days,
        "total_items": total_count,
        "avg_profit_per_item": round(float(avg_profit_per_item), 2),
        "best_brand": (
            best_brand["brand__brand"] if best_brand else None
        ),
        "best_brand_avg_profit": (
            round(best_brand["avg_profit"], 2) if best_brand else None
        ),
        "best_brand_total_sold": (
            best_brand["total_sold"] if best_brand else None
        ),
        "best_style": (
            best_style["style__style"] if best_style else None
        ),
        "best_style_avg_profit": (
            round(best_style["avg_profit"], 2) if best_style else None
        ),
        "best_style_total_sold": (
            best_style["total_sold"] if best_style else None
        ),
        "best_store": (
            best_store["store__store"] if best_store else None
        ),
        "best_store_avg_profit": (
            round(best_store["avg_profit"], 2) if best_store else None
        ),
        "best_store_total_sold": (
            best_store["total_sold"] if best_store else None
        ),
    }
