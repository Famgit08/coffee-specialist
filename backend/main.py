from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Coffee Specialist API работает!"}

@app.get("/api/coffee-shops")
def get_coffee_shops():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, address, rating FROM coffee_shops")
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "name": row[1],
            "address": row[2],
            "rating": float(row[3]) if row[3] else 0.0
        })
    return result



class OrderItem(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    user_id: int
    coffee_shop_id: int
    items: List[OrderItem]

@app.post("/api/orders")
def create_order(order: OrderCreate):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Считаем итоговую сумму
    total = 0
    for item in order.items:
        cursor.execute("SELECT price FROM products WHERE id = ?", item.product_id)
        row = cursor.fetchone()
        if row:
            total += float(row[0]) * item.quantity
    
    # Создаём заказ
    cursor.execute("""
        INSERT INTO orders (user_id, coffee_shop_id, status_id, total_price)
        OUTPUT INSERTED.id
        VALUES (?, ?, 1, ?)
    """, order.user_id, order.coffee_shop_id, total)
    
    order_id = cursor.fetchone()[0]
    
    # Добавляем товары в заказ
    for item in order.items:
        cursor.execute("""
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (?, ?, ?, (SELECT price FROM products WHERE id = ?))
        """, order_id, item.product_id, item.quantity, item.product_id)
    
    conn.commit()
    conn.close()
    
    return {"order_id": order_id, "total": total, "status": "created"}


@app.get("/api/products")
def get_products():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.id, p.name, p.description, p.price, c.name as category
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
    """)
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "name": row[1],
            "description": row[2],
            "price": float(row[3]) if row[3] else 0.0,
            "category": row[4]
        })
    return result