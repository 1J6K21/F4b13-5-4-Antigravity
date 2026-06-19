# HanziFlow - API Contracts

This document outlines the API endpoints, request schemas, validation rules, and response payloads for the HanziFlow Express backend.

---

## 1. Import Vocabulary
* **Endpoint**: `POST /api/vocab/import`
* **Content-Type**: `application/json`
* **Description**: Ingests a raw CSV string containing vocabulary words.

### Request Body
```json
{
  "csvText": "character,pinyin,definition\n你好,nǐ hǎo,hello\n谢谢,xièxie,thank you"
}
```

### Validation Rules
* `csvText`: Required. Must be a non-empty string.
* CSV Header: Must contain `character`, `pinyin`, and `definition` columns.
* Rows: Each data row must have all 3 values populated.

### Responses
#### Success (`201 Created`)
```json
{
  "success": true,
  "message": "Successfully imported 2 vocabulary items",
  "importedCount": 2,
  "data": [
    { "id": 1, "character": "你好", "pinyin": "nǐ hǎo", "definition": "hello" },
    { "id": 2, "character": "谢谢", "pinyin": "xièxie", "definition": "thank you" }
  ]
}
```

#### Client Error (`400 Bad Request`)
```json
{
  "success": false,
  "error": "Invalid CSV format: missing header column 'character'"
}
```

---

## 2. Get Audio Retrieval (with speed constraints)
* **Endpoint**: `GET /api/audio`
* **Query Parameters**:
  * `text` (string): The Chinese character string to pronounce.
  * `speed` (number/string): Speed coefficient for audio playback.

### Validation Rules
* `text`: Required, non-empty.
* `speed`: Required. Must be a number between **0.25** and **2.0** inclusive. If outside this range, returns a validation error.

### Responses
#### Success (`200 OK`)
```json
{
  "success": true,
  "text": "你好",
  "speed": 1.5,
  "audioUrl": "https://api.hanziflow.example.com/tts?text=%E4%BD%A0%E5%A5%BD&speed=1.5",
  "message": "Ready for Web Speech API fallback or server-side synth configuration"
}
```

#### Client Error (`400 Bad Request`)
```json
{
  "success": false,
  "error": "Speed out of range: must be between 0.25 and 2.0"
}
```

---

## 3. Create Journal Entry (with PII scrubbing)
* **Endpoint**: `POST /api/journal`
* **Content-Type**: `application/json`
* **Description**: Records a user's practice journal entry, automatically scanning and scrubbing personally identifiable information (PII) like phone numbers, emails, and credit cards before saving.

### Request Body
```json
{
  "content": "Today I met my friend at 123-456-7890. I practiced using the word 你好.",
  "rating": 4,
  "vocabIds": [1]
}
```

### Validation Rules
* `content`: Required, non-empty string.
* `rating`: Required. Integer between **1** and **5** inclusive.
* `vocabIds`: Array of integers (references to vocabulary used).

### Responses
#### Success (`201 Created`)
```json
{
  "success": true,
  "journal": {
    "id": 15,
    "originalContent": "Today I met my friend at 123-456-7890. I practiced using the word 你好.",
    "scrubbedContent": "Today I met my friend at [REDACTED_PHONE]. I practiced using the word 你好.",
    "rating": 4,
    "vocabIds": [1],
    "created_at": "2026-06-19T04:50:00Z"
  }
}
```

#### Client Error (`400 Bad Request`)
```json
{
  "success": false,
  "error": "Rating must be an integer between 1 and 5"
}
```
