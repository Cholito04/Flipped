from ninja import Schema
from pydantic import EmailStr

class UserIn(Schema):
    username: str
    email: EmailStr
    password: str