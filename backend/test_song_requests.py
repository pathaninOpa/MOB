from fastapi.testclient import TestClient
from main import app
import models
from database import SessionLocal

client = TestClient(app)

def test_song_request_flow():
    # Setup: Ensure user 1 has enough points
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.id == 1).first()
    if not user:
        user = models.User(id=1, username="Neighbor", loyalty_points=100)
        db.add(user)
    else:
        user.loyalty_points = 100
    db.commit()
    
    # 1. Test POST /songs/request
    response = client.post(
        "/songs/request",
        json={"song_name": "Test Song", "artist": "Test Artist", "table_number": "6"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Song requested successfully!"
    
    # Check if points were deducted
    db.refresh(user)
    assert user.loyalty_points == 91
    
    # 2. Test GET /songs/queue
    response = client.get("/songs/queue")
    assert response.status_code == 200
    queue = response.json()
    assert len(queue) >= 1
    request_id = queue[-1]["id"]
    assert queue[-1]["song_name"] == "Test Song"
    assert queue[-1]["status"] == "Pending"
    
    # 3. Test PATCH /songs/request/{id}
    response = client.patch(f"/songs/request/{request_id}")
    assert response.status_code == 200
    assert response.json()["status"] == "Played"
    
    # 4. Verify it's no longer in the queue
    response = client.get("/songs/queue")
    queue = response.json()
    assert all(item["id"] != request_id for item in queue)

    print("All tests passed!")

if __name__ == "__main__":
    test_song_request_flow()
