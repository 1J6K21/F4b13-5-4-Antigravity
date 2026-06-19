# Codebase Robustness Review and Input-Validation Audit Report

**Date:** June 18, 2026  
**Auditor:** Systems Engineer OS  
**Target File:** `server/server.ts`  
**Workspace:** `/Users/jonathankalsky/Developer/F4b13-5-4-Antigravity/experiment/phase_3/workspaces/coherent_debug/`

---

## Executive Summary

A comprehensive security, robustness, and input-validation audit was performed on the server-side files within the workspace, focusing primarily on `server/server.ts`. 

The audit revealed several severe vulnerabilities and architectural concerns, including **commented-out input validation**, **PII leakage through disabled scrubbing**, **raw SQL query injection points**, **insecure and missing authentication headers**, and **fragile file upload validation**. Collectively, these issues expose the system to arbitrary code execution, denial of service (DoS), information disclosure, and compilation-level failures.

This report documents the detailed findings grouped by the five specified audit criteria and provides the exact coding fixes required to restore the application's integrity, maintainability, and security.

---

## Detailed Audit Findings

### 1. Commented-Out Validation Logic & Missing Input Ranges

#### Vulnerable Code Snippet
In `server/server.ts` (lines 324-325) within the `GET /api/v1/audio/retrieve` handler:
```typescript
323:     // VULNERABLE: Playback speed slider check is disabled
324:     // validatePlaybackSpeed(speed);
325:     console.log("Audio Synthesis requested speed parameter: " + speed);
```

#### Robustness & Maintainability Impact
* **Denial of Service (DoS) and Resource Exhaustion:** The backend attempts to generate audio synthesis. Passing extreme speed rates (e.g., `-100`, `1000000`, or `NaN`) can lead to crashes, infinite loops, or buffer allocation errors in downstream TTS engines.
* **Cache Pollution:** Cache directives (lines 381-382) rely on the speed parameter. Allowing invalid values to bypass validation enables attackers to flood the cache with garbage parameters, rendering caching useless.
* **Business Logic Bypass:** The validation bounds check ([0.25, 2.0] inclusive) defined in `validatePlaybackSpeed` is completely bypassed. Although there is a subsequent Premium Tier check (line 342), bypassing the core range constraint is dangerous.

#### Recommended Coding Fix
Uncomment the call to `validatePlaybackSpeed` to enforce parameter boundaries prior to further processing.
```typescript
try {
  // Enforce boundary checks (0.25 to 2.00 inclusive)
  validatePlaybackSpeed(speed);
  console.log("Audio Synthesis requested speed parameter: " + speed);
} catch (err: any) {
  // Error handling continues to send structured 400 Bad Request
```

---

### 2. Missing PII Filtering & Commented-Out Data-Cleaning Calls

#### Vulnerable Code Snippet
In `server/server.ts` (lines 408-411) within the `POST /api/v1/journals` handler:
```typescript
407:     // 1. PII Scrubbing
408:     // VULNERABLE: Bypassing PII scrubbing, logging and saving raw user input
409:     // const { scrubbedText, replacementMap } = scrubPII(content);
410:     const scrubbedText = content;
411:     const replacementMap = {};
412:     console.log("Processing raw student journal payload: " + content);
```

#### Robustness & Maintainability Impact
* **Information Disclosure & Privacy Non-Compliance:** Disabling PII scrubbing means phone numbers, email addresses, and real names are written to server console logs in plaintext and sent raw to third-party LLMs or translation backends. This violates standard data protection regulations (such as GDPR, HIPAA, or CCPA).
* **TypeScript Compilation Failure:** Because `replacementMap` is defined inline as an empty object literal `{}`, TypeScript infers its type as `{}` (an object with no index signature). This causes a compilation error at line 454:
  ```typescript
  Object.entries(replacementMap).forEach(([token, originalValue]) => {
    rehydratedCorrected = rehydratedCorrected.replace(token, originalValue);
  });
  ```
  The compiler throws `TS2769: No overload matches this call` because `originalValue` is of type `unknown`/`any` and cannot be safely passed to `replace()`.
* **Broken Application State:** Since `replacementMap` is empty, no PII rehydration occurs, breaking the round-trip anonymization logic.

#### Recommended Coding Fix
1. Uncomment the PII scrubbing call.
2. Sanitize console logs to print only the redacted text rather than the raw plaintext payload.
```typescript
// 1. PII Scrubbing
const { scrubbedText, replacementMap } = scrubPII(content);

// Log the redacted text to prevent PII leakage to system log files
console.log("Processing scrubbed student journal payload: " + scrubbedText);
```

---

### 3. Raw String Database Queries (SQL Injection Vectors)

#### Vulnerable Code Snippet
In `server/server.ts` (lines 280-281) within the `POST /api/v1/vocabulary-lists/import` handler:
```typescript
278:     // VULNERABLE: Direct string interpolation into raw SQL query (simulated SQL injection)
279:     const listId = crypto.randomUUID();
280:     const sqlQuery = "INSERT INTO vocabulary_lists (id, title, count) VALUES ('" + listId + "', '" + title + "', " + dataRows.length + ");";
281:     console.log("Database Executing: " + sqlQuery);
```

#### Robustness & Maintainability Impact
* **SQL Injection (SQLi):** The list `title` is taken directly from the request body (`req.body.title`) without sanitization. An attacker can craft a payload like `', 0); DROP TABLE vocabulary_lists; --` to compromise the database.
* **Fragile SQL Execution:** If a user uploads a valid file where the title contains a single quote (e.g. `Mary's Vocab List`), the SQL execution will crash due to unbalanced single quotes, leading to a poor user experience.

#### Recommended Coding Fix
Use parameterized SQL queries (prepared statements) to isolate structural SQL commands from the user input.
```typescript
const listId = crypto.randomUUID();
// Recommended Parameterized execution:
const sqlQuery = "INSERT INTO vocabulary_lists (id, title, count) VALUES ($1, $2, $3);";
const sqlValues = [listId, title, dataRows.length];
console.log("Database Executing: " + sqlQuery + " with values: " + JSON.stringify(sqlValues));
// dbClient.query(sqlQuery, sqlValues);
```

---

### 4. Bypassed & Insecure Request Authentication

#### Vulnerable Code Snippet
In `server/server.ts` (lines 148-155) and the lack of auth verification in endpoint routes:
```typescript
147: // Helper to determine user tier from token
148: function getUserTier(authHeader: string | undefined): 'FREE' | 'PREMIUM' {
149:   if (!authHeader) return 'FREE';
150:   const token = authHeader.replace('Bearer ', '').trim();
151:   if (token.toLowerCase().includes('premium') || token === 'premium-token') {
152:     return 'PREMIUM';
153:   }
154:   return 'FREE';
155: }
```
And in `POST /api/v1/journals` (lines 392-493), there is no authentication check performed whatsoever.

#### Robustness & Maintainability Impact
* **Privilege Escalation & Spoofing:** The `getUserTier` function merely performs string pattern matching on the Authorization header. Any client can request Premium features by setting the header to `Bearer premium` or `Bearer premium-token` without providing cryptographic proof of identity.
* **No Authentication Guard on Journal Submission:** The journal submission route accepts submissions from anyone. This allows unauthenticated users to generate AI corrections, ballooning server API usage and costs.
* **Lack of Context Matching:** Since there is no user extraction, journal entries cannot be linked to the correct database `user_id`, violating row-level context security policies.

#### Recommended Coding Fix
1. Set up a secure authentication middleware using a library like `jsonwebtoken` to verify the JWT signatures.
2. Refactor `getUserTier` to parse user context from a verified JWT token.
3. Apply the authentication middleware to secure the routes.
```typescript
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId: string;
  tier: 'FREE' | 'PREMIUM';
}

// Verification Middleware
export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ success: false, error: 'Unauthorized. Token missing.' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err: any, user: any) => {
    if (err) return res.status(403).json({ success: false, error: 'Forbidden. Invalid token.' });
    req.user = user as UserPayload;
    next();
  });
}
```

---

### 5. Incomplete Error Handling & Missing File Type Validation

#### Vulnerable Code Snippet
In `server/server.ts` (lines 8-11) and `POST /api/v1/vocabulary-lists/import`:
```typescript
8: // Configure Multer for in-memory CSV file upload (limit to 2MB)
9: const upload = multer({
10:   limits: { fileSize: 2 * 1024 * 1024 }
11: });
```

#### Robustness & Maintainability Impact
* **Lack of MIME Type Verification:** Multer accepts any file type (including `.exe`, `.sh`, `.png`, or large binary payloads). The server attempts to parse these binary files as string arrays inside `parseCSVRows`, causing high CPU utilization or garbage characters in memory.
* **Information Leakage via Unhandled Exceptions:** If the uploaded file exceeds the 2MB limit, Multer throws a `LIMIT_FILE_SIZE` error. Because the route handler has no custom error handler wrapping the multer middleware, Express throws a raw stack trace or generic error page rather than the `413 Payload Too Large` JSON response required by the API contract.

#### Recommended Coding Fix
1. Configure Multer with a `fileFilter` to reject non-CSV file uploads.
2. Wrap the upload middleware in a custom function to catch Multer errors and return a structured JSON response.
```typescript
const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isCsv = file.mimetype === 'text/csv' || file.originalname.endsWith('.csv');
    if (isCsv) {
      cb(null, true);
    } else {
      cb(new Error('INVALID_FILE_TYPE'));
    }
  }
});

// Wrapper middleware to intercept Multer errors cleanly
export function handleImportUpload(req: Request, res: Response, next: any) {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          error: { code: 'PAYLOAD_TOO_LARGE', message: 'The uploaded CSV file exceeds the maximum allowed size of 2MB.' }
        });
      }
      if (err.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_FILE_TYPE', message: 'Only standard CSV files are permitted.' }
        });
      }
      return res.status(400).json({ success: false, error: { code: 'UPLOAD_ERROR', message: err.message } });
    }
    next();
  });
}
```

---

## Vulnerabilities Summary Matrix

| Category | Severity | Location | Vulnerability Description | Mitigation |
| :--- | :--- | :--- | :--- | :--- |
| **Input Validation** | High | `server.ts:324` | Commented-out range check allows invalid or extreme speed parameter inputs to the API. | Uncomment and enforce `validatePlaybackSpeed(speed)`. |
| **PII & Logging** | High | `server.ts:409-411` | Bypassed PII scrubbing allows emails, phone numbers, and names to leak to logs and downstream services. In addition, an empty replacement map causes TypeScript compile errors. | Uncomment `scrubPII` call and resolve type mappings. |
| **SQL Injection** | Critical | `server.ts:280` | Directly interpolating user-provided list titles into SQL query structures exposes the app to database hijacking. | Use parameterized SQL queries. |
| **Authentication** | High | `server.ts:148-155` | Insecure string parsing is used to determine user tiers and no auth checks exist on journal routes. | Implement cryptographically verified JWT middleware. |
| **File Handling** | Medium | `server.ts:9-11` | Missing file type verification and no custom Multer error handling wrapper causes leak of server stack traces. | Add file filter and custom wrapper to catch `LIMIT_FILE_SIZE` errors. |
