from ninja import NinjaAPI
from .schemas import UserIn
from django.contrib.auth import get_user_model

api = NinjaAPI()

@api.post("/auth/register", response={201: None, 400: dict})
def register_user(request, payload: UserIn): 
    User = get_user_model()
    if User.objects.filter(username=payload.username).exists():
        return 400, {"error": "Username already taken"}
    
    if User.objects.filter(email=payload.email).exists():
        return 400, {"error": "Email already registered"}
    
    User.objects.create_user(
        username=payload.username,
        email=payload.email,
        password=payload.password
    )
    
    return 201, None
