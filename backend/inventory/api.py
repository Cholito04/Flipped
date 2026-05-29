from ninja import Router
from . import schemas, models
from ninja_simple_jwt.auth.ninja_auth import HttpJwtAuth
from django.shortcuts import get_object_or_404
from typing import List

router = Router(auth=HttpJwtAuth(), tags=["inventory"])


@router.post("/create-item", summary="Create Item",
             description="Creates a new item in a user's inventory")
def create_item(request, payload: schemas.ItemIn):
    item = models.Item.objects.create(user_id=int(request.user.id),
                                      **payload.dict())
    return {"item_id": item.id, "user": item.user.username}


@router.get("/get/{item_id}", response=schemas.ItemOut, summary="Get Item",
            description="Retrieve an item from a user's inventory")
def get_item(request, item_id: int):
    item = get_object_or_404(models.Item, id=item_id)
    return item


@router.get("/items", response=List[schemas.ItemOut], summary="Get Item List",
            description="Retrieve list of all items in user's inventory")
def list_items(request):
    qs = models.Item.objects.filter(user_id=int(request.user.id))
    return qs
