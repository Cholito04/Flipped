from ninja import Schema
from datetime import datetime
from ninja import FilterSchema, FilterLookup
from typing import Optional, Annotated


class ItemIn(Schema):
    brand_id: int
    style_id: int
    size: str
    category: str
    price_bought: float | None = None
    price_sold: float | None = None
    status: str


class ItemOut(Schema):
    id: int
    brand: BrandOut
    style: StyleOut
    size: str
    category: str
    price_bought: float | None
    price_sold: float | None = None
    status: str
    created_at: datetime
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


class StatsOut(Schema):
    total_invested: float
    total_revenue: float
    total_profit: float
    items_sold: int
    sell_through_rate: float
    avg_sell_days: Optional[int] = None


class ItemFilterSchema(FilterSchema):
    status: Optional[str] = None
    category: Optional[str] = None
    brand_id: Optional[int] = None
    style_id: Optional[int] = None
    name: Annotated[Optional[str], FilterLookup("name__icontains")] = None
