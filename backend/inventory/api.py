from ninja import Router
from . import schemas, models
from ninja_simple_jwt.auth.ninja_auth import HttpJwtAuth
from django.shortcuts import get_object_or_404
from typing import List

router = Router(auth=HttpJwtAuth(), tags=["inventory"])


@router.post("/createitems", summary="Create Item",
             description="Creates a new item in a user's inventory")
def create_item(request, payload: schemas.ItemIn):
    item = models.Item.objects.create(user_id=int(request.user.id),
                                      **payload.dict())
    return {"item_id": item.id, "user": item.user.username}


@router.get("/items/{item_id}", response=schemas.ItemOut, summary="Get Item",
            description="Retrieve an item from a user's inventory")
def get_item(request, item_id: int):
    item = get_object_or_404(
        models.Item,
        id=item_id,
        user_id=request.user.id
    )
    return item


@router.get("/items", response=List[schemas.ItemOut], summary="Get Item List",
            description="Retrieve list of all items in user's inventory")
def list_items(request):
    qs = models.Item.objects.filter(user_id=int(request.user.id))
    return qs


@router.post("/store", summary="Create store",
             description="Creates a new store that a user visits")
def create_store(request, payload: schemas.StoreIn):
    store = models.Store.objects.create(user_id=int(request.user.id),
                                        **payload.dict())
    return {"store_id": store.id, "user": store.user.username}

@router.get("/store/{store_id}", summary="get store",
            description="get a store for user")
def get_store(request, store_id):
    store = get_object_or_404(
        models.Store,
        id=store_id,
        user_id=request.user.id
    )
    return store


@router.get("/stores", response=List[schemas.StoreOut], summary="get list of stores",
            description="get list of all stores for user")
def list_stores(request):
    qs = models.Store.objects.filter(user_id=int(request.user.id))
    return qs


@router.post("/trip", response=List[schemas.TripOut], summary="Create trip",
             description="Creates a new trip for user")
def create_trip(request, payload: schemas.TripIn):
    trip = models.Trip.objects.create(user_id=int(request.user.id),
                                      **payload.dict())
    return {"trip_id": trip.id, "user": trip.user.username}


@router.get("/trip/{trip_id}", summary="get trip",
            description="get a trip for user")
def get_trip(request, trip_id):
    trip = get_object_or_404(
        models.Trip,
        id=trip_id,
        user_id=request.user.id
    )
    return trip


@router.get("/trips", summary="get list of trip",
            description="get list of all trips for user")
def list_trips(request):
    qs = models.Trip.objects.filter(user_id=int(request.user.id))
    return qs
