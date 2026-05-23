from ninja import Schema
from datetime import datetime

class ItemIn(Schema):
    name: str
    price_bought: float | None = None
    price_sold: float | None = None
    
class ItemOut(Schema):
    id: int
    name: str
    price_bought: float | None
    price_sold: float | None = None
    created_at: datetime