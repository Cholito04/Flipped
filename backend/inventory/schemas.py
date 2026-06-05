from ninja import Schema
from datetime import datetime


class ItemIn(Schema):
    name: str
    brand_id: int
    style_id: int
    size: str
    category: str
    price_bought: float | None = None
    price_sold: float | None = None
    status: str


class ItemOut(Schema):
    id: int
    name: str
    brand: BrandOut
    style: StyleOut
    size: str
    category: str
    price_bought: float | None
    price_sold: float | None = None
    status: str
    created_at: datetime


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
