import request from 'supertest';
import {
  app,
  parseCSV,
  scrubPII,
  validateSpeed
} from '../server/server';

describe('HanziFlow Backend Tests', () => {

  // Test block 1: CSV Parser Unit Tests
  describe('CSV Parser', () => {
    it('should successfully parse valid CSV content with characters, pinyin, and english', () => {
      const csv = `characters,pinyin,english
你好,nǐ hǎo,hello
谢谢,xièxie,thank you`;
      const result = parseCSV(csv);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        characters: '你好',
        pinyin: 'nǐ hǎo',
        english: 'hello'
      });
      expect(result[1]).toEqual({
        characters: '谢谢',
        pinyin: 'xièxie',
        english: 'thank you'
      });
    });

    it('should handle headers in different order and aliases', () => {
      const csv = `pinyin,english,hanzi
nǐ hǎo,hello,你好`;
      const result = parseCSV(csv);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        characters: '你好',
        pinyin: 'nǐ hǎo',
        english: 'hello'
      });
    });

    it('should parse fields containing commas wrapped in quotes', () => {
      const csv = `characters,pinyin,english
再见,zàijiàn,"goodbye, see you again"`;
      const result = parseCSV(csv);
      expect(result).toHaveLength(1);
      expect(result[0].english).toBe('goodbye, see you again');
    });

    it('should throw an error if required headers are missing', () => {
      const csv = `pinyin,english
nǐ hǎo,hello`;
      expect(() => parseCSV(csv)).toThrow('CSV must contain headers: characters, pinyin, english');
    });

    it('should throw an error for empty CSV data', () => {
      expect(() => parseCSV('')).toThrow('CSV must contain a header and at least one data row');
    });
  });

  // Test block 2: Audio Speed Validation Unit Tests
  describe('Speed Validation', () => {
    it('should return 1.0 default if speed is not provided', () => {
      expect(validateSpeed(undefined)).toBe(1.0);
      expect(validateSpeed(null)).toBe(1.0);
    });

    it('should parse and return valid speeds between 0.5 and 2.0', () => {
      expect(validateSpeed('0.5')).toBe(0.5);
      expect(validateSpeed(0.5)).toBe(0.5);
      expect(validateSpeed('1.25')).toBe(1.25);
      expect(validateSpeed(2.0)).toBe(2.0);
    });

    it('should throw an error for speeds below 0.5', () => {
      expect(() => validateSpeed(0.49)).toThrow('Speed must be between 0.5 and 2.0');
      expect(() => validateSpeed('0.1')).toThrow('Speed must be between 0.5 and 2.0');
    });

    it('should throw an error for speeds above 2.0', () => {
      expect(() => validateSpeed(2.01)).toThrow('Speed must be between 0.5 and 2.0');
      expect(() => validateSpeed('3.0')).toThrow('Speed must be between 0.5 and 2.0');
    });

    it('should throw an error for non-numeric speed values', () => {
      expect(() => validateSpeed('slow')).toThrow('Speed must be a valid number');
    });
  });

  // Test block 3: PII Filter Unit Tests
  describe('PII Scrubber', () => {
    it('should replace email addresses with [EMAIL]', () => {
      const input = 'My email is learning@hanziflow.com, please contact me.';
      const output = scrubPII(input);
      expect(output).toBe('My email is [EMAIL], please contact me.');
    });

    it('should replace phone numbers with [PHONE]', () => {
      const inputs = [
        'Call me at 123-456-7890.',
        'Reach out at +1-999-888-7777.',
        'Dial 555-555-5555 for support.'
      ];
      inputs.forEach(input => {
        expect(scrubPII(input)).toContain('[PHONE]');
      });
    });

    it('should leave Chinese characters and harmless English text intact', () => {
      const input = 'Today I learned 你好 (hello) and shared it with my class.';
      expect(scrubPII(input)).toBe(input);
    });
  });

  // Test block 4: Express HTTP API Integration Tests
  describe('Express API Integration', () => {
    beforeEach(async () => {
      // Reset database to initial state
      await request(app).post('/api/vocab/reset');
    });

    it('POST /api/vocab/import - imports vocabulary', async () => {
      const csvContent = `characters,pinyin,english
苹果,píngguǒ,apple
香蕉,xiāngjiāo,banana`;
      const res = await request(app)
        .post('/api/vocab/import')
        .send({ csvData: csvContent });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.importedCount).toBe(2);
      expect(res.body.items[0].characters).toBe('苹果');
    });

    it('POST /api/vocab/import - returns 400 on malformed input', async () => {
      const res = await request(app)
        .post('/api/vocab/import')
        .send({ csvData: 'bad_headers,only_two\nval1,val2' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('CSV must contain headers');
    });

    it('GET /api/audio/tts - validates speed parameter constraints', async () => {
      // Test valid speed
      let res = await request(app).get('/api/audio/tts?text=你好&speed=1.5');
      expect(res.status).toBe(200);
      expect(res.body.speed).toBe(1.5);

      // Test speed below limit
      res = await request(app).get('/api/audio/tts?text=你好&speed=0.2');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Speed must be between 0.5 and 2.0');

      // Test speed above limit
      res = await request(app).get('/api/audio/tts?text=你好&speed=2.5');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Speed must be between 0.5 and 2.0');
    });

    it('POST /api/journal/review - scrubs PII and matches active vocabulary', async () => {
      // Ensure "你好" is in database
      const res = await request(app)
        .post('/api/journal/review')
        .send({ content: 'I want to say 你好 to test@example.com!' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.scrubbedContent).toBe('I want to say 你好 to [EMAIL]!');
      expect(res.body.wordsIdentified).toHaveLength(1);
      expect(res.body.wordsIdentified[0].characters).toBe('你好');
    });
  });
});
