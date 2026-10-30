from decimal import Decimal

from ninja import Schema
from datetime import datetime
from ninja import FilterSchema, FilterLookup
from typing import List, Optional, Annotated


class ItemIn(Schema):
    brand_id: int
    style_id: int
    size: str
    category: str
    store_id: int | None = None
    price_bought: float | None = None
    price_sold: float | None = None
    status: str


class ItemOut(Schema):
    id: int
    brand: BrandOut
    style: StyleOut
    size: str
    category: str
    store: StoreOut | None
    price_bought: float | None
    price_sold: float | None = None
    status: str
    created_at: datetime
    sold_at: Optional[datetime] = None
    sell_time_days: Optional[int] = None

    @staticmethod
    def resolve_sell_time_days(obj):
        if obj.status == "sold" and obj.sold_at:
            return (obj.sold_at - obj.created_at).days
        return None


class ItemUpdate(Schema):
    size: Optional[str] = None
    category: Optional[str] = None
    price_bought: Optional[float] = None
    price_sold: Optional[float] = None
    status: Optional[str] = None
    brand_id: Optional[int] = None
    style_id: Optional[int] = None
    store_id: Optional[int] = None


class BulkItemRow(Schema):
    brand_id: int
    style_id: int
    size: str
    category: str


class ItemBulkIn(Schema):
    store_id: int
    status: str = "not_listed"
    total_price: Decimal
    items: List[BulkItemRow]


class BrandIn(Schema):
    brand: str


class BrandOut(Schema):
    id: int
    brand: str


class StyleIn(Schema):
    style: str


class StyleOut(Schema):
    id: int
    style: str


class StoreIn(Schema):
    store: str


class StoreOut(Schema):
    id: int
    store: str


class StatsOut(Schema):
    total_invested: float
    total_revenue: float
    total_profit: float
    items_sold: int
    total_items: int
    sell_through_rate: float
    avg_sell_days: Optional[int] = None
    avg_profit_per_item: float
    best_brand: Optional[str] = None
    best_brand_avg_profit: Optional[float] = None
    best_brand_total_sold: Optional[int] = None
    best_style: Optional[str] = None
    best_style_avg_profit: Optional[float] = None
    best_style_total_sold: Optional[int] = None
    best_store: Optional[str] = None
    best_store_avg_profit: Optional[float] = None
    best_store_total_sold: Optional[int] = None


class ItemFilterSchema(FilterSchema):
    status: Optional[str] = None
    category: Optional[str] = None
    brand_id: Optional[int] = None
    style_id: Optional[int] = None
    store_id: Optional[int] = None
    name: Annotated[Optional[str], FilterLookup("name__icontains")] = None
