# Management Hub & Song Request Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate management operations into a single hub and add a customer-facing song request feature costing 9 Steak Points.

**Architecture:** 
- Add `SongRequest` model and endpoints to the FastAPI backend.
- Update existing inventory endpoints to support ID-based refill actions and aligned data fields.
- Enhance the `admin/analytics` frontend to include a live song queue and full inventory management with backend sync.
- Update the customer-facing menu with a new "Music & Vibes" category and an immediate "Request Now" flow.

**Tech Stack:** FastAPI, SQLAlchemy, Next.js, TailwindCSS, Lucide React.

---

### Task 1: Backend Data Model Update

**Files:**
- Modify: `backend/models.py`
- Modify: `backend/main.py`

- [ ] **Step 1: Add SongRequest model to models.py**
```python
class SongRequest(Base):
    __tablename__ = "song_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    table_number = Column(String)
    song_name = Column(String)
    artist = Column(String)
    status = Column(String, default="Pending") # Pending, Played
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
```

- [ ] **Step 2: Update database creation in main.py**
(Ensure `Base.metadata.create_all(bind=engine)` is called, which it already is).

- [ ] **Step 3: Commit**
```bash
git add backend/models.py
git commit -m "db: add SongRequest model"
```

---

### Task 2: Song Request Endpoints

**Files:**
- Modify: `backend/main.py`

- [ ] **Step 1: Add SongRequest schemas**
```python
class SongRequestCreate(BaseModel):
    song_name: str
    artist: str
    table_number: str
```

- [ ] **Step 2: Implement POST /songs/request and update AI mock**
(Update `chat_ai` mock response from 30 to 9 points).
```python
@app.post("/songs/request")
def request_song(request: SongRequestCreate, db: Session = Depends(get_db)):
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
```

- [ ] **Step 3: Implement GET /songs/queue and PATCH /songs/request/{id}**
Ensure `GET /songs/queue` filters for `status == "Pending"`.
Ensure `PATCH /songs/request/{id}` updates `status` to `"Played"`.

- [ ] **Step 4: Verify with Curl**
Run: `curl -X POST http://localhost:8000/songs/request -H "Content-Type: application/json" -d '{"song_name": "Test", "artist": "Tester", "table_number": "6"}'`
Expected: 200 OK or 400 if points are low.

- [ ] **Step 5: Commit**
```bash
git add backend/main.py
git commit -m "feat: add song request endpoints and update AI mock"
```

---

### Task 3: Inventory Refill Endpoints

**Files:**
- Modify: `backend/main.py`

- [ ] **Step 1: Update GET /analytics/inventory to return database IDs and align fields**
Ensure it returns: `[{"id": 1, "name": "Lettuce", "weight": 1500, "maxWeight": 2000}, ...]` (matching `SaladBarInventory` model).

- [ ] **Step 2: Implement POST /inventory/refill/{id}**
```python
@app.post("/inventory/refill/{item_id}")
def refill_inventory(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.SaladBarInventory).filter(models.SaladBarInventory.id == item_id).first()
    if item:
        item.current_weight = item.max_capacity
        db.commit()
        return {"message": f"{item.ingredient_name} refilled"}
    return {"message": "Inventory refilled (mock)"}
```

- [ ] **Step 3: Verify with Curl**
Run: `curl -X POST http://localhost:8000/inventory/refill/1`
Expected: 200 OK.

- [ ] **Step 4: Commit**
```bash
git add backend/main.py
git commit -m "feat: add inventory refill endpoint with IDs"
```

---

### Task 4: Customer UI - Song Request

**Files:**
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Add "Music & Vibes" Category and Update menuItems**
(Update item ID 7 `pointPrice` from 30 to 9).

- [ ] **Step 2: Update Song Request Modal to Bypass Cart**
Change the "Add to Cart" button to a "Request Now" button that calls `POST /songs/request` directly.
Ensure it deducts points immediately on success.

- [ ] **Step 3: Verify UI**
(Check menu for 9 points, test request modal).

- [ ] **Step 4: Commit**
```bash
git add frontend/src/app/page.tsx
git commit -m "feat: update customer UI with 9pt song requests"
```

---

### Task 5: Management Hub - Live Song Queue & Inventory Sync

**Files:**
- Modify: `frontend/src/app/admin/analytics/page.tsx`

- [ ] **Step 1: Fetch initial inventory and song queue on mount**
Use `useEffect` to fetch `GET /analytics/inventory` and `GET /songs/queue`.

- [ ] **Step 2: Add Live Song Queue Card**
(Fetch from `/songs/queue` every 10 seconds).

- [ ] **Step 3: Implement "Mark as Played" button**

- [ ] **Step 4: Update Inventory Card with Refill API call**

- [ ] **Step 5: Commit**
```bash
git add frontend/src/app/admin/analytics/page.tsx
git commit -m "feat: add live song queue to management hub"
```

---

### Task 6: Cleanup & Redirect

**Files:**
- Modify: `frontend/src/app/salad-bar/page.tsx`

- [ ] **Step 1: Redirect /salad-bar to /admin/analytics**
(Add a simple `useEffect` redirect or a "Moved" message).

- [ ] **Step 2: Commit**
```bash
git add frontend/src/app/salad-bar/page.tsx
git commit -m "chore: redirect old salad-bar page to analytics hub"
```
