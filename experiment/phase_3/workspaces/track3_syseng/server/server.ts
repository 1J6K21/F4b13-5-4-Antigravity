import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

export const app = express();
app.use(cors());
app.use(express.json());

// --- IN-MEMORY DATABASE STATES ---
export interface VocabItem {
  id: string;
  character: string;
  pinyin: string;
  translation: string;
  streak: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewAt: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  createdAt: string;
  vocabRatings: { vocabId: string; rating: 'easy' | 'medium' | 'hard' }[];
}

export let vocabDb: VocabItem[] = [
  {
    id: 'vocab-1',
    character: '你好',
    pinyin: 'nǐ hǎo',
    translation: 'hello',
    streak: 0,
    easeFactor: 2.5,
    intervalDays: 0,
    nextReviewAt: new Date().toISOString(),
  },
  {
    id: 'vocab-2',
    character: '谢谢',
    pinyin: 'xièxie',
    translation: 'thank you',
    streak: 0,
    easeFactor: 2.5,
    intervalDays: 0,
    nextReviewAt: new Date().toISOString(),
  },
  {
    id: 'vocab-3',
    character: '再见',
    pinyin: 'zàijiàn',
    translation: 'goodbye',
    streak: 0,
    easeFactor: 2.5,
    intervalDays: 0,
    nextReviewAt: new Date().toISOString(),
  },
];

export let journalsDb: JournalEntry[] = [];

// Helper to reset DB for testing
export function resetDb() {
  vocabDb = [
    {
      id: 'vocab-1',
      character: '你好',
      pinyin: 'nǐ hǎo',
      translation: 'hello',
      streak: 0,
      easeFactor: 2.5,
      intervalDays: 0,
      nextReviewAt: new Date().toISOString(),
    },
    {
      id: 'vocab-2',
      character: '谢谢',
      pinyin: 'xièxie',
      translation: 'thank you',
      streak: 0,
      easeFactor: 2.5,
      intervalDays: 0,
      nextReviewAt: new Date().toISOString(),
    },
    {
      id: 'vocab-3',
      character: '再见',
      pinyin: 'zàijiàn',
      translation: 'goodbye',
      streak: 0,
      easeFactor: 2.5,
      intervalDays: 0,
      nextReviewAt: new Date().toISOString(),
    },
  ];
  journalsDb = [];
}

// --- PII SCRUBBING UTILITY ---
export function scrubPii(text: string): string {
  if (!text) return '';
  let scrubbed = text;
  
  // 1. Emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  scrubbed = scrubbed.replace(emailRegex, '[EMAIL_REDACTED]');

  // 2. Phone Numbers (matching standard formats: +1-123-456-7890, (123) 456-7890, 123-456-7890, 1234567890)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  scrubbed = scrubbed.replace(phoneRegex, '[PHONE_REDACTED]');

  // 3. ID / Credit Cards (15-16 digit numbers or SSN-like patterns)
  const ccRegex = /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g;
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  
  scrubbed = scrubbed.replace(ccRegex, '[ID_REDACTED]');
  scrubbed = scrubbed.replace(ssnRegex, '[ID_REDACTED]');

  return scrubbed;
}

// --- AUDIO GENERATION (SINE WAV WAVEFORM) ---
export function generateWav(text: string, speed: number): Buffer {
  const sampleRate = 8000;
  const baseDuration = 0.5; // 0.5 seconds base tone
  const duration = baseDuration / speed;
  const numSamples = Math.floor(sampleRate * duration);
  const headerSize = 44;
  const fileSizeBytes = headerSize + numSamples;
  const buffer = Buffer.alloc(fileSizeBytes);

  // RIFF identifier
  buffer.write('RIFF', 0);
  // file length minus RIFF identifier and size (fileSizeBytes - 8)
  buffer.writeUInt32LE(fileSizeBytes - 8, 4);
  // WAVE identifier
  buffer.write('WAVE', 8);
  // format chunk identifier "fmt "
  buffer.write('fmt ', 12);
  // format chunk size (16 for PCM)
  buffer.writeUInt32LE(16, 16);
  // audio format (1 for PCM)
  buffer.writeUInt16LE(1, 20);
  // channel count (1 for mono)
  buffer.writeUInt16LE(1, 22);
  // sample rate
  buffer.writeUInt32LE(sampleRate, 24);
  // byte rate (sampleRate * channelCount * bitsPerSample/8)
  buffer.writeUInt32LE(sampleRate, 28);
  // block align (channelCount * bitsPerSample/8)
  buffer.writeUInt16LE(1, 32);
  // bits per sample (8 bits)
  buffer.writeUInt16LE(8, 34);
  // data chunk identifier
  buffer.write('data', 36);
  // data chunk size
  buffer.writeUInt32LE(numSamples, 40);

  // Generate a simple frequency frequency based on text length to make it slightly dynamic
  const frequency = 300 + (text.length * 10) % 500;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // 8-bit PCM is unsigned: values range 0 - 255 (centered at 128)
    const sample = Math.round(128 + 127 * Math.sin(2 * Math.PI * frequency * t));
    buffer.writeUInt8(sample, headerSize + i);
  }

  return buffer;
}

// --- API ROUTES ---

// 1. Get Vocabulary
app.get('/api/vocab', (req: Request, res: Response) => {
  res.json({ success: true, items: vocabDb });
});

// 2. CSV Import
app.post('/api/vocab/import', (req: Request, res: Response): void => {
  const { csvText } = req.body;

  if (typeof csvText !== 'string' || !csvText.trim()) {
    res.status(400).json({ success: false, error: 'Request body must contain non-empty csvText.' });
    return;
  }

  // Check size: limit to 100KB to prevent DoS
  if (csvText.length > 102400) {
    res.status(400).json({ success: false, error: 'CSV file size exceeds the 100KB limit.' });
    return;
  }

  try {
    const lines = csvText.split(/\r?\n/);
    if (lines.length === 0 || !lines[0].trim()) {
      res.status(400).json({ success: false, error: 'CSV is empty.' });
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const charIndex = headers.indexOf('character');
    const pinyinIndex = headers.indexOf('pinyin');
    const transIndex = headers.indexOf('translation');

    if (charIndex === -1 || pinyinIndex === -1 || transIndex === -1) {
      res.status(400).json({
        success: false,
        error: 'Invalid CSV headers. Must contain: character, pinyin, translation',
      });
      return;
    }

    const newItems: VocabItem[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // skip blank lines

      // Handle basic comma separation (without full escaped quotes support for MVP simplicity, 
      // but splitting carefully)
      const columns = line.split(',').map(c => c.trim());
      if (columns.length < Math.max(charIndex, pinyinIndex, transIndex) + 1) {
        res.status(400).json({ success: false, error: `Row ${i + 1} is malformed or incomplete.` });
        return;
      }

      const character = columns[charIndex];
      const pinyin = columns[pinyinIndex];
      const translation = columns[transIndex];

      if (!character || !pinyin || !translation) {
        res.status(400).json({ success: false, error: `Row ${i + 1} contains empty values.` });
        return;
      }

      // Check duplicates in newItems or vocabDb
      const exists = vocabDb.some(v => v.character === character && v.pinyin === pinyin) ||
                     newItems.some(v => v.character === character && v.pinyin === pinyin);

      if (!exists) {
        newItems.push({
          id: `vocab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          character,
          pinyin,
          translation,
          streak: 0,
          easeFactor: 2.5,
          intervalDays: 0,
          nextReviewAt: new Date().toISOString(),
        });
      }
    }

    // Insert to DB
    vocabDb.push(...newItems);

    res.json({ success: true, count: newItems.length, items: newItems });
  } catch (err: any) {
    res.status(500).json({ success: false, error: `Internal parsing error: ${err.message}` });
  }
});

// 3. Audio Retrieval (with speed limits)
app.get('/api/audio', (req: Request, res: Response): void => {
  const { text, speed: speedQuery } = req.query;

  if (!text || typeof text !== 'string') {
    res.status(400).json({ success: false, error: 'Missing or invalid text parameter.' });
    return;
  }

  if (text.length > 200) {
    res.status(400).json({ success: false, error: 'Text parameter too long (max 200 characters).' });
    return;
  }

  let speed = 1.0;
  if (speedQuery !== undefined) {
    speed = parseFloat(speedQuery as string);
    if (isNaN(speed)) {
      res.status(400).json({ success: false, error: 'Speed parameter must be a valid number.' });
      return;
    }
  }

  // Defensive Range Check: Limit playback speed between 0.5x and 2.0x
  if (speed < 0.5 || speed > 2.0) {
    res.status(400).json({
      success: false,
      error: 'Invalid speed parameter. Must be between 0.5 and 2.0 inclusive.',
    });
    return;
  }

  try {
    const audioBuffer = generateWav(text, speed);
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Length', audioBuffer.length);
    res.send(audioBuffer);
  } catch (err: any) {
    res.status(500).json({ success: false, error: `Audio generation failed: ${err.message}` });
  }
});

// 4. Submit Journal & Feedback
app.post('/api/journal', (req: Request, res: Response): void => {
  const { content, vocabRatings } = req.body;

  if (typeof content !== 'string' || !content.trim()) {
    res.status(400).json({ success: false, error: 'Content must be a non-empty string.' });
    return;
  }

  if (content.length > 5000) {
    res.status(400).json({ success: false, error: 'Content exceeds the 5000 character limit.' });
    return;
  }

  // Scrub PII from journal content before persisting
  const scrubbedContent = scrubPii(content);

  // Validate ratings
  if (!Array.isArray(vocabRatings)) {
    res.status(400).json({ success: false, error: 'vocabRatings must be an array.' });
    return;
  }

  const updatedVocab: { vocabId: string; newStreak: number; nextReviewAt: string }[] = [];

  for (const item of vocabRatings) {
    if (!item.vocabId || !['easy', 'medium', 'hard'].includes(item.rating)) {
      res.status(400).json({
        success: false,
        error: "Each rating must contain a valid vocabId and rating ('easy', 'medium', or 'hard').",
      });
      return;
    }

    const vocab = vocabDb.find(v => v.id === item.vocabId);
    if (!vocab) {
      res.status(404).json({ success: false, error: `Vocab item not found: ${item.vocabId}` });
      return;
    }

    // Apply Spaced Repetition (SM-2 simplified algorithm)
    let streak = vocab.streak;
    let easeFactor = vocab.easeFactor;
    let intervalDays = vocab.intervalDays;

    if (item.rating === 'easy') {
      streak += 1;
      easeFactor = Math.min(3.0, easeFactor + 0.15);
      intervalDays = streak === 1 ? 1 : streak === 2 ? 3 : Math.ceil(intervalDays * easeFactor);
    } else if (item.rating === 'medium') {
      streak = Math.max(1, streak); // streak remains but bounded
      easeFactor = easeFactor;
      intervalDays = streak === 1 ? 1 : Math.ceil(intervalDays * 1.2);
    } else {
      // hard
      streak = 0;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      intervalDays = 1;
    }

    vocab.streak = streak;
    vocab.easeFactor = easeFactor;
    vocab.intervalDays = intervalDays;
    
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);
    vocab.nextReviewAt = nextReviewDate.toISOString();

    updatedVocab.push({
      vocabId: vocab.id,
      newStreak: vocab.streak,
      nextReviewAt: vocab.nextReviewAt,
    });
  }

  const newJournal: JournalEntry = {
    id: `journal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content: scrubbedContent,
    createdAt: new Date().toISOString(),
    vocabRatings,
  };

  journalsDb.push(newJournal);

  res.status(201).json({
    success: true,
    journalEntry: newJournal,
    vocabUpdates: updatedVocab,
  });
});

// 5. Get Journals List
app.get('/api/journals', (req: Request, res: Response) => {
  res.json({ success: true, items: journalsDb });
});

// 6. Global error boundary
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.status && err.status >= 400 && err.status < 500) {
    res.status(err.status).json({ success: false, error: err.message || 'Request parsing failed.' });
    return;
  }
  console.error(err);
  res.status(500).json({ success: false, error: 'An unexpected server error occurred.' });
});

// --- Server startup (only when not in testing mode) ---
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`HanziFlow Express backend listening on port ${PORT}`);
  });
}
