from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
import datetime

def test_song_request_creation():
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Create a test song request
        new_request = models.SongRequest(
            user_id=1, # Assume user 1 exists or just use it as a FK
            table_number="T1",
            song_name="Imagine",
            artist="John Lennon",
            status="Pending"
        )
        db.add(new_request)
        db.commit()
        db.refresh(new_request)
        
        # Verify it was saved correctly
        saved_request = db.query(models.SongRequest).filter(models.SongRequest.id == new_request.id).first()
        assert saved_request is not None
        assert saved_request.song_name == "Imagine"
        assert saved_request.artist == "John Lennon"
        assert saved_request.status == "Pending"
        assert isinstance(saved_request.created_at, datetime.datetime)
        
        print("SongRequest creation test passed!")
        
        # Cleanup
        db.delete(saved_request)
        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    test_song_request_creation()
