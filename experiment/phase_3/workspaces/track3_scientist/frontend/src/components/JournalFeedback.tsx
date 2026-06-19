import React, { useState } from "react";
import { VocabItem } from "./VocabularyImport";

interface JournalFeedbackProps {
  vocabDeck: VocabItem[];
  backendUrl: string;
}

interface EvaluationResult {
  character: string;
  expectedPinyin: string;
  detectedPinyin: string;
  toneScore: number;
  isCorrect: boolean;
}

export const JournalFeedback: React.FC<JournalFeedbackProps> = ({ vocabDeck, backendUrl }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Results from Backend
  const [scrubbedText, setScrubbedText] = useState<string>("");
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [recallRate, setRecallRate] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Please write some journal content before submitting.");
      return;
    }
    if (vocabDeck.length === 0) {
      setError("Please import some vocabulary first so we can analyze recall.");
      return;
    }

    setLoading(true);
    setError(null);
    setScrubbedText("");
    setEvaluations([]);
    setRecallRate(null);

    try {
      const response = await fetch(`${backendUrl}/api/journal/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: content,
          targetVocab: vocabDeck.map(v => ({
            character: v.character,
            pinyin: v.pinyin
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setScrubbedText(data.scrubbedContent);
        setEvaluations(data.evaluation);
        setRecallRate(data.metrics.recallRate);
      } else {
        setError(data.error || "An error occurred during submission.");
      }
    } catch (e: any) {
      setError(`Failed to connect to backend review API: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
      <h3>4. Vocab Journal & Recall Feedback</h3>
      <p style={{ fontSize: "14px", color: "#666" }}>
        Write your daily journal entry here. Use your active vocabulary (e.g. write sentences containing the characters like 学习).
        Our system will automatically strip personal identifiers (emails, names) and assess your pronunciation/spelling recall.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
        <label htmlFor="journal-textarea" style={{ fontWeight: "bold" }}>Write Journal Entry (in Chinese, Pinyin, or mixed):</label>
        <textarea
          id="journal-textarea"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="e.g. 今天我学习中文。 My friend John Doe said hi to me at john.doe@email.com."
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#E91E63",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? "Analyzing recall..." : "Submit Journal & Assess Recall"}
      </button>

      {error && <div style={{ color: "red", marginTop: "8px", fontSize: "14px" }}>{error}</div>}

      {scrubbedText && (
        <div style={{ marginTop: "20px", borderTop: "1px dashed #ccc", paddingTop: "16px" }}>
          <h4 style={{ color: "#2E7D32" }}>Safe (PII Scrubbed) Content Logged:</h4>
          <blockquote style={{
            backgroundColor: "#F5F5F5",
            padding: "12px",
            borderRadius: "4px",
            margin: "8px 0",
            fontStyle: "italic",
            whiteSpace: "pre-wrap"
          }}>
            {scrubbedText}
          </blockquote>
        </div>
      )}

      {recallRate !== null && (
        <div style={{ marginTop: "16px" }}>
          <h4>Active Vocab Recall Rate: {recallRate}%</h4>
          
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "8px" }}>
            <thead>
              <tr style={{ backgroundColor: "#ECEFF1", borderBottom: "2px solid #CFD8DC", textAlign: "left" }}>
                <th style={{ padding: "8px", border: "1px solid #CFD8DC" }}>Character</th>
                <th style={{ padding: "8px", border: "1px solid #CFD8DC" }}>Target Pinyin</th>
                <th style={{ padding: "8px", border: "1px solid #CFD8DC" }}>Detected Pinyin</th>
                <th style={{ padding: "8px", border: "1px solid #CFD8DC" }}>Tone Score</th>
                <th style={{ padding: "8px", border: "1px solid #CFD8DC" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((ev, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #CFD8DC" }}>
                  <td style={{ padding: "8px", border: "1px solid #CFD8DC" }}>{ev.character}</td>
                  <td style={{ padding: "8px", border: "1px solid #CFD8DC" }}>{ev.expectedPinyin}</td>
                  <td style={{ padding: "8px", border: "1px solid #CFD8DC" }}>{ev.detectedPinyin || "(not found)"}</td>
                  <td style={{ padding: "8px", border: "1px solid #CFD8DC" }}>{ev.toneScore}%</td>
                  <td style={{
                    padding: "8px",
                    border: "1px solid #CFD8DC",
                    color: ev.isCorrect ? "green" : "red",
                    fontWeight: "bold"
                  }}>
                    {ev.isCorrect ? "Recalled" : "Failed"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
