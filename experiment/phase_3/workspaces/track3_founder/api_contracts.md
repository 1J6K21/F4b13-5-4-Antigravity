# HanziFlow - API Contracts Document

This document defines the HTTP API routes, validation rules, request bodies, and expected responses for the HanziFlow application.

---

## 1. Import Vocabulary
Imports a list of Chinese vocabulary via CSV file upload or direct text post.

*   **Route:** `/api/vocab/import`
*   **Method:** `POST`
*   **Content-Type:** `application/json` (or `multipart/form-data` if parsing uploaded files; for the MVP we support posting JSON objects or a CSV string directly for simplicity).
*   **Payload Schema (JSON):**
    ```json
    {
      "csvData": "characters,pinyin,english\n你好,nǐ hǎo,hello\n谢谢,xièxie,thank you"
    }
    ```
*   **Validation Rules:**
    *   `csvData` must be a non-empty string.
    *   CSV must contain a header row with columns mapping to `characters` (or `hanzi`), `pinyin`, and `english`.
*   **Responses:**
    *   **200 OK**: Successfully parsed and saved.
        ```json
        {
          "success": true,
          "importedCount": 2,
          "items": [
            { "id": "1", "characters": "你好", "pinyin": "nǐ hǎo", "english": "hello" },
            { "id": "2", "characters": "谢谢", "pinyin": "xièxie", "english": "thank you" }
          ]
        }
        ```
    *   **400 Bad Request**: CSV data format incorrect or missing headers.
        ```json
        {
          "success": false,
          "error": "CSV must contain headers: characters, pinyin, english"
        }
        ```

---

## 2. Audio Retrieval (Text-to-Speech)
Retrieves or streams synthetic audio pronunciation of a vocabulary character or phrase.

*   **Route:** `/api/audio/tts`
*   **Method:** `GET`
*   **Query Parameters:**
    *   `text` (string): The Chinese character/phrase to pronounce (Required).
    *   `speed` (number): Playback speed multiplier (Optional, Default: `1.0`).
*   **Validation Rules:**
    *   `text` must be a non-empty string (max 100 characters).
    *   `speed` must be a number between `0.5` and `2.0` (inclusive).
*   **Responses:**
    *   **200 OK**: Returns an audio stream or JSON redirect to synthesized audio. For browser compatibility and ease of MVP deployment, this returns binary audio stream (e.g., MP3/WAV) or a success JSON payload containing the audio config/status.
        ```json
        {
          "success": true,
          "text": "你好",
          "speed": 1.2
        }
        ```
    *   **400 Bad Request**: Invalid speed range or missing text.
        ```json
        {
          "success": false,
          "error": "Speed must be a number between 0.5 and 2.0"
        }
        ```

---

## 3. Journal Review
Submits a daily journal entry, identifies matching vocabulary words, scrubs PII, and returns recall feedback.

*   **Route:** `/api/journal/review`
*   **Method:** `POST`
*   **Content-Type:** `application/json`
*   **Payload Schema:**
    ```json
    {
      "content": "Today I met my friend at test@example.com and said 你好!"
    }
    ```
*   **Validation Rules:**
    *   `content` must be a non-empty string.
*   **PII Scrubbing Rules:**
    *   Any email addresses (`name@domain.com`) must be replaced with `[EMAIL]`.
    *   Any phone numbers (e.g., `+1-234-567-8900`, `123-456-7890`) must be replaced with `[PHONE]`.
*   **Vocabulary Recognition:**
    *   Scans the journal content for any characters present in the `vocabulary` table.
*   **Responses:**
    *   **200 OK**: Returns review results.
        ```json
        {
          "success": true,
          "originalContent": "Today I met my friend at test@example.com and said 你好!",
          "scrubbedContent": "Today I met my friend at [EMAIL] and said 你好!",
          "wordsIdentified": [
            { "characters": "你好", "pinyin": "nǐ hǎo", "english": "hello" }
          ]
        }
        ```
    *   **400 Bad Request**: Missing journal content.
        ```json
        {
          "success": false,
          "error": "Journal content cannot be empty"
        }
        ```
