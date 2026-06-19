process.env.PORT = '3005';
import app, { validatePlaybackSpeed, parseCSVRows, scrubPII } from '../server/server';
import { getToneColorClass, detectTone } from '../src/components/PinyinRecallCard';
import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

let testLog = '';
function log(msg: string) {
  testLog += msg + '\n';
  console.log(msg);
}

function logError(msg: string, err?: any) {
  testLog += msg + '\n';
  console.error(msg);
  if (err) {
    testLog += (err.stack || err.message) + '\n';
    console.error(err);
  }
}

log('==================================================');
log('HanziFlow Scientist OS Automated Verification Suite');
log('==================================================\n');

let passCount = 0;
let failCount = 0;

async function describe(suiteName: string, suiteFn: () => Promise<void> | void) {
  log(`Suite: ${suiteName}`);
  try {
    await suiteFn();
  } catch (error: any) {
    logError(`  Suite Setup/Execution Failure: ${error.message}`, error);
  }
  log('');
}

async function it(testName: string, testFn: () => Promise<void> | void) {
  try {
    await testFn();
    log(`  ✓ PASSED: ${testName}`);
    passCount++;
  } catch (error: any) {
    logError(`  ✗ FAILED: ${testName}`);
    logError(`    Error: ${error.message}`);
    if (error.stack) {
      logError(`    Stack: ${error.stack.split('\n').slice(0, 3).join('\n')}`);
    }
    failCount++;
  }
}

// Global logger spy helper
let capturedLogs: string[] = [];
const originalConsoleLog = console.log;
function startCapturingLogs() {
  capturedLogs = [];
  console.log = (...args: any[]) => {
    const formatted = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    capturedLogs.push(formatted);
    originalConsoleLog(...args);
  };
}
function stopCapturingLogs(): string[] {
  console.log = originalConsoleLog;
  return capturedLogs;
}

async function runAllTests() {
  // Wait a short moment for the express server to bind and start listening
  await new Promise(resolve => setTimeout(resolve, 500));

  // ----------------------------------------------------------------------------
  // Suite 1: Playback Speed Boundaries Parameter Checks
  // ----------------------------------------------------------------------------
  await describe('1. Playback Speed Boundaries Parameter Checks', async () => {
    await it('should accept valid speeds in range [0.25, 2.0]', () => {
      assert.doesNotThrow(() => validatePlaybackSpeed(0.25));
      assert.doesNotThrow(() => validatePlaybackSpeed(2.0));
      assert.doesNotThrow(() => validatePlaybackSpeed(1.0));
      assert.doesNotThrow(() => validatePlaybackSpeed(1.5));
    });

    await it('should throw RangeError for speeds strictly below 0.25', () => {
      assert.throws(() => validatePlaybackSpeed(0.24), RangeError);
      assert.throws(() => validatePlaybackSpeed(0.0), RangeError);
      assert.throws(() => validatePlaybackSpeed(-0.5), RangeError);
    });

    await it('should throw RangeError for speeds strictly above 2.0', () => {
      assert.throws(() => validatePlaybackSpeed(2.01), RangeError);
      assert.throws(() => validatePlaybackSpeed(2.5), RangeError);
      assert.throws(() => validatePlaybackSpeed(10.0), RangeError);
    });

    await it('should throw Error for NaN speeds', () => {
      assert.throws(() => validatePlaybackSpeed(NaN), Error);
    });

    // HTTP Endpoint Integration Tests
    await it('HTTP GET /api/v1/audio/retrieve - valid normal speed (free)', async () => {
      const res = await fetch('http://localhost:3005/api/v1/audio/retrieve?speed=1.0');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.headers.get('content-type'), 'audio/wav');
      assert.strictEqual(res.headers.get('x-audio-speed'), '1.00');
      assert.ok(res.headers.get('cache-control')?.includes('public'));
    });

    await it('HTTP GET /api/v1/audio/retrieve - custom speed (premium check)', async () => {
      const res = await fetch('http://localhost:3005/api/v1/audio/retrieve?speed=1.5', {
        headers: { Authorization: 'Bearer premium-token' }
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.headers.get('x-audio-speed'), '1.50');
      assert.strictEqual(res.headers.get('cache-control'), 'no-cache');
    });

    await it('HTTP GET /api/v1/audio/retrieve - custom speed fails on free tier', async () => {
      const res = await fetch('http://localhost:3005/api/v1/audio/retrieve?speed=1.5');
      assert.strictEqual(res.status, 403);
      const data: any = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.error.code, 'PREMIUM_ONLY');
    });

    await it('HTTP GET /api/v1/audio/retrieve - speed out of bounds (< 0.25)', async () => {
      const res = await fetch('http://localhost:3005/api/v1/audio/retrieve?speed=0.1');
      assert.strictEqual(res.status, 400);
      const data: any = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.error.code, 'OUT_OF_BOUNDS');
    });

    await it('HTTP GET /api/v1/audio/retrieve - speed out of bounds (> 2.0)', async () => {
      const res = await fetch('http://localhost:3005/api/v1/audio/retrieve?speed=2.5');
      assert.strictEqual(res.status, 400);
      const data: any = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.error.code, 'OUT_OF_BOUNDS');
    });

    await it('HTTP GET /api/v1/audio/retrieve - non-numeric speed', async () => {
      const res = await fetch('http://localhost:3005/api/v1/audio/retrieve?speed=fast');
      assert.strictEqual(res.status, 400);
      const data: any = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.error.code, 'INVALID_SPEED');
    });
  });

  // ----------------------------------------------------------------------------
  // Suite 2: CSV Parsing & File Upload Validation
  // ----------------------------------------------------------------------------
  await describe('2. CSV Parsing & File Upload Validation', async () => {
    await it('should correctly parse standard formatted CSV rows', () => {
      const csvData = `character,pinyin,definition\n苹果,píngguǒ,apple\n菜单,càidān,menu`;
      const parsed = parseCSVRows(csvData);
      assert.strictEqual(parsed.length, 3);
      assert.deepStrictEqual(parsed[0], ['character', 'pinyin', 'definition']);
      assert.deepStrictEqual(parsed[1], ['苹果', 'píngguǒ', 'apple']);
      assert.deepStrictEqual(parsed[2], ['菜单', 'càidān', 'menu']);
    });

    await it('should handle quoted commas in definition columns', () => {
      const csvData = `character,pinyin,definition\n苹果,píngguǒ,"apple, a red fruit"`;
      const parsed = parseCSVRows(csvData);
      assert.strictEqual(parsed.length, 2);
      assert.deepStrictEqual(parsed[1], ['苹果', 'píngguǒ', 'apple, a red fruit']);
    });

    await it('should handle escaped quotes inside quotes', () => {
      const csvData = `character,pinyin,definition\n苹果,píngguǒ,"""apple"""`;
      const parsed = parseCSVRows(csvData);
      assert.strictEqual(parsed.length, 2);
      assert.deepStrictEqual(parsed[1], ['苹果', 'píngguǒ', '"apple"']);
    });

    await it('should handle empty csv strings by returning empty array', () => {
      const parsed = parseCSVRows('');
      assert.strictEqual(parsed.length, 0);
    });

    await it('should parse files with Windows CRLF line endings', () => {
      const csvData = `character,pinyin,definition\r\n苹果,píngguǒ,apple\r\n`;
      const parsed = parseCSVRows(csvData);
      assert.strictEqual(parsed.length, 2);
      assert.deepStrictEqual(parsed[0], ['character', 'pinyin', 'definition']);
      assert.deepStrictEqual(parsed[1], ['苹果', 'píngguǒ', 'apple']);
    });

    // HTTP Endpoint Integration Tests for File Upload
    await it('HTTP POST /api/v1/vocabulary-lists/import - valid CSV upload', async () => {
      const formData = new FormData();
      const csvContent = 'character,pinyin,definition\n苹果,píngguǒ,apple\n菜单,càidān,menu';
      const file = new Blob([csvContent], { type: 'text/csv' });
      formData.append('file', file, 'import.csv');
      formData.append('title', 'My Import List');

      const res = await fetch('http://localhost:3005/api/v1/vocabulary-lists/import', {
        method: 'POST',
        headers: { Authorization: 'Bearer free-token' },
        body: formData
      });
      assert.strictEqual(res.status, 201);
      const data: any = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.data.list_id);
      assert.strictEqual(data.data.title, 'My Import List');
      assert.strictEqual(data.data.imported_count, 2);
    });

    await it('HTTP POST /api/v1/vocabulary-lists/import - non-CSV file rejected', async () => {
      const formData = new FormData();
      const file = new Blob(['hello world'], { type: 'text/plain' });
      formData.append('file', file, 'test.txt');

      const res = await fetch('http://localhost:3005/api/v1/vocabulary-lists/import', {
        method: 'POST',
        headers: { Authorization: 'Bearer free-token' },
        body: formData
      });
      assert.strictEqual(res.status, 400);
      const data: any = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.error.code, 'INVALID_FILE_TYPE');
      assert.strictEqual(data.error.message, 'Only standard CSV files are permitted.');
    });

    await it('HTTP POST /api/v1/vocabulary-lists/import - file size limit error (Payload Too Large)', async () => {
      const formData = new FormData();
      // Generate a > 2MB buffer to exceed the limit set in multer
      const header = 'character,pinyin,definition\n';
      const row = '苹果,píngguǒ,apple\n';
      const sizeLimitExceededCsv = header + row.repeat(110000); // ~2.2 MB
      const file = new Blob([sizeLimitExceededCsv], { type: 'text/csv' });
      formData.append('file', file, 'large_import.csv');

      const res = await fetch('http://localhost:3005/api/v1/vocabulary-lists/import', {
        method: 'POST',
        headers: { Authorization: 'Bearer free-token' },
        body: formData
      });
      assert.strictEqual(res.status, 413);
      const data: any = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.error.code, 'PAYLOAD_TOO_LARGE');
      assert.strictEqual(data.error.message, 'The uploaded CSV file exceeds the maximum allowed size of 2MB.');
    });

    await it('HTTP POST /api/v1/vocabulary-lists/import - header mismatch error', async () => {
      const formData = new FormData();
      const csvContent = 'char,pinyin,definition\n苹果,píngguǒ,apple';
      const file = new Blob([csvContent], { type: 'text/csv' });
      formData.append('file', file, 'mismatch.csv');

      const res = await fetch('http://localhost:3005/api/v1/vocabulary-lists/import', {
        method: 'POST',
        headers: { Authorization: 'Bearer free-token' },
        body: formData
      });
      assert.strictEqual(res.status, 400);
      const data: any = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.error.code, 'HEADER_MISMATCH');
    });

    await it('HTTP POST /api/v1/vocabulary-lists/import - non-Chinese character validation error', async () => {
      const formData = new FormData();
      const csvContent = 'character,pinyin,definition\napple,píngguǒ,apple';
      const file = new Blob([csvContent], { type: 'text/csv' });
      formData.append('file', file, 'invalid_char.csv');

      const res = await fetch('http://localhost:3005/api/v1/vocabulary-lists/import', {
        method: 'POST',
        headers: { Authorization: 'Bearer free-token' },
        body: formData
      });
      assert.strictEqual(res.status, 400);
      const data: any = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.error.code, 'VALIDATION_FAILED');
      assert.strictEqual(data.error.details[0].column, 'character');
      assert.ok(data.error.details[0].issue.includes('only contain standard Chinese logographs'));
    });

    await it('HTTP POST /api/v1/vocabulary-lists/import - numeric pinyin validation error', async () => {
      const formData = new FormData();
      const csvContent = 'character,pinyin,definition\n苹果,ping2guo3,apple';
      const file = new Blob([csvContent], { type: 'text/csv' });
      formData.append('file', file, 'invalid_pinyin.csv');

      const res = await fetch('http://localhost:3005/api/v1/vocabulary-lists/import', {
        method: 'POST',
        headers: { Authorization: 'Bearer free-token' },
        body: formData
      });
      assert.strictEqual(res.status, 400);
      const data: any = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.error.code, 'VALIDATION_FAILED');
      assert.strictEqual(data.error.details[0].column, 'pinyin');
      assert.ok(data.error.details[0].issue.includes('Only standard diacritics tone markings allowed'));
    });

    await it('HTTP POST /api/v1/vocabulary-lists/import - html definition validation error', async () => {
      const formData = new FormData();
      const csvContent = 'character,pinyin,definition\n苹果,píngguǒ,<script>alert(1)</script>';
      const file = new Blob([csvContent], { type: 'text/csv' });
      formData.append('file', file, 'invalid_def.csv');

      const res = await fetch('http://localhost:3005/api/v1/vocabulary-lists/import', {
        method: 'POST',
        headers: { Authorization: 'Bearer free-token' },
        body: formData
      });
      assert.strictEqual(res.status, 400);
      const data: any = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.error.code, 'VALIDATION_FAILED');
      assert.strictEqual(data.error.details[0].column, 'definition');
      assert.ok(data.error.details[0].issue.includes('contains unsafe HTML/script tags'));
    });

    await it('HTTP POST /api/v1/vocabulary-lists/import - Free tier limit check (max 50 rows)', async () => {
      const formData = new FormData();
      const header = 'character,pinyin,definition\n';
      const row = '苹果,píngguǒ,apple\n';
      const limitExceededCsv = header + row.repeat(51); // 51 rows
      const file = new Blob([limitExceededCsv], { type: 'text/csv' });
      formData.append('file', file, 'limit_exceeded.csv');

      const res = await fetch('http://localhost:3005/api/v1/vocabulary-lists/import', {
        method: 'POST',
        headers: { Authorization: 'Bearer free-token' },
        body: formData
      });
      assert.strictEqual(res.status, 403);
      const data: any = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.error.code, 'TIER_LIMIT_EXCEEDED');
      assert.ok(data.error.message.includes('allows importing a maximum of 50 words'));
    });

    await it('HTTP POST /api/v1/vocabulary-lists/import - Premium tier limit check (allows > 50 rows)', async () => {
      const formData = new FormData();
      const header = 'character,pinyin,definition\n';
      const row = '苹果,píngguǒ,apple\n';
      const allowedCsv = header + row.repeat(51); // 51 rows
      const file = new Blob([allowedCsv], { type: 'text/csv' });
      formData.append('file', file, 'allowed.csv');

      const res = await fetch('http://localhost:3005/api/v1/vocabulary-lists/import', {
        method: 'POST',
        headers: { Authorization: 'Bearer premium-token' },
        body: formData
      });
      assert.strictEqual(res.status, 201);
      const data: any = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.imported_count, 51);
    });
  });

  // ----------------------------------------------------------------------------
  // Suite 3: SQL Injection Parameterized Bindings
  // ----------------------------------------------------------------------------
  await describe('3. SQL Injection Parameterized Bindings', async () => {
    await it('should prevent SQL injection by using parameterized queries', async () => {
      const formData = new FormData();
      const csvContent = 'character,pinyin,definition\n苹果,píngguǒ,apple';
      const file = new Blob([csvContent], { type: 'text/csv' });
      formData.append('file', file, 'sqli.csv');
      
      // SQL Injection payload as title
      const maliciousTitle = "'; DROP TABLE vocabulary_lists; --";
      formData.append('title', maliciousTitle);

      startCapturingLogs();
      const res = await fetch('http://localhost:3005/api/v1/vocabulary-lists/import', {
        method: 'POST',
        headers: { Authorization: 'Bearer free-token' },
        body: formData
      });
      const logs = stopCapturingLogs();

      assert.strictEqual(res.status, 201);
      const data: any = await res.json();
      assert.strictEqual(data.success, true);

      // Verify that the SQL query executed uses parameterized bindings ($1, $2, $3)
      // instead of string concatenation of the user input
      const dbLog = logs.find(l => l.includes('Database Executing:'));
      assert.ok(dbLog, 'Should log the database execution statement');

      // The log should contain the parameterized template
      assert.ok(dbLog.includes('INSERT INTO vocabulary_lists (id, title, count) VALUES ($1, $2, $3);'),
        'SQL query should be parameterized with placeholders rather than raw values');
      
      // The log should show that values are bound separately and include the malicious payload safely
      assert.ok(dbLog.includes(JSON.stringify(maliciousTitle)),
        'The query values list should contain the raw, unmodified malicious title payload securely bound');
    });
  });

  // ----------------------------------------------------------------------------
  // Suite 4: PII Filtering Correctness & Masking/Scrubbing Assertions
  // ----------------------------------------------------------------------------
  await describe('4. PII Filtering (Emails, Phone Numbers, and Names)', async () => {
    await it('should mask email addresses and populate replacement map', () => {
      const text = 'Contact john.doe@example.com for info.';
      const result = scrubPII(text);
      assert.ok(result.scrubbedText.includes('[REDACTED_EMAIL_0]'));
      assert.ok(!result.scrubbedText.includes('john.doe@example.com'));
      assert.strictEqual(result.replacementMap['[REDACTED_EMAIL_0]'], 'john.doe@example.com');
    });

    await it('should mask phone numbers of various formats', () => {
      const text1 = 'Call +1 (555) 019-2834 or 123-456-7890.';
      const result = scrubPII(text1);
      assert.ok(result.scrubbedText.includes('[REDACTED_PHONE_0]'));
      assert.ok(result.scrubbedText.includes('[REDACTED_PHONE_1]'));
      assert.ok(!result.scrubbedText.includes('123-456-7890'));
    });

    await it('should mask western names defined in the common list case-insensitively', () => {
      const text = 'My name is John and my colleague is JANE.';
      const result = scrubPII(text);
      assert.ok(result.scrubbedText.includes('[REDACTED_NAME_0]'));
      assert.ok(result.scrubbedText.includes('[REDACTED_NAME_1]'));
      assert.ok(!result.scrubbedText.includes('John'));
      assert.ok(!result.scrubbedText.includes('JANE'));
      assert.strictEqual(result.replacementMap['[REDACTED_NAME_0]'], 'John');
      assert.strictEqual(result.replacementMap['[REDACTED_NAME_1]'], 'JANE');
    });

    await it('should handle mixed PII input scrubbing cleanly in a single payload', () => {
      const text = 'John (john@google.com) is available at 202-555-0143.';
      const result = scrubPII(text);
      assert.ok(result.scrubbedText.includes('[REDACTED_NAME_0]'));
      assert.ok(result.scrubbedText.includes('[REDACTED_EMAIL_0]'));
      assert.ok(result.scrubbedText.includes('[REDACTED_PHONE_0]'));
      assert.ok(!result.scrubbedText.includes('John'));
      assert.ok(!result.scrubbedText.includes('john@google.com'));
      assert.ok(!result.scrubbedText.includes('202-555-0143'));
    });

    // HTTP Endpoint Integration Tests for Journals and PII scrubbing round-trip
    await it('HTTP POST /api/v1/journals - verify PII scrubbing, logs sanitization, and output rehydration', async () => {
      const journalPayload = {
        content: 'Hi, I am Jane. My email is jane@example.com and phone is +1 (555) 019-2834. 我想看看菜单',
        target_vocab_list_id: 'list-123'
      };

      startCapturingLogs();
      const res = await fetch('http://localhost:3005/api/v1/journals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer free-token'
        },
        body: JSON.stringify(journalPayload)
      });
      const logs = stopCapturingLogs();

      assert.strictEqual(res.status, 201);
      const data: any = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.data.journal_id);

      // Verify that the response sent back to the user is fully REHYDRATED
      const feedbackText = data.data.feedback.corrected_content;
      assert.ok(feedbackText.includes('Jane'), 'Response corrected content must contain original name Jane');
      assert.ok(feedbackText.includes('jane@example.com'), 'Response corrected content must contain original email');
      assert.ok(feedbackText.includes('+1 (555) 019-2834'), 'Response corrected content must contain original phone');
      assert.ok(feedbackText.includes('我想看一下菜单'), 'Grammar correction must be applied correctly');

      // Verify log sanitization (no raw email, phone, or name in the console logs)
      const logLine = logs.find(l => l.includes('Processing scrubbed student journal payload:'));
      assert.ok(logLine, 'Should print scrubbed journal payload log');
      assert.ok(!logLine.includes('Jane'), 'Console logs must NOT leak original name Jane');
      assert.ok(!logLine.includes('jane@example.com'), 'Console logs must NOT leak original email');
      assert.ok(!logLine.includes('+1 (555) 019-2834'), 'Console logs must NOT leak original phone');
      assert.ok(logLine.includes('[REDACTED_NAME_1]'), 'Console logs must contain REDACTED_NAME token');
      assert.ok(logLine.includes('[REDACTED_EMAIL_0]'), 'Console logs must contain REDACTED_EMAIL token');
      assert.ok(logLine.includes('[REDACTED_PHONE_0]'), 'Console logs must contain REDACTED_PHONE token');

      // Verify log sanitization for request receipt
      const requestLog = logs.find(l => l.includes('POST /api/v1/journals request received:'));
      assert.ok(requestLog, 'Should print request receipt log');
      assert.ok(!requestLog.includes('jane@example.com'), 'Request receipt log must NOT contain raw email content');
      assert.ok(requestLog.includes('content_length'), 'Request receipt log should display content_length instead of raw body content');

      // Verify log contains successful encryption messages
      const dbInsertLog = logs.find(l => l.includes('Secure Data Storage Action:'));
      assert.ok(dbInsertLog, 'Should print secure database storage action log');
      assert.ok(dbInsertLog.includes('encrypted_content_payload'), 'Should display encrypted content payload token');
      assert.ok(dbInsertLog.includes('encrypted_corrected_payload'), 'Should display encrypted corrected payload token');
    });
  });

  // ----------------------------------------------------------------------------
  // Suite 5: Card Tone Color Mapping Correctness
  // ----------------------------------------------------------------------------
  await describe('5. Card Tone Color Mapping Correctness', async () => {
    await it('should detect tones from pinyin diacritics correctly', () => {
      assert.strictEqual(detectTone('mā'), 1); // 1st Flat
      assert.strictEqual(detectTone('má'), 2); // 2nd Rising
      assert.strictEqual(detectTone('mǎ'), 3); // 3rd Dipping
      assert.strictEqual(detectTone('mà'), 4); // 4th Falling
      assert.strictEqual(detectTone('ma'), 5); // 5th Neutral
    });

    await it('should map tones to correct visual CSS color classes', () => {
      assert.strictEqual(getToneColorClass(1), 'text-rose-500');      // Red
      assert.strictEqual(getToneColorClass(2), 'text-emerald-500');   // Green
      assert.strictEqual(getToneColorClass(3), 'text-sky-500');       // Blue
      assert.strictEqual(getToneColorClass(4), 'text-purple-500');    // Purple
      assert.strictEqual(getToneColorClass(5), 'text-slate-400');     // Gray
      assert.strictEqual(getToneColorClass(99), 'text-slate-400');    // Default fallback
    });
  });

  log('--------------------------------------------------');
  log(`Execution Complete. Passed: ${passCount}, Failed: ${failCount}`);
  log('--------------------------------------------------');

  // Construct status metadata for writeout
  const status = failCount > 0 ? 'FAILURE' : 'SUCCESS';
  testLog += `Status: ${status}\n`;
  testLog += `Timestamp: ${new Date().toISOString()}\n`;
  testLog += `Environment: Node.js/TypeScript CommonJS Cwd=${process.cwd()}\n`;
  testLog += `Command: npx ts-node tests/hanziflow.test.ts\n`;

  // Write results to file
  const resultsPath = path.join(__dirname, 'debug_test_results.log');
  fs.writeFileSync(resultsPath, testLog, 'utf8');

  console.log(`\nTest logs written successfully to ${resultsPath}\n`);

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests().catch(err => {
  logError('Unhandled error running test suite', err);
  process.exit(1);
});
