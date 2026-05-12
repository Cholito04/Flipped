from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Item, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory Management")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Welcome to the Inventory Management API!"}


@app.get("/items")
def get_items(db: Session = Depends(get_db)):
    return db.query(Item).all()


@app.post("/item")
def create_item(
    name: str,
    quantity: int,
    price_bought: float,
    price_sold: float,
    user_id: int,
    db: Session = Depends(get_db)
):
    item = Item(
        name=name,
        quantity=quantity,
        price_bought=price_bought,
        price_sold=price_sold,
        user_id=user_id
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
