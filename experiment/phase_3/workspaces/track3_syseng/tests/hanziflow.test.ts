import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app, resetDb, scrubPii } from '../server/server.ts';

describe('HanziFlow Backend Tests', () => {
  beforeEach(() => {
    resetDb();
  });

  describe('PII Scrubbing Utility', () => {
    it('should scrub email addresses correctly', () => {
      const text = 'Contact me at admin@hanziflow.com or user.name@test.org.';
      const scrubbed = scrubPii(text);
      expect(scrubbed).toContain('[EMAIL_REDACTED]');
      expect(scrubbed).not.toContain('admin@hanziflow.com');
      expect(scrubbed).not.toContain('user.name@test.org');
    });

    it('should scrub phone numbers in various formats', () => {
      const text1 = 'Call +1-123-456-7890 today.';
      const text2 = 'My number is (800) 555-1212.';
      const text3 = 'Dial 3125557788 immediately.';

      expect(scrubPii(text1)).toContain('[PHONE_REDACTED]');
      expect(scrubPii(text2)).toContain('[PHONE_REDACTED]');
      expect(scrubPii(text3)).toContain('[PHONE_REDACTED]');
    });

    it('should scrub identity and credit card numbers', () => {
      const text1 = 'My SSN is 000-12-3456.';
      const text2 = 'Use credit card 1234-5678-9012-3456 to pay.';

      expect(scrubPii(text1)).toContain('[ID_REDACTED]');
      expect(scrubPii(text2)).toContain('[ID_REDACTED]');
    });
  });

  describe('CSV Import API (POST /api/vocab/import)', () => {
    it('should import a valid CSV vocabulary list', async () => {
      const csvData = 'character,pinyin,translation\n苹果,píngguǒ,apple\n香蕉,xiāngjiāo,banana';
      const response = await request(app)
        .post('/api/vocab/import')
        .send({ csvText: csvData });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.items[0].character).toBe('苹果');
      expect(response.body.items[1].character).toBe('香蕉');
    });

    it('should fail with missing headers', async () => {
      const csvData = 'pinyin,translation\npíngguǒ,apple';
      const response = await request(app)
        .post('/api/vocab/import')
        .send({ csvText: csvData });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid CSV headers');
    });

    it('should fail if any data row is incomplete', async () => {
      const csvData = 'character,pinyin,translation\n苹果,píngguǒ\n香蕉,xiāngjiāo,banana';
      const response = await request(app)
        .post('/api/vocab/import')
        .send({ csvText: csvData });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('malformed or incomplete');
    });

    it('should reject requests exceeding 100KB', async () => {
      const largeCsv = 'character,pinyin,translation\n' + 'a,b,c\n'.repeat(20000); // Exceeds 100KB
      const response = await request(app)
        .post('/api/vocab/import')
        .send({ csvText: largeCsv });

      expect(response.status).toBe(413);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('too large');
    });
  });

  describe('Audio Retrieval API (GET /api/audio)', () => {
    it('should generate audio for a valid text and speed (normal speed 1.0)', async () => {
      const response = await request(app)
        .get('/api/audio')
        .query({ text: '你好', speed: 1.0 });

      expect(response.status).toBe(200);
      expect(response.header['content-type']).toBe('audio/wav');
      expect(Number(response.header['content-length'])).toBeGreaterThan(44);
    });

    it('should generate audio for a valid text at slow speed (0.5)', async () => {
      const response = await request(app)
        .get('/api/audio')
        .query({ text: '学习', speed: 0.5 });

      expect(response.status).toBe(200);
      expect(response.header['content-type']).toBe('audio/wav');
    });

    it('should generate audio for a valid text at fast speed (2.0)', async () => {
      const response = await request(app)
        .get('/api/audio')
        .query({ text: '谢谢', speed: 2.0 });

      expect(response.status).toBe(200);
      expect(response.header['content-type']).toBe('audio/wav');
    });

    it('should reject speeds below 0.5', async () => {
      const response = await request(app)
        .get('/api/audio')
        .query({ text: '你好', speed: 0.49 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('between 0.5 and 2.0');
    });

    it('should reject speeds above 2.0', async () => {
      const response = await request(app)
        .get('/api/audio')
        .query({ text: '你好', speed: 2.1 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('between 0.5 and 2.0');
    });

    it('should reject invalid non-numeric speeds', async () => {
      const response = await request(app)
        .get('/api/audio')
        .query({ text: '你好', speed: 'fast' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Journal API (POST /api/journal)', () => {
    it('should save journal entries and scrub PII', async () => {
      const entryPayload = {
        content: 'I wrote a journal today. Email me at student@school.edu or ring 555-123-4567.',
        vocabRatings: [],
      };

      const response = await request(app)
        .post('/api/journal')
        .send(entryPayload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.journalEntry.content).toContain('[EMAIL_REDACTED]');
      expect(response.body.journalEntry.content).toContain('[PHONE_REDACTED]');
      expect(response.body.journalEntry.content).not.toContain('student@school.edu');
    });

    it('should log ratings and update spaced repetition streaks', async () => {
      const entryPayload = {
        content: '今天学习中文。再见！',
        vocabRatings: [
          { vocabId: 'vocab-1', rating: 'easy' },
          { vocabId: 'vocab-2', rating: 'hard' },
        ],
      };

      const response = await request(app)
        .post('/api/journal')
        .send(entryPayload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);

      const update1 = response.body.vocabUpdates.find((u: any) => u.vocabId === 'vocab-1');
      const update2 = response.body.vocabUpdates.find((u: any) => u.vocabId === 'vocab-2');

      expect(update1.newStreak).toBe(1);
      expect(update2.newStreak).toBe(0);
    });

    it('should reject invalid rating values', async () => {
      const entryPayload = {
        content: '今天学习。',
        vocabRatings: [{ vocabId: 'vocab-1', rating: 'super-easy' }],
      };

      const response = await request(app)
        .post('/api/journal')
        .send(entryPayload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
