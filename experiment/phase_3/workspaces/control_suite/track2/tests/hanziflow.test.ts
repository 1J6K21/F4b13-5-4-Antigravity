import { validatePlaybackSpeed, parseCSVRows, scrubPII } from '../server/server';
import { getToneColorClass, detectTone } from '../src/components/PinyinRecallCard';
import * as assert from 'assert';

console.log('==================================================');
console.log('HanziFlow Scientist OS Automated Verification Suite');
console.log('==================================================\n');

let passCount = 0;
let failCount = 0;

function describe(suiteName: string, suiteFn: () => void) {
  console.log(`Suite: ${suiteName}`);
  suiteFn();
  console.log('');
}

function it(testName: string, testFn: () => void) {
  try {
    testFn();
    console.log(`  ✓ PASSED: ${testName}`);
    passCount++;
  } catch (error: any) {
    console.error(`  ✗ FAILED: ${testName}`);
    console.error(`    Error: ${error.message}`);
    if (error.stack) {
      console.error(`    Stack: ${error.stack.split('\n').slice(0, 3).join('\n')}`);
    }
    failCount++;
  }
}

// ----------------------------------------------------------------------------
// Suite 1: Playback Speed Boundaries Parameter Checks
// ----------------------------------------------------------------------------
describe('1. Playback Speed Boundaries Parameter Checks', () => {
  it('should accept valid speeds in range [0.25, 2.0]', () => {
    // Boundary lower limit
    assert.doesNotThrow(() => validatePlaybackSpeed(0.25));
    // Boundary upper limit
    assert.doesNotThrow(() => validatePlaybackSpeed(2.0));
    // Standard normal speed
    assert.doesNotThrow(() => validatePlaybackSpeed(1.0));
    assert.doesNotThrow(() => validatePlaybackSpeed(1.5));
  });

  it('should throw RangeError for speeds strictly below 0.25', () => {
    assert.throws(() => validatePlaybackSpeed(0.24), RangeError);
    assert.throws(() => validatePlaybackSpeed(0.0), RangeError);
    assert.throws(() => validatePlaybackSpeed(-0.5), RangeError);
  });

  it('should throw RangeError for speeds strictly above 2.0', () => {
    assert.throws(() => validatePlaybackSpeed(2.01), RangeError);
    assert.throws(() => validatePlaybackSpeed(2.5), RangeError);
    assert.throws(() => validatePlaybackSpeed(10.0), RangeError);
  });

  it('should throw Error for NaN speeds', () => {
    assert.throws(() => validatePlaybackSpeed(NaN), Error);
  });
});

// ----------------------------------------------------------------------------
// Suite 2: CSV Parsing Logic Correctness & Edge Cases
// ----------------------------------------------------------------------------
describe('2. CSV Parsing Logic Correctness & Edge Cases', () => {
  it('should correctly parse standard formatted CSV rows', () => {
    const csvData = `character,pinyin,definition\n苹果,píngguǒ,apple\n菜单,càidān,menu`;
    const parsed = parseCSVRows(csvData);
    
    assert.strictEqual(parsed.length, 3);
    assert.deepStrictEqual(parsed[0], ['character', 'pinyin', 'definition']);
    assert.deepStrictEqual(parsed[1], ['苹果', 'píngguǒ', 'apple']);
    assert.deepStrictEqual(parsed[2], ['菜单', 'càidān', 'menu']);
  });

  it('should handle quoted commas in definition columns', () => {
    const csvData = `character,pinyin,definition\n苹果,píngguǒ,"apple, a red fruit"`;
    const parsed = parseCSVRows(csvData);
    
    assert.strictEqual(parsed.length, 2);
    assert.deepStrictEqual(parsed[1], ['苹果', 'píngguǒ', 'apple, a red fruit']);
  });

  it('should handle escaped quotes inside quotes', () => {
    const csvData = `character,pinyin,definition\n苹果,píngguǒ,"""apple"""`;
    const parsed = parseCSVRows(csvData);
    
    assert.strictEqual(parsed.length, 2);
    assert.deepStrictEqual(parsed[1], ['苹果', 'píngguǒ', '"apple"']);
  });

  it('should handle empty csv strings by returning empty array', () => {
    const parsed = parseCSVRows('');
    assert.strictEqual(parsed.length, 0);
  });

  it('should parse files with Windows CRLF line endings', () => {
    const csvData = `character,pinyin,definition\r\n苹果,píngguǒ,apple\r\n`;
    const parsed = parseCSVRows(csvData);
    
    assert.strictEqual(parsed.length, 2);
    assert.deepStrictEqual(parsed[0], ['character', 'pinyin', 'definition']);
    assert.deepStrictEqual(parsed[1], ['苹果', 'píngguǒ', 'apple']);
  });
});

// ----------------------------------------------------------------------------
// Suite 3: PII Filtering Correctness & Masking/Scrubbing Assertions
// ----------------------------------------------------------------------------
describe('3. PII Filtering (Emails, Phone Numbers, and Names)', () => {
  it('should mask email addresses and populate replacement map', () => {
    const text = 'Contact john.doe@example.com for info.';
    const result = scrubPII(text);
    
    assert.ok(result.scrubbedText.includes('[REDACTED_EMAIL_0]'));
    assert.ok(!result.scrubbedText.includes('john.doe@example.com'));
    assert.strictEqual(result.replacementMap['[REDACTED_EMAIL_0]'], 'john.doe@example.com');
  });

  it('should mask phone numbers of various formats', () => {
    const text1 = 'Call +1 (555) 019-2834 or 123-456-7890.';
    const result = scrubPII(text1);
    
    assert.ok(result.scrubbedText.includes('[REDACTED_PHONE_0]'));
    assert.ok(result.scrubbedText.includes('[REDACTED_PHONE_1]'));
    assert.ok(!result.scrubbedText.includes('123-456-7890'));
  });

  it('should mask western names defined in the common list case-insensitively', () => {
    const text = 'My name is John and my colleague is JANE.';
    const result = scrubPII(text);
    
    assert.ok(result.scrubbedText.includes('[REDACTED_NAME_0]'));
    assert.ok(result.scrubbedText.includes('[REDACTED_NAME_1]'));
    assert.ok(!result.scrubbedText.includes('John'));
    assert.ok(!result.scrubbedText.includes('JANE'));
    assert.strictEqual(result.replacementMap['[REDACTED_NAME_0]'], 'John');
    assert.strictEqual(result.replacementMap['[REDACTED_NAME_1]'], 'JANE');
  });

  it('should handle mixed PII input scrubbing cleanly in a single payload', () => {
    const text = 'John (john@google.com) is available at 202-555-0143.';
    const result = scrubPII(text);
    
    assert.ok(result.scrubbedText.includes('[REDACTED_NAME_0]'));
    assert.ok(result.scrubbedText.includes('[REDACTED_EMAIL_0]'));
    assert.ok(result.scrubbedText.includes('[REDACTED_PHONE_0]'));
    assert.ok(!result.scrubbedText.includes('John'));
    assert.ok(!result.scrubbedText.includes('john@google.com'));
    assert.ok(!result.scrubbedText.includes('202-555-0143'));
  });
});

// ----------------------------------------------------------------------------
// Suite 4: Card Tone Color Mapping Correctness
// ----------------------------------------------------------------------------
describe('4. Card Tone Color Mapping Correctness', () => {
  it('should detect tones from pinyin diacritics correctly', () => {
    assert.strictEqual(detectTone('mā'), 1); // 1st Flat
    assert.strictEqual(detectTone('má'), 2); // 2nd Rising
    assert.strictEqual(detectTone('mǎ'), 3); // 3rd Dipping
    assert.strictEqual(detectTone('mà'), 4); // 4th Falling
    assert.strictEqual(detectTone('ma'), 5); // 5th Neutral
  });

  it('should map tones to correct visual CSS color classes', () => {
    assert.strictEqual(getToneColorClass(1), 'text-rose-500');      // Red
    assert.strictEqual(getToneColorClass(2), 'text-emerald-500');   // Green
    assert.strictEqual(getToneColorClass(3), 'text-sky-500');       // Blue
    assert.strictEqual(getToneColorClass(4), 'text-purple-500');    // Purple
    assert.strictEqual(getToneColorClass(5), 'text-slate-400');     // Gray
    assert.strictEqual(getToneColorClass(99), 'text-slate-400');    // Default fallback
  });
});

console.log('--------------------------------------------------');
console.log(`Execution Complete. Passed: ${passCount}, Failed: ${failCount}`);
console.log('--------------------------------------------------');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
