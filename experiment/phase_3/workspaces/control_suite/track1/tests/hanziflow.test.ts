import app, { parseCSV, scrubPII } from '../server/server';
import { Server } from 'http';

describe('HanziFlow Core Functionality Tests', () => {
  
  // 1. CSV Parsing Tests
  describe('CSV Parsing Validation', () => {
    it('should correctly parse valid CSV text with headers in any order', () => {
      const csv = 'character,pinyin,definition\n你好,nǐ hǎo,hello\n再见,zàijiàn,goodbye';
      const result = parseCSV(csv);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        character: '你好',
        pinyin: 'nǐ hǎo',
        definition: 'hello'
      });
      expect(result[1]).toEqual({
        character: '再见',
        pinyin: 'zàijiàn',
        definition: 'goodbye'
      });
    });

    it('should handle quoted fields containing commas', () => {
      const csv = 'character,pinyin,definition\n谢谢,xièxie,"thank you, thanks"\n';
      const result = parseCSV(csv);
      expect(result).toHaveLength(1);
      expect(result[0].definition).toBe('thank you, thanks');
    });

    it('should throw an error for missing required columns in the header', () => {
      const csv = 'character,pinyin\n你好,nǐ hǎo';
      expect(() => parseCSV(csv)).toThrow('Invalid CSV header: must contain character, pinyin, and definition');
    });

    it('should throw an error for empty rows or missing values', () => {
      const csv = 'character,pinyin,definition\n你好,nǐ hǎo,';
      expect(() => parseCSV(csv)).toThrow('columns cannot be empty');
    });
  });

  // 2. PII Filtering Tests
  describe('PII Filtering & Scrubbing', () => {
    it('should scrub email addresses', () => {
      const input = 'My email is test.user@example.com and school mail is school@domain.edu.';
      const expected = 'My email is [REDACTED_EMAIL] and school mail is [REDACTED_EMAIL].';
      expect(scrubPII(input)).toBe(expected);
    });

    it('should scrub various phone number formats', () => {
      const input1 = 'Call me at 123-456-7890.';
      const input2 = 'Contact us: +1 555-555-5555.';
      const input3 = 'Reach out at 555-0199.';
      
      expect(scrubPII(input1)).toContain('[REDACTED_PHONE]');
      expect(scrubPII(input2)).toContain('[REDACTED_PHONE]');
      expect(scrubPII(input3)).toContain('[REDACTED_PHONE]');
    });

    it('should scrub SSN and National ID formats (XXX-XX-XXXX)', () => {
      const input = 'My reference ID is 999-12-3456.';
      const expected = 'My reference ID is [REDACTED_ID].';
      expect(scrubPII(input)).toBe(expected);
    });

    it('should leave non-PII text untouched', () => {
      const input = 'Today I learned characters like 你 (nǐ) and 好 (hǎo) which mean hello.';
      expect(scrubPII(input)).toBe(input);
    });
  });

  // 3. Express Server Speed Range Check Tests
  describe('Express Endpoint: Speed Range Checks', () => {
    let server: Server;
    let port: number;

    beforeAll((done) => {
      // Start the express server on an ephemeral port
      server = app.listen(0, () => {
        const address = server.address();
        if (address && typeof address !== 'string') {
          port = address.port;
        }
        done();
      });
    });

    afterAll((done) => {
      server.close(done);
    });

    it('should approve speed values within the [0.25, 2.0] range', async () => {
      const response = await fetch(`http://localhost:${port}/api/audio?text=你好&speed=1.5`);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.speed).toBe(1.5);
    });

    it('should approve boundary speed values (0.25 and 2.0)', async () => {
      const responseMin = await fetch(`http://localhost:${port}/api/audio?text=你好&speed=0.25`);
      const bodyMin = await responseMin.json();
      expect(responseMin.status).toBe(200);
      expect(bodyMin.speed).toBe(0.25);

      const responseMax = await fetch(`http://localhost:${port}/api/audio?text=你好&speed=2.0`);
      const bodyMax = await responseMax.json();
      expect(responseMax.status).toBe(200);
      expect(bodyMax.speed).toBe(2.0);
    });

    it('should reject speed values below 0.25', async () => {
      const response = await fetch(`http://localhost:${port}/api/audio?text=你好&speed=0.24`);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toContain('Speed out of range');
    });

    it('should reject speed values above 2.0', async () => {
      const response = await fetch(`http://localhost:${port}/api/audio?text=你好&speed=2.1`);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toContain('Speed out of range');
    });

    it('should reject non-numeric speed values', async () => {
      const response = await fetch(`http://localhost:${port}/api/audio?text=你好&speed=fast`);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toContain('Speed out of range');
    });
  });
});
