from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    loyalty_points = Column(Integer, default=0)
    salad_bar_streak = Column(Integer, default=0)

class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    price = Column(Float)
    category = Column(String)
    image_url = Column(String, nullable=True)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="Pending") # Pending, Cooking, Completed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    table_number = Column(String)
    
    user = relationship("User")

class SaladBarInventory(Base):
    __tablename__ = "salad_bar_inventory"
    id = Column(Integer, primary_key=True, index=True)
    ingredient_name = Column(String)
    current_weight = Column(Float) # in grams or percentage
    max_capacity = Column(Float)

class SongRequest(Base):
    __tablename__ = "song_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    table_number = Column(String)
    song_name = Column(String)
    artist = Column(String)
    status = Column(String, default="Pending") # Pending, Played
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
