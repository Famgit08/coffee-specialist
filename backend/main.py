from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from database import get_db
from firebase_admin import firestore

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



class UserAuth(BaseModel):
    username: str
    password: str

class OrderItem(BaseModel):
    product_id: str
    quantity: int

class OrderCreate(BaseModel):
    user_id: str
    coffee_shop_id: str
    items: List[OrderItem]



@app.get("/")
def read_root():
    return {"message": "Coffee Specialist API работает на Firebase!"}

@app.get("/api/coffee-shops")
def get_coffee_shops():
    db = get_db()
    shops_ref = db.collection('coffee_shops')
    docs = shops_ref.stream()
    
    result = []
    for doc in docs:
        data = doc.to_dict()
        result.append({
            "id": doc.id,
            "name": data.get("name"),
            "address": data.get("address"),
            "rating": data.get("rating", 0.0)
        })
    return result

@app.get("/api/products")
def get_products():
    db = get_db()
    products_ref = db.collection('products')
    docs = products_ref.stream()
    
    result = []
    for doc in docs:
        data = doc.to_dict()
        result.append({
            "id": doc.id,
            "name": data.get("name"),
            "description": data.get("description"),
            "price": data.get("price", 0.0),
            "category": data.get("category", "")
        })
    return result

@app.post("/api/orders")
def create_order(order: OrderCreate):
    db = get_db()
    total = 0
    

    
    order_data = {
        "user_id": order.user_id,
        "coffee_shop_id": order.coffee_shop_id,
        "status": "new",
        "total_price": total,
        "created_at": firestore.SERVER_TIMESTAMP
    }
    
    _, order_ref = db.collection('orders').add(order_data)
    
    for item in order.items:
        db.collection('order_items').add({
            "order_id": order_ref.id,
            "product_id": item.product_id,
            "quantity": item.quantity
        })
    
    return {"order_id": order_ref.id, "total": total, "status": "created"}

@app.post("/api/register")
def register(user: UserAuth):
    db = get_db()
    users_ref = db.collection('users')
    
    query = users_ref.where("username", "==", user.username).limit(1).stream()
    if list(query):
        raise HTTPException(status_code=400, detail="Пользователь с таким логином уже существует")
    
    users_ref.add({
        "username": user.username,
        "password_hash": user.password,
        "created_at": firestore.SERVER_TIMESTAMP
    })
    return {"message": "Пользователь успешно зарегистрирован"}

@app.post("/api/login")
def login(user: UserAuth):
    db = get_db()
    users_ref = db.collection('users')
    
    query = users_ref.where("username", "==", user.username).where("password_hash", "==", user.password).limit(1).stream()
    docs = list(query)
    
    if docs:
        doc = docs[0]
        return {"message": "Успешный вход", "user_id": doc.id, "username": doc.to_dict().get("username")}
    else:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")