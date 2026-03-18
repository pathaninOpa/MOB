from sqlalchemy.orm import Session
from database import SessionLocal
import models

def setup_test_user():
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.id == 1).first()
    if not user:
        print("Creating user 'Neighbor' with ID 1...")
        user = models.User(id=1, username="Neighbor", loyalty_points=100)
        db.add(user)
    else:
        print(f"User 'Neighbor' exists with {user.loyalty_points} points.")
        if user.loyalty_points < 9:
            user.loyalty_points = 100
            print("Topped up points to 100.")
    db.commit()
    db.close()

if __name__ == "__main__":
    setup_test_user()
