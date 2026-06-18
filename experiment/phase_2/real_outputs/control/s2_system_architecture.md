# Stage 2: System Architecture Blueprint

This document outlines the database schema and API contracts for **ScribeAI**.

---

## 1. Database Schema (PostgreSQL)

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Meetings Table
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'processing', -- processing, completed, failed
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transcripts Table
CREATE TABLE transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE UNIQUE,
    full_text TEXT NOT NULL,
    raw_audio_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Action Items Table
CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, skipped
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. API Contracts

### 2.1 Upload Meeting Audio
* **Endpoint:** `POST /api/meetings/upload`
* **Content-Type:** `multipart/form-data`
* **Request Body:**
  * `title`: String
  * `meetingDate`: ISO 8601 String
  * `file`: Audio File (mp3/wav)
* **Response (202 Accepted):**
  ```json
  {
    "success": true,
    "message": "Meeting audio uploaded and processing started.",
    "meeting": {
      "id": "e0e227ab-433b-4197-8c31-7b772b14421b",
      "title": "Weekly Sync",
      "meeting_date": "2026-06-17T20:00:00Z",
      "status": "processing"
    }
  }
  ```

### 2.2 Get Meeting Details (including Summary and Action Items)
* **Endpoint:** `GET /api/meetings/:id`
* **Headers:** `Authorization: Bearer <token>`
* **Response (200 OK):**
  ```json
  {
    "id": "e0e227ab-433b-4197-8c31-7b772b14421b",
    "title": "Weekly Sync",
    "status": "completed",
    "summary": "We discussed the Q3 product roadmap. The main priority is launching the user auth flow by next Friday.",
    "transcript": "Hello everyone. Let's start the meeting...",
    "action_items": [
      {
        "id": "31b26804-b97d-4199-9065-27f9999a4c84",
        "description": "Launch user auth flow",
        "assignee_id": "c1f7b7cb-4b36-4c28-98e3-f860fb7f80db",
        "due_date": "2026-06-25T23:59:59Z",
        "status": "pending"
      }
    ]
  }
  ```

### 2.3 Update Action Item Status
* **Endpoint:** `PATCH /api/action-items/:id`
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "status": "completed"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "action_item": {
      "id": "31b26804-b97d-4199-9065-27f9999a4c84",
      "status": "completed",
      "updated_at": "2026-06-17T21:30:00Z"
    }
  }
  ```
