# HanziFlow - API Contracts

This document defines the API endpoints, input payloads, validation rules, output schemas, and error responses for the HanziFlow Express backend.

All endpoints prefix: `/api`

---

## 1. Import Vocabulary (CSV)

* **Endpoint:** `POST /api/vocab/import`
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "csvText": "string (raw CSV data)"
  }
  ```
  *CSV Format requirements:*
  - Must contain headers: `character,pinyin,translation`
  - Columns must not be empty.
  - Characters should be Chinese Hanzi.
  - Pinyin must contain tone markings or tone numbers.
* **Validation Rules:**
  - `csvText` must be a non-empty string, maximum size 100KB.
  - Rows must be parsed and validated. Any malformed rows must throw an error, preventing partial imports.
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 3,
    "items": [
      {
        "id": "e0b82f05-2b0a-4a25-9ef1-b54199f1fa02",
        "character": "你好",
        "pinyin": "nǐ hǎo",
        "translation": "hello"
      }
    ]
  }
  ```
* **Error Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "error": "Invalid CSV format: Missing 'character' header or row 3 is incomplete."
  }
  ```

---

## 2. Audio Retrieval with Speed Limits

* **Endpoint:** `GET /api/audio`
* **Query Parameters:**
  * `text` (string, required): Chinese characters to synthesize.
  * `speed` (number, required): Speed modifier between `0.5` and `2.0`.
* **Validation Rules:**
  - `text`: Must be between 1 and 200 characters, containing no control codes or malicious escape characters.
  - `speed`: Must be a valid floating-point number. Range: `0.5 <= speed <= 2.0`.
* **Success Response (200 OK):**
  - Content-Type: `audio/mpeg` (serves the audio binary data matching the text and speed)
* **Error Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "error": "Invalid speed parameter. Must be a number between 0.5 and 2.0."
  }
  ```

---

## 3. Submit Journal Entry & Feedback

* **Endpoint:** `POST /api/journal`
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "content": "Today I met my friend at 123-456-7890. Email him at test@example.com. We said 你好.",
    "vocabRatings": [
      {
        "vocabId": "e0b82f05-2b0a-4a25-9ef1-b54199f1fa02",
        "rating": "easy"
      }
    ]
  }
  ```
* **Validation Rules:**
  - `content`: Must be a non-empty string (max 5000 characters).
  - `vocabRatings`: Must be an array of objects. Each object must have a valid UUID `vocabId` and a `rating` belonging to the set `['easy', 'medium', 'hard']`.
* **PII Scrubbing Logic:**
  - Server scans `content` and replaces sensitive data with placeholder strings:
    - Email addresses -> `[EMAIL_REDACTED]`
    - Phone numbers -> `[PHONE_REDACTED]`
    - Identity/Credit Card Numbers -> `[ID_REDACTED]`
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "journalEntry": {
      "id": "673f8d9b-d24e-4b68-80f0-c529d8926ccb",
      "content": "Today I met my friend at [PHONE_REDACTED]. Email him at [EMAIL_REDACTED]. We said 你好.",
      "created_at": "2026-06-19T04:57:07Z"
    },
    "vocabUpdates": [
      {
        "vocabId": "e0b82f05-2b0a-4a25-9ef1-b54199f1fa02",
        "newStreak": 1,
        "nextReviewAt": "2026-06-20T04:57:07Z"
      }
    ]
  }
  ```
* **Error Response (422 Unprocessable Entity / 400 Bad Request):**
  ```json
  {
    "success": false,
    "error": "Validation failed: 'vocabRatings[0].rating' must be one of 'easy', 'medium', 'hard'."
  }
  ```

---

## 4. Get Vocabulary List

* **Endpoint:** `GET /api/vocab`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "items": [
      {
        "id": "e0b82f05-2b0a-4a25-9ef1-b54199f1fa02",
        "character": "你好",
        "pinyin": "nǐ hǎo",
        "translation": "hello",
        "progress": {
          "streak": 2,
          "nextReviewAt": "2026-06-21T12:00:00Z"
        }
      }
    ]
  }
  ```

---

## 5. Get Journals List

* **Endpoint:** `GET /api/journals`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "items": [
      {
        "id": "673f8d9b-d24e-4b68-80f0-c529d8926ccb",
        "content": "Today I met my friend at [PHONE_REDACTED]. We said 你好.",
        "created_at": "2026-06-19T04:57:07Z",
        "vocabPracticed": [
          {
            "id": "e0b82f05-2b0a-4a25-9ef1-b54199f1fa02",
            "character": "你好",
            "rating": "easy"
          }
        ]
      }
    ]
  }
  ```
