from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
from pydantic import BaseModel
import datetime
from typing import List

# In production, use migrations (e.g., Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Steak Dek Ouan API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class OrderCreate(BaseModel):
    user_id: int
    table_number: str

class OrderUpdate(BaseModel):
    status: str

class ChatRequest(BaseModel):
    message: str
    context: str = ""

class SongRequestCreate(BaseModel):
    song_name: str
    artist: str
    table_number: str

class SongRequestUpdate(BaseModel):
    status: str

@app.post("/chat")
def chat_ai(request: ChatRequest):
    # Mocking LLM logic for menu knowledge and upselling
    msg = request.message.lower()
    if "recommend" in msg or "steak" in msg:
        return {"response": "Our 'ข้าวคั่วพริกเกลือสันคอหมู' (99 THB) is very popular today! It goes perfectly with a fresh salad from our bar."}
    if "salad" in msg:
        return {"response": "The salad bar is fully stocked! Our cucumbers are particularly crisp today. Don't forget, finishing your salad earns you +10 Steak Points!"}
    if "soft" in msg or "dessert" in msg:
        return {"response": "We have soft serve ice cream for 0 THB today! Would you like me to add one to your cart?"}
    if "drink" in msg or "coke" in msg or "water" in msg:
        return {"response": "Thirsty? We have Water for 15 THB and Coke for 25 THB! You'll also earn Steak Points for every drink you buy."}
    if "song" in msg or "music" in msg:
        return {"response": "Want to be the DJ? You can request a song for just 9 Steak Points in the Song Request category!"}
    return {"response": "I'm Chef Dek Ouan. I can help you with the menu, table status, or salad bar stock level. You can earn Steak Points with your meal and spend them on song requests!"}


@app.get("/")
def read_root():
    return {"message": "Welcome to Steak Dek Ouan Backend"}

@app.get("/orders")
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).all()

@app.get("/analytics/summary")
def get_analytics_summary(db: Session = Depends(get_db)):
    orders = db.query(models.Order).all()
    total_revenue = sum([99 for o in orders]) # Mocking price per order for now
    active_orders = len([o for o in orders if o.status != "Completed"])
    
    # Calculate average wait time (mock logic for demo)
    avg_wait = "8.5 min" if orders else "0 min"
    
    return {
        "total_revenue": total_revenue,
        "active_orders": active_orders,
        "avg_wait_time": avg_wait,
        "customer_satisfaction": "94%"
    }

@app.get("/analytics/inventory")
def get_inventory_status(db: Session = Depends(get_db)):
    # Mock inventory data for the dashboard
    return [
        {"name": "Lettuce", "level": 85, "status": "Good"},
        {"name": "Tomatoes", "level": 42, "status": "OK"},
        {"name": "Cucumbers", "level": 12, "status": "CRITICAL"},
        {"name": "Corn", "level": 60, "status": "Good"},
    ]

@app.post("/orders")
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    db_order = models.Order(user_id=order.user_id, table_number=order.table_number)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.patch("/orders/{order_id}")
def update_order_status(order_id: int, order_update: OrderUpdate, db: Session = Depends(get_db)):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    db_order.status = order_update.status
    db.commit()
    db.refresh(db_order)
    return db_order

@app.post("/songs/request")
def request_song(request: SongRequestCreate, db: Session = Depends(get_db)):
    # Hardcoded user_id: 1 for "Neighbor" as per current pattern
    user = db.query(models.User).filter(models.User.id == 1).first()
    if not user or user.loyalty_points < 9:
        raise HTTPException(status_code=400, detail="Not enough Steak Points (Need 9)")
    
    user.loyalty_points -= 9
    db_request = models.SongRequest(
        user_id=1,
        table_number=request.table_number,
        song_name=request.song_name,
        artist=request.artist
    )
    db.add(db_request)
    db.commit()
    return {"message": "Song requested successfully!"}

@app.get("/songs/queue")
def get_song_queue(db: Session = Depends(get_db)):
    return db.query(models.SongRequest).filter(models.SongRequest.status == "Pending").all()

@app.patch("/songs/request/{request_id}")
def update_song_request_status(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.SongRequest).filter(models.SongRequest.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Song request not found")
    db_request.status = "Played"
    db.commit()
    db.refresh(db_request)
    return db_request
