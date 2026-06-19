# HanziFlow - API Contracts

This document specifies the REST API contracts between the frontend and the Express backend, including input parameters, response structures, and validation rules.

---

## 1. Import Vocabulary (CSV)
Uploads and parses a CSV list of characters, Pinyin, and English translations.

* **Endpoint**: `POST /api/vocab/import`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "csvText": "character,pinyin,english\n学习,xuéxí,to study\n你好,nǐhǎo,hello"
  }
  ```
* **Validation Rules**:
  - `csvText` must be a non-empty string.
  - Rows must have exactly three fields: character, pinyin, and english.
  - Pinyin field must not contain raw special characters other than valid pinyin letters and standard accents or numbers.
* **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "importedCount": 2,
    "items": [
      {
        "id": "e8e19e07-fcf8-4d51-a968-3e5f22f77c38",
        "character": "学习",
        "pinyin": "xuéxí",
        "english": "to study"
      },
      {
        "id": "f8a09b43-9876-4a11-b0e9-ff9e58ab12e1",
        "character": "你好",
        "pinyin": "nǐhǎo",
        "english": "hello"
      }
    ],
    "statistics": {
      "totalLinesParsed": 3,
      "validRecords": 2,
      "invalidRecords": 0
    }
  }
  ```
* **Error Response** (`400 Bad Request`):
  ```json
  {
    "success": false,
    "error": "Invalid CSV format or empty data",
    "details": ["Row 2 does not have exactly 3 columns"]
  }
  ```

---

## 2. Audio Playback Parameters (TTS Retrieval)
Validates query parameters and generates audio stream configuration or synthetic triggers.

* **Endpoint**: `GET /api/audio/speech`
* **Query Parameters**:
  - `text` (string, required): The Chinese characters to pronounce.
  - `speed` (number, optional, default: `1.0`): Speech playback rate.
* **Validation Rules**:
  - `text` must be a non-empty string, length $\le 100$ characters.
  - `speed` must satisfy the constraint: $0.5 \le \text{speed} \le 2.0$.
* **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "text": "学习",
    "speed": 1.2,
    "lang": "zh-CN",
    "action": "synthesize",
    "timestamp": 1781827200000
  }
  ```
* **Error Response** (`400 Bad Request`):
  ```json
  {
    "success": false,
    "error": "Parameter validation failed",
    "details": [
      "speed must be a float between 0.5 and 2.0. Received: 3.5"
    ]
  }
  ```

---

## 3. Submit Journal & Evaluate Recall
Submits a raw text journal entry, scrubs PII (names, emails, phones), detects vocab, and scores accuracy.

* **Endpoint**: `POST /api/journal/review`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "content": "Yesterday, John Doe sent an email to john.doe@example.com. Today I will study Chinese, starting with 学习 (xuéxí).",
    "targetVocab": [
      {
        "character": "学习",
        "pinyin": "xuéxí"
      }
    ]
  }
  ```
* **Validation Rules**:
  - `content` must be a non-empty string.
  - `targetVocab` must be an array of vocabulary objects containing `character` and `pinyin`.
* **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "scrubbedContent": "Yesterday, [REDACTED_NAME] sent an email to [REDACTED_EMAIL]. Today I will study Chinese, starting with 学习 (xuéxí).",
    "evaluation": [
      {
        "character": "学习",
        "expectedPinyin": "xuéxí",
        "detectedPinyin": "xuéxí",
        "toneScore": 100.0,
        "isCorrect": true
      }
    ],
    "metrics": {
      "totalWordsScrubbed": 2,
      "recallRate": 100.0
    }
  }
  ```
* **Error Response** (`422 Unprocessable Entity`):
  ```json
  {
    "success": false,
    "error": "Unable to process content or target vocabulary missing"
  }
  ```
