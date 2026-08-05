from ninja import FilterSchema
from typing import Optional
from datetime import datetime


class BookFilterSchema(FilterSchema):
    name: Optional[str] = None
    author: Optional[str] = None
    created_after: Optional[datetime] = None


@api.get("/books")
    def list_books(request, filters: BookFilterSchema = Query(...)):
        books = Book.objects.all()
        books = filters.filter(books)
        return books