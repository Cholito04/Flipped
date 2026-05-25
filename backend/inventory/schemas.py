from ninja import Schema
from datetime import datetime


class ItemIn(Schema):
    name: str
    sold_on: str | None = None
    store: str | None
    price_bought: float | None = None
    price_sold: float | None = None


class ItemOut(Schema):
    id: int
    name: str
    price_bought: float | None
    price_sold: float | None = None
    store: str | None
    created_at: datetime


class TripIn(Schema):
    trip_name: str
    stores: str | None


class TripOut(Schema):
    id: int
    trip_name: str
    stores: float | None
    spent: float | None = None
    made: float
    created_at: datetime


class StoreIn(Schema):
    store_name: str
    created_at: datetime


class StoreOut(Schema):
    id: int
    store_name: str
    created_at: datetime
