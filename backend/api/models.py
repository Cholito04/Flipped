from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, TIMESTAMP
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    name = Column(String, nullable=False)
    description = Column(String)
    picture = Column(String)

    quantity = Column(Integer, default=0)

    price_bought = Column(Numeric(10, 2))
    price_sold = Column(Numeric(10, 2))

    created_at = Column(TIMESTAMP, server_default=func.now())
