import React, { useState } from "react";

export interface VocabItem {
  id: string;
  character: string;
  pinyin: string;
  english: string;
}

interface VocabularyImportProps {
  onImport: (items: VocabItem[]) => void;
}

export const VocabularyImport: React.FC<VocabularyImportProps> = ({ onImport }) => {
  const [csvText, setCsvText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ total: number; valid: number; invalid: number } | null>(null);

  const parseCSV = (text: string): VocabItem[] => {
    const lines = text.split(/\r?\n/);
    const parsedItems: VocabItem[] = [];
    let validCount = 0;
    let invalidCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle simple CSV splitting (naive splitting, but we can make it handle commas within quotes)
      const parts = line.split(",").map(part => {
        // Remove enclosing quotes
        let cleaned = part.trim();
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
          cleaned = cleaned.substring(1, cleaned.length - 1);
        }
        return cleaned;
      });

      // Ignore header row if it contains 'character'
      if (i === 0 && parts[0].toLowerCase().includes("character")) {
        continue;
      }

      if (parts.length >= 3 && parts[0] && parts[1] && parts[2]) {
        parsedItems.push({
          id: Math.random().toString(36).substring(2, 11),
          character: parts[0],
          pinyin: parts[1],
          english: parts[2]
        });
        validCount++;
      } else {
        invalidCount++;
      }
    }

    setStats({ total: lines.length, valid: validCount, invalid: invalidCount });
    return parsedItems;
  };

  const handleImport = () => {
    setError(null);
    setStats(null);
    if (!csvText.trim()) {
      setError("Please paste CSV content first.");
      return;
    }

    try {
      const parsed = parseCSV(csvText);
      if (parsed.length === 0) {
        setError("No valid vocabulary rows found in the CSV. Make sure you have at least one row with 'character,pinyin,english'.");
        return;
      }
      onImport(parsed);
    } catch (e: any) {
      setError(`Parsing error: ${e.message}`);
    }
  };

  const loadDefaultHSK = () => {
    const defaultCSV = `character,pinyin,english
学习,xuéxí,to study
你好,nǐhǎo,hello
谢谢,xièxie,thank you
再见,zàijiàn,goodbye
苹果,píngguǒ,apple
电脑,diànnǎo,computer`;
    setCsvText(defaultCSV);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
      <h3>1. CSV Vocabulary Import</h3>
      <p style={{ fontSize: "14px", color: "#666" }}>
        Paste your comma-separated vocabulary list here. Format: <code>character,pinyin,english</code>
      </p>
      
      <div style={{ marginBottom: "8px" }}>
        <button 
          onClick={loadDefaultHSK} 
          style={{ marginRight: "8px", padding: "6px 12px", cursor: "pointer" }}
        >
          Load Default HSK Vocabulary
        </button>
      </div>

      <textarea
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
        placeholder="学习,xuéxí,to study&#10;你好,nǐhǎo,hello"
        rows={6}
        style={{ width: "100%", padding: "8px", boxSizing: "border-box", fontFamily: "monospace" }}
      />
      
      {error && <div style={{ color: "red", marginTop: "8px", fontSize: "14px" }}>{error}</div>}
      
      {stats && (
        <div style={{ color: "green", marginTop: "8px", fontSize: "14px" }}>
          Success! Parsed {stats.valid} valid records (skipped {stats.invalid} invalid rows).
        </div>
      )}

      <button
        onClick={handleImport}
        style={{
          marginTop: "12px",
          padding: "8px 16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Import to Flashcard Deck
      </button>
    </div>
  );
};
