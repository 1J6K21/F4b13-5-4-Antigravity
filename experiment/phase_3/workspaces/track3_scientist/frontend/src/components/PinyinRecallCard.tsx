import React, { useState } from "react";
import { VocabItem } from "./VocabularyImport";

interface PinyinRecallCardProps {
  item: VocabItem;
  onNext: () => void;
  playbackSpeed: number;
  onLogSession: (vocabId: string, isCorrect: boolean, speedSetting: number, toneAccuracy: number) => void;
}

// Helper to calculate Levenshtein distance
export const calculateLevenshtein = (a: string, b: string): number => {
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

// Standardizes pinyin by mapping common tone representations
export const standardizePinyin = (pinyin: string): string => {
  return pinyin
    .toLowerCase()
    .normalize("NFD") // split accent marks from characters
    .replace(/[\u0300-\u036f]/g, "") // remove accent marks
    .replace(/[0-9]/g, "") // remove numeric tones
    .trim();
};

export const extractTones = (pinyin: string): number[] => {
  const toneMap: { [key: string]: number } = {
    // Tone 1 (macron)
    "\u0304": 1, "ā": 1, "ē": 1, "ī": 1, "ō": 1, "ū": 1, "ǖ": 1,
    // Tone 2 (acute)
    "\u0301": 2, "á": 2, "é": 2, "í": 2, "ó": 2, "ú": 2, "ǘ": 2,
    // Tone 3 (caron)
    "\u030c": 3, "ǎ": 3, "ě": 3, "ǐ": 3, "ǒ": 3, "ǔ": 3, "ǚ": 3,
    // Tone 4 (grave)
    "\u0300": 4, "à": 4, "è": 4, "ì": 4, "ò": 4, "ù": 4, "ǜ": 4
  };

  const tones: number[] = [];
  
  // First, check if there are numeric tones at the end of parts
  const numMatches = pinyin.match(/\d/g);
  if (numMatches) {
    return numMatches.map(n => parseInt(n, 10));
  }

  // Otherwise, inspect character by character or decompose Unicode
  const decomposed = pinyin.toLowerCase().normalize("NFD");
  for (let i = 0; i < decomposed.length; i++) {
    const char = decomposed[i];
    // Check unicode combining accents
    if (char === "\u0304") tones.push(1);
    else if (char === "\u0301") tones.push(2);
    else if (char === "\u030c") tones.push(3);
    else if (char === "\u0300") tones.push(4);
  }

  // Fallback direct characters
  if (tones.length === 0) {
    for (const char of pinyin.toLowerCase()) {
      if (["ā", "ē", "ī", "ō", "ū", "ǖ"].includes(char)) tones.push(1);
      else if (["á", "é", "í", "ó", "ú", "ǘ"].includes(char)) tones.push(2);
      else if (["ǎ", "ě", "ǐ", "ǒ", "ǔ", "ǚ"].includes(char)) tones.push(3);
      else if (["à", "è", "ì", "ò", "ù", "ǜ"].includes(char)) tones.push(4);
    }
  }

  // Default to 5 (neutral tone) if no tone found
  if (tones.length === 0) {
    tones.push(5);
  }

  return tones;
};

export const calculateToneAccuracy = (user: string, actual: string): number => {
  const userClean = user.trim().toLowerCase();
  const actualClean = actual.trim().toLowerCase();
  if (userClean === actualClean) return 100.0;

  const maxLen = Math.max(userClean.length, actualClean.length);
  if (maxLen === 0) return 100.0;

  const dist = calculateLevenshtein(userClean, actualClean);
  const accuracy = Math.max(0, 1 - dist / maxLen) * 100.0;
  return parseFloat(accuracy.toFixed(1));
};

export const PinyinRecallCard: React.FC<PinyinRecallCardProps> = ({
  item,
  onNext,
  playbackSpeed,
  onLogSession
}) => {
  const [guess, setGuess] = useState<string>("");
  const [showPinyin, setShowPinyin] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [toneScore, setToneScore] = useState<number | null>(null);

  const speak = () => {
    if (!window.speechSynthesis) {
      alert("Speech Synthesis is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.character);
    utterance.lang = "zh-CN";
    // Enforce safety constraints
    utterance.rate = Math.max(0.5, Math.min(2.0, playbackSpeed));
    window.speechSynthesis.speak(utterance);
  };

  const handleCheck = () => {
    const accuracy = calculateToneAccuracy(guess, item.pinyin);
    setToneScore(accuracy);
    setChecked(true);
    
    const isCorrect = accuracy >= 95.0; // scientific threshold for exact correctness
    onLogSession(item.id, isCorrect, playbackSpeed, accuracy);
  };

  const handleNext = () => {
    setGuess("");
    setShowPinyin(false);
    setChecked(false);
    setToneScore(null);
    onNext();
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", marginBottom: "16px", backgroundColor: "#fafafa" }}>
      <h3>2. Pinyin Active Recall Card</h3>
      
      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <div style={{ fontSize: "64px", fontWeight: "bold", color: "#333", marginBottom: "8px" }}>
          {item.character}
        </div>
        
        {showPinyin && (
          <div style={{ fontSize: "24px", color: "#666", fontWeight: "600", transition: "all 0.3s" }}>
            Pinyin: {item.pinyin}
          </div>
        )}
        
        <div style={{ fontSize: "18px", color: "#888", marginTop: "4px" }}>
          Meaning: {item.english}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
        <button onClick={speak} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "4px", border: "1px solid #aaa" }}>
          🔊 Pronounce
        </button>
        <button onClick={() => setShowPinyin(!showPinyin)} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "4px", border: "1px solid #aaa" }}>
          {showPinyin ? "Hide Pinyin" : "Reveal Pinyin"}
        </button>
      </div>

      {!checked ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "300px", margin: "0 auto" }}>
          <label htmlFor="pinyin-guess" style={{ fontWeight: "bold", fontSize: "14px" }}>Guess the Pinyin (with tone marks):</label>
          <input
            id="pinyin-guess"
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="e.g. xuéxí or nǐhǎo"
            style={{ padding: "8px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ccc" }}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />
          <button
            onClick={handleCheck}
            style={{
              padding: "10px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Check Recall
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
          <div style={{ fontSize: "18px", marginBottom: "12px" }}>
            Your guess: <strong>{guess || "(empty)"}</strong>
          </div>
          <div style={{ fontSize: "18px", marginBottom: "12px" }}>
            Correct answer: <strong>{item.pinyin}</strong>
          </div>
          
          {toneScore !== null && (
            <div style={{
              padding: "12px",
              borderRadius: "4px",
              backgroundColor: toneScore >= 95.0 ? "#E8F5E9" : "#FFEBEE",
              color: toneScore >= 95.0 ? "#2E7D32" : "#C62828",
              fontWeight: "bold",
              fontSize: "18px",
              marginBottom: "16px"
            }}>
              Tone Accuracy Score: {toneScore}% 
              {toneScore >= 95.0 ? " (Excellent!)" : " (Keep practicing!)"}
            </div>
          )}

          <button
            onClick={handleNext}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ff9800",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Next Card ➔
          </button>
        </div>
      )}
    </div>
  );
};
