# Design Spec: Management Hub Consolidation & Song Request Feature

**Date:** 2026-03-18
**Status:** Draft
**Topic:** Consolidating staff operations into a single Management Hub and adding a customer-facing Song Request feature.

---

## 1. Overview
The goal is to provide a "one-stop" operational dashboard for management (The Staff Operations Center) and a new interactive feature for customers to request songs using their Steak Points.

## 2. Goals
- **Consolidation:** Merge ` Salad Bar IoT Hub` and `Analytics Dashboard` into a single, high-density `Management Hub`.
- **Song Request:** Implement a customer-facing category where songs can be requested for **9 Steak Points**.
- **UX Improvement:** Enhance the management dashboard with real-time status updates and better visual hierarchy.

## 3. Architecture & Components

### 3.1 Frontend (Next.js)
- **Management Hub (`/admin/analytics`):**
    - **KPI Grid:** Revenue, Active Orders, Prep Time, Satisfaction.
    - **Inventory & IoT Hub:** Real-time monitoring of Salad Bar ingredients.
    - **Song Request Queue:** A new real-time list showing pending song requests (Song, Artist, Table #).
    - **Staff Action Center:** Quick-action buttons for refilling stock and acknowledging songs.
- **Customer Menu (`/`):**
    - **Music & Vibes Category:** A new section for song requests.
    - **Song Request Modal:** Input for Song Title and Artist.

### 3.2 Backend (FastAPI)
- **New Models:**
    - `SongRequest`: `id`, `user_id`, `table_number`, `song_name`, `artist`, `status` (Pending/Played), `created_at`.
- **New Endpoints:**
    - `POST /songs/request`: Validates user points, deducts 9 points, and saves the request.
    - `GET /songs/queue`: Returns the list of pending requests for the management hub.
    - `PATCH /songs/request/{id}`: Allows staff to mark a song as "Played".
    - `POST /inventory/refill/{id}`: Updates the weight of an ingredient to its `max_capacity`.

## 4. Data Flow
1. **Customer:** Clicks "Request Song" (this is an **immediate action**, bypassing the cart system for now) -> Enters details in modal -> Frontend sends `POST` to `/songs/request`.
2. **Backend:** 
    - Fetches User (using the hardcoded `user_id: 1` as per the current system pattern) -> Checks `loyalty_points >= 9`.
    - Deducts 9 points (note: user specifically requested 9 points, overriding existing mocks that say 30).
    - Creates `SongRequest` entry with `table_number`.
3. **Management Hub:** Periodically fetches `/songs/queue` to update the "Live Song Queue" card.
4. **Inventory:** The `GET /analytics/inventory` endpoint will be updated to return the database `id` for each ingredient to support the `POST /inventory/refill/{id}` action.

## 5. Security & Validation
- **Authentication:** Use existing `StaffGuard` for admin routes.
- **Validation:** Strict check on Steak Points before allowing requests.
- **Privacy:** Table numbers are visible to staff but not other customers.
- **User Identity:** For this iteration, we will continue using the hardcoded user "Neighbor" (`user_id: 1`) to maintain consistency with the current codebase.

## 6. Testing Strategy
- **Unit Tests:** Backend logic for point deduction and request creation.
- **Integration Tests:** Management Hub correctly displays data from the new `/songs/queue` endpoint.
- **Manual QA:** Verify that drinks remain priced in THB and do not use points.

---
