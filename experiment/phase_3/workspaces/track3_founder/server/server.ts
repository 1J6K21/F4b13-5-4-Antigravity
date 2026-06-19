import express, { Request, Response } from 'express';
import cors from 'cors';

export const app = express();
app.use(cors());
app.use(express.json());

// In-memory vocab database for MVP
export interface VocabItem {
  id: string;
  characters: string;
  pinyin: string;
  english: string;
}

export let inMemoryVocabDb: VocabItem[] = [
  { id: 'hsk1-1', characters: '你好', pinyin: 'nǐ hǎo', english: 'hello' },
  { id: 'hsk1-2', characters: '谢谢', pinyin: 'xièxie', english: 'thank you' },
  { id: 'hsk1-3', characters: '再见', pinyin: 'zàijiàn', english: 'goodbye' },
  { id: 'hsk1-4', characters: '苹果', pinyin: 'píngguǒ', english: 'apple' },
  { id: 'hsk1-5', characters: '猫', pinyin: 'māo', english: 'cat' }
];

// Helper Functions
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map(s => s.replace(/^"|"$/g, '').trim());
}

export function parseCSV(csvText: string): Omit<VocabItem, 'id'>[] {
  const lines = csvText.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length < 2) {
    throw new Error('CSV must contain a header and at least one data row');
  }

  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
  const charIdx = headers.findIndex(h => h === 'characters' || h === 'character' || h === 'hanzi' || h === 'word');
  const pinyinIdx = headers.findIndex(h => h === 'pinyin');
  const engIdx = headers.findIndex(h => h === 'english' || h === 'definition' || h === 'meaning');

  if (charIdx === -1 || pinyinIdx === -1 || engIdx === -1) {
    throw new Error('CSV must contain headers: characters, pinyin, english');
  }

  const results: Omit<VocabItem, 'id'>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    if (fields.length < Math.max(charIdx, pinyinIdx, engIdx) + 1) {
      continue; // skip malformed lines
    }
    const characters = fields[charIdx].trim();
    const pinyin = fields[pinyinIdx].trim();
    const english = fields[engIdx].trim();
    if (characters && pinyin && english) {
      results.push({ characters, pinyin, english });
    }
  }
  return results;
}

export function scrubPII(text: string): string {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  return text.replace(emailRegex, '[EMAIL]').replace(phoneRegex, '[PHONE]');
}

export function validateSpeed(speedStr: any): number {
  if (speedStr === undefined || speedStr === null) {
    return 1.0;
  }
  const speed = parseFloat(speedStr);
  if (isNaN(speed)) {
    throw new Error('Speed must be a valid number');
  }
  if (speed < 0.5 || speed > 2.0) {
    throw new Error('Speed must be between 0.5 and 2.0');
  }
  return speed;
}

// API Routes

// 1. CSV Import Route
app.post('/api/vocab/import', (req: Request, res: Response) => {
  try {
    const { csvData } = req.body;
    if (!csvData || typeof csvData !== 'string') {
      return res.status(400).json({ success: false, error: 'csvData parameter is required and must be a string' });
    }

    const parsedItems = parseCSV(csvData);
    const newItems: VocabItem[] = parsedItems.map(item => ({
      id: Math.random().toString(36).substring(2, 11),
      ...item
    }));

    // Add to our in-memory database
    inMemoryVocabDb = [...inMemoryVocabDb, ...newItems];

    return res.status(200).json({
      success: true,
      importedCount: newItems.length,
      items: newItems
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// 2. Audio TTS Validation and Retrieval Route
app.get('/api/audio/tts', (req: Request, res: Response) => {
  try {
    const { text, speed } = req.query;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'text parameter is required and must be a string' });
    }

    const validatedSpeed = validateSpeed(speed);

    // In a fully deployed cloud infrastructure, this endpoint would stream or redirect to pre-rendered TTS files.
    // For MVP, we return a success payload with validation details to trigger local browser speech synthesis
    // and demonstrate full speed-range compliance.
    return res.status(200).json({
      success: true,
      text,
      speed: validatedSpeed,
      message: 'TTS validated successfully'
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// 3. Journal Review and Vocab Scan Route
app.post('/api/journal/review', (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ success: false, error: 'Journal content cannot be empty' });
    }

    const scrubbedContent = scrubPII(content);

    // Identify which words in our vocabulary database were recalled/used in the journal entry
    const wordsIdentified = inMemoryVocabDb.filter(vocab => {
      return content.includes(vocab.characters);
    });

    return res.status(200).json({
      success: true,
      originalContent: content,
      scrubbedContent,
      wordsIdentified
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// GET active vocabulary (helper for frontend synchronization)
app.get('/api/vocab', (_req: Request, res: Response) => {
  return res.status(200).json({ success: true, items: inMemoryVocabDb });
});

// Reset vocabulary to default (helper for testing and GTM demos)
app.post('/api/vocab/reset', (_req: Request, res: Response) => {
  inMemoryVocabDb = [
    { id: 'hsk1-1', characters: '你好', pinyin: 'nǐ hǎo', english: 'hello' },
    { id: 'hsk1-2', characters: '谢谢', pinyin: 'xièxie', english: 'thank you' },
    { id: 'hsk1-3', characters: '再见', pinyin: 'zàijiàn', english: 'goodbye' },
    { id: 'hsk1-4', characters: '苹果', pinyin: 'píngguǒ', english: 'apple' },
    { id: 'hsk1-5', characters: '猫', pinyin: 'māo', english: 'cat' }
  ];
  return res.status(200).json({ success: true, items: inMemoryVocabDb });
});

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
