import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory Database mock
interface Vocabulary {
  id: number;
  character: string;
  pinyin: string;
  definition: string;
}

interface JournalEntry {
  id: number;
  originalContent: string;
  scrubbedContent: string;
  rating: number;
  vocabIds: number[];
  created_at: string;
}

interface ProgressTracking {
  vocabId: number;
  reviewCount: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewAt: string;
}

const db = {
  vocab: [] as Vocabulary[],
  journals: [] as JournalEntry[],
  progress: [] as ProgressTracking[],
  vocabIdCounter: 1,
  journalIdCounter: 1,
};

// Helper: Robust CSV Parser
export function parseCSV(csvText: string): Array<{ character: string; pinyin: string; definition: string }> {
  const lines = csvText.split(/\r?\n/);
  if (lines.length === 0 || !lines[0].trim()) {
    throw new Error('CSV is empty');
  }

  // Parse header
  const headerParts = lines[0].split(',').map(h => h.trim().toLowerCase());
  const charIdx = headerParts.indexOf('character');
  const pinyinIdx = headerParts.indexOf('pinyin');
  const defIdx = headerParts.indexOf('definition');

  if (charIdx === -1 || pinyinIdx === -1 || defIdx === -1) {
    throw new Error('Invalid CSV header: must contain character, pinyin, and definition');
  }

  const results: Array<{ character: string; pinyin: string; definition: string }> = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // CSV line parser that handles quotes
    const fields: string[] = [];
    let currentField = '';
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    fields.push(currentField.trim());

    // Clean quotes from fields
    const cleanedFields = fields.map(f => {
      if (f.startsWith('"') && f.endsWith('"')) {
        return f.substring(1, f.length - 1).trim();
      }
      return f;
    });

    if (cleanedFields.length <= Math.max(charIdx, pinyinIdx, defIdx)) {
      throw new Error(`Invalid row at line ${i + 1}: too few columns`);
    }

    const character = cleanedFields[charIdx];
    const pinyin = cleanedFields[pinyinIdx];
    const definition = cleanedFields[defIdx];

    if (!character || !pinyin || !definition) {
      throw new Error(`Invalid row at line ${i + 1}: columns cannot be empty`);
    }

    results.push({ character, pinyin, definition });
  }

  return results;
}

// Helper: PII Scrubbing
export function scrubPII(text: string): string {
  let scrubbed = text;
  
  // Email pattern
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  scrubbed = scrubbed.replace(emailPattern, '[REDACTED_EMAIL]');

  // Phone pattern (e.g. 123-456-7890, +1 (555) 555-5555, 555-5555)
  const phonePattern = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b|\b\d{3}[-.]\d{4}\b/g;
  scrubbed = scrubbed.replace(phonePattern, '[REDACTED_PHONE]');

  // SSN/ID pattern (e.g. 123-45-6789)
  const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g;
  scrubbed = scrubbed.replace(ssnPattern, '[REDACTED_ID]');

  return scrubbed;
}

// Routes
// 1. GET /api/vocab: List vocabulary
app.get('/api/vocab', (req: Request, res: Response) => {
  res.json({ success: true, data: db.vocab });
});

// 2. POST /api/vocab/import: Parse and import vocabulary from CSV text
app.post('/api/vocab/import', (req: Request, res: Response) => {
  const { csvText } = req.body;
  if (typeof csvText !== 'string') {
    res.status(400).json({ success: false, error: 'Request body must contain csvText string' });
    return;
  }

  try {
    const parsed = parseCSV(csvText);
    const importedItems: Vocabulary[] = [];

    for (const item of parsed) {
      const newItem: Vocabulary = {
        id: db.vocabIdCounter++,
        character: item.character,
        pinyin: item.pinyin,
        definition: item.definition,
      };
      db.vocab.push(newItem);
      importedItems.push(newItem);

      // Create initial progress tracking record
      db.progress.push({
        vocabId: newItem.id,
        reviewCount: 0,
        easeFactor: 2.5,
        intervalDays: 1,
        nextReviewAt: new Date().toISOString(),
      });
    }

    res.status(201).json({
      success: true,
      message: `Successfully imported ${importedItems.length} vocabulary items`,
      importedCount: importedItems.length,
      data: importedItems,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 3. GET /api/audio: Retrieve TTS audio options, verifying speed ranges [0.25, 2.0]
app.get('/api/audio', (req: Request, res: Response) => {
  const { text, speed } = req.query;

  if (!text || typeof text !== 'string') {
    res.status(400).json({ success: false, error: 'Missing query parameter: text' });
    return;
  }

  if (speed === undefined || speed === null) {
    res.status(400).json({ success: false, error: 'Missing query parameter: speed' });
    return;
  }

  const speedVal = parseFloat(speed as string);
  if (isNaN(speedVal) || speedVal < 0.25 || speedVal > 2.0) {
    res.status(400).json({ success: false, error: 'Speed out of range: must be between 0.25 and 2.0' });
    return;
  }

  res.json({
    success: true,
    text,
    speed: speedVal,
    audioUrl: `https://api.hanziflow.example.com/tts?text=${encodeURIComponent(text)}&speed=${speedVal}`,
    message: 'Audio speed validated successfully. Ready for client speech output.',
  });
});

// 4. POST /api/journal: Create a journal entry, scrubbing PII
app.post('/api/journal', (req: Request, res: Response) => {
  const { content, rating, vocabIds } = req.body;

  if (typeof content !== 'string' || !content.trim()) {
    res.status(400).json({ success: false, error: 'Missing journal content' });
    return;
  }

  const ratingVal = parseInt(rating);
  if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
    res.status(400).json({ success: false, error: 'Rating must be an integer between 1 and 5' });
    return;
  }

  const scrubbed = scrubPII(content);
  const newJournal: JournalEntry = {
    id: db.journalIdCounter++,
    originalContent: content,
    scrubbedContent: scrubbed,
    rating: ratingVal,
    vocabIds: Array.isArray(vocabIds) ? vocabIds.map(Number) : [],
    created_at: new Date().toISOString(),
  };

  db.journals.push(newJournal);

  res.status(201).json({
    success: true,
    journal: newJournal,
  });
});

// 5. GET /api/journals: List journal entries
app.get('/api/journals', (req: Request, res: Response) => {
  res.json({ success: true, data: db.journals });
});

// 6. POST /api/vocab/review: Update vocabulary review metrics (spaced repetition progress)
app.post('/api/vocab/review', (req: Request, res: Response) => {
  const { vocabId, rating } = req.body;
  const ratingVal = parseInt(rating);
  const targetId = parseInt(vocabId);

  if (isNaN(targetId) || isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
    res.status(400).json({ success: false, error: 'Invalid parameters: vocabId and rating (1-5) are required' });
    return;
  }

  const prog = db.progress.find(p => p.vocabId === targetId);
  if (!prog) {
    res.status(404).json({ success: false, error: 'Vocabulary progress record not found' });
    return;
  }

  // Update spaced repetition stats using simplified SM2 algorithm
  prog.reviewCount += 1;
  prog.easeFactor = Math.max(1.3, prog.easeFactor + (0.1 - (5 - ratingVal) * (0.08 + (5 - ratingVal) * 0.02)));

  if (ratingVal < 3) {
    prog.intervalDays = 1;
  } else if (prog.reviewCount === 1) {
    prog.intervalDays = 1;
  } else if (prog.reviewCount === 2) {
    prog.intervalDays = 6;
  } else {
    prog.intervalDays = Math.ceil(prog.intervalDays * prog.easeFactor);
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + prog.intervalDays);
  prog.nextReviewAt = nextDate.toISOString();

  res.json({
    success: true,
    message: 'Vocabulary review updated successfully',
    progress: prog,
  });
});

// Start Express Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[HanziFlow Backend] running on http://localhost:${PORT}`);
  });
}

export default app;
export { db };
