import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Log incoming requests for scientist evaluation
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[REQUEST] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Helper for Levenshtein Distance
export const computeLevenshtein = (a: string, b: string): number => {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,    // deletion
          matrix[i][j - 1] + 1,    // insertion
          matrix[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }
  return matrix[a.length][b.length];
};

// Helper for Tone Accuracy Calculation
export const calculateToneAccuracy = (user: string, actual: string): number => {
  const userClean = user.trim().toLowerCase();
  const actualClean = actual.trim().toLowerCase();
  if (userClean === actualClean) return 100.0;

  const maxLen = Math.max(userClean.length, actualClean.length);
  if (maxLen === 0) return 100.0;

  const dist = computeLevenshtein(userClean, actualClean);
  const accuracy = Math.max(0, 1 - dist / maxLen) * 100.0;
  return parseFloat(accuracy.toFixed(1));
};

// PII Scrubbing Logic: Scrub emails, phone numbers, and common name-indicating formats
export const scrubPII = (text: string): string => {
  let scrubbed = text;
  
  // 1. Emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  scrubbed = scrubbed.replace(emailRegex, "[REDACTED_EMAIL]");

  // 2. Phone Numbers (e.g., +1-555-555-5555, 555-555-5555, etc.)
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  scrubbed = scrubbed.replace(phoneRegex, "[REDACTED_PHONE]");

  // 3. Name indicators (e.g., "my name is X", "I am X", "John Doe")
  // Let's replace common names or name structures for basic scrubbing
  const namePatterns = [
    /\b(john doe|jane doe|smith|johnson|williams|brown|jones|miller|davis|garcia|rodriguez|wilson)\b/gi,
    /(?:my name is|i am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi
  ];

  for (const pattern of namePatterns) {
    if (pattern.source.includes("my name is|i am")) {
      scrubbed = scrubbed.replace(pattern, (match, name) => {
        return match.replace(name, "[REDACTED_NAME]");
      });
    } else {
      scrubbed = scrubbed.replace(pattern, "[REDACTED_NAME]");
    }
  }

  return scrubbed;
};

// 1. API: Import Vocabulary (CSV)
app.post("/api/vocab/import", (req: Request, res: Response): void => {
  const { csvText } = req.body;
  if (!csvText || typeof csvText !== "string") {
    res.status(400).json({ success: false, error: "csvText field must be a valid non-empty string" });
    return;
  }

  const lines = csvText.split(/\r?\n/);
  const items: any[] = [];
  let validRecords = 0;
  let invalidRecords = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(",").map(p => {
      let cleaned = p.trim();
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.substring(1, cleaned.length - 1);
      }
      return cleaned;
    });

    // Skip header row
    if (i === 0 && parts[0].toLowerCase().includes("character")) {
      continue;
    }

    if (parts.length >= 3 && parts[0] && parts[1] && parts[2]) {
      items.push({
        id: Math.random().toString(36).substring(2, 11),
        character: parts[0],
        pinyin: parts[1],
        english: parts[2]
      });
      validRecords++;
    } else {
      invalidRecords++;
    }
  }

  res.status(200).json({
    success: true,
    importedCount: items.length,
    items,
    statistics: {
      totalLinesParsed: lines.length,
      validRecords,
      invalidRecords
    }
  });
});

// 2. API: Audio Playback speed-clamped check
app.get("/api/audio/speech", (req: Request, res: Response): void => {
  const { text, speed } = req.query;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    res.status(400).json({ success: false, error: "text query parameter is required" });
    return;
  }

  if (text.length > 100) {
    res.status(400).json({ success: false, error: "text query parameter exceeds maximum limit of 100 characters" });
    return;
  }

  let rate = 1.0;
  if (speed !== undefined) {
    const parsedSpeed = parseFloat(speed as string);
    if (isNaN(parsedSpeed) || parsedSpeed < 0.5 || parsedSpeed > 2.0) {
      console.warn(`[BOUNDARY EXCEEDED] Speed value ${speed} is outside the scientific safe range [0.5, 2.0]`);
      res.status(400).json({
        success: false,
        error: "speed parameter is out of bounds. Playback speed must be strictly between 0.5 and 2.0 to prevent audio distortion."
      });
      return;
    }
    rate = parsedSpeed;
  }

  res.status(200).json({
    success: true,
    text: text.trim(),
    speed: rate,
    lang: "zh-CN",
    action: "synthesize",
    timestamp: Date.now()
  });
});

// 3. API: Journal Submission & Recall Assessment with PII Scrubbing
app.post("/api/journal/review", (req: Request, res: Response): void => {
  const { content, targetVocab } = req.body;

  if (!content || typeof content !== "string") {
    res.status(400).json({ success: false, error: "content is required and must be a string" });
    return;
  }

  if (!Array.isArray(targetVocab)) {
    res.status(400).json({ success: false, error: "targetVocab must be an array of vocabulary items" });
    return;
  }

  // Scrub PII
  const scrubbedContent = scrubPII(content);

  // Evaluate vocabulary recall in context
  const evaluation: any[] = [];
  let correctlyRecalled = 0;

  for (const vocab of targetVocab) {
    const char = vocab.character;
    const expectedPinyin = vocab.pinyin;

    // Detect if the character exists in the journal text
    const charIndex = content.indexOf(char);
    if (charIndex !== -1) {
      // Find nearby pinyin written in parenthetical format or nearby words
      // We look at the substring following the character up to 30 characters
      const nearText = content.substring(charIndex + char.length, charIndex + char.length + 30);
      
      // Look for text in parentheses or standard spaces containing pinyin
      const pinyinMatch = nearText.match(/[\s(（]*([a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜvü\s\d]+)[\s)）]*/);
      let detectedPinyin = "";

      if (pinyinMatch && pinyinMatch[1]) {
        detectedPinyin = pinyinMatch[1].trim();
      }

      // If nothing detected immediately next to character, scan the whole string for expected pinyin
      if (!detectedPinyin) {
        const wholeTextMatch = content.match(new RegExp(expectedPinyin, "i"));
        if (wholeTextMatch) {
          detectedPinyin = wholeTextMatch[0];
        }
      }

      const score = calculateToneAccuracy(detectedPinyin, expectedPinyin);
      const isCorrect = score >= 95.0; // 95% threshold for correct spelling & tones

      if (isCorrect) {
        correctlyRecalled++;
      }

      evaluation.push({
        character: char,
        expectedPinyin,
        detectedPinyin,
        toneScore: score,
        isCorrect
      });
    } else {
      // Character not found at all -> recall failed
      evaluation.push({
        character: char,
        expectedPinyin,
        detectedPinyin: "",
        toneScore: 0.0,
        isCorrect: false
      });
    }
  }

  const recallRate = targetVocab.length > 0 
    ? parseFloat(((correctlyRecalled / targetVocab.length) * 100).toFixed(1))
    : 0.0;

  res.status(200).json({
    success: true,
    scrubbedContent,
    evaluation,
    metrics: {
      totalWordsScrubbed: (content.length - scrubbedContent.length) > 0 ? 1 : 0, // simple count representation
      recallRate
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[SERVER RUNNING] HanziFlow backend started on port ${PORT}`);
  });
}

export default app;
