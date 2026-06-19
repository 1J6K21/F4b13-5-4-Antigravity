import React, { useState } from "react";
import { VocabularyImport, VocabItem } from "./components/VocabularyImport";
import { PinyinRecallCard } from "./components/PinyinRecallCard";
import { AudioPlayerSlider } from "./components/AudioPlayerSlider";
import { JournalFeedback } from "./components/JournalFeedback";

interface SessionLog {
  id: string;
  timestamp: string;
  character: string;
  isCorrect: boolean;
  speedSetting: number;
  toneAccuracy: number;
}

export const App: React.FC = () => {
  const [vocabDeck, setVocabDeck] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);

  // Backend URL - defaults to local express server
  const BACKEND_URL = "http://localhost:5001";

  const handleImport = (newItems: VocabItem[]) => {
    setVocabDeck(newItems);
    setCurrentIndex(0);
  };

  const handleNextCard = () => {
    if (vocabDeck.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % vocabDeck.length);
  };

  const handleLogSession = (vocabId: string, isCorrect: boolean, speedSetting: number, toneAccuracy: number) => {
    const vocab = vocabDeck.find((v) => v.id === vocabId);
    if (!vocab) return;

    const newLog: SessionLog = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toLocaleTimeString(),
      character: vocab.character,
      isCorrect,
      speedSetting,
      toneAccuracy
    };
    setSessionLogs((prev) => [newLog, ...prev]);
  };

  // Statistical Metrics
  const totalAttempts = sessionLogs.length;
  const correctAttempts = sessionLogs.filter((log) => log.isCorrect).length;
  const successRate = totalAttempts > 0 ? ((correctAttempts / totalAttempts) * 100).toFixed(1) : "0.0";
  const averageAccuracy =
    totalAttempts > 0
      ? (sessionLogs.reduce((sum, log) => sum + log.toneAccuracy, 0) / totalAttempts).toFixed(1)
      : "0.0";

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <header style={{ borderBottom: "3px solid #3f51b5", paddingBottom: "10px", marginBottom: "20px" }}>
        <h1 style={{ margin: "0", color: "#3f51b5" }}>HanziFlow</h1>
        <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
          Scientifically Optimized Chinese Vocabulary studying & journaling system (Scientist OS Edition).
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
        
        {/* Step 1: Import */}
        <VocabularyImport onImport={handleImport} />

        {/* Step 2: Global Configuration */}
        <AudioPlayerSlider speed={playbackSpeed} onSpeedChange={setPlaybackSpeed} />

        {/* Step 3: Active Recall Card */}
        {vocabDeck.length > 0 ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#666" }}>
              <span>Card {currentIndex + 1} of {vocabDeck.length}</span>
              <span>Deck Active: {vocabDeck.map(v => v.character).join(", ")}</span>
            </div>
            <PinyinRecallCard
              item={vocabDeck[currentIndex]}
              onNext={handleNextCard}
              playbackSpeed={playbackSpeed}
              onLogSession={handleLogSession}
            />
          </div>
        ) : (
          <div style={{ border: "1px dashed #ccc", padding: "30px", borderRadius: "8px", textAlign: "center", color: "#888" }}>
            <h3>No cards loaded</h3>
            <p>Please paste or load the HSK vocabulary deck above to start studying.</p>
          </div>
        )}

        {/* Step 4: Journaling Feedback */}
        <JournalFeedback vocabDeck={vocabDeck} backendUrl={BACKEND_URL} />

        {/* Step 5: Statistical logs */}
        <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px", backgroundColor: "#fcfcfc" }}>
          <h3>Scientist OS Session Analytics</h3>
          <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
            <div style={{ flex: 1, backgroundColor: "#E3F2FD", padding: "12px", borderRadius: "4px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0D47A1" }}>{totalAttempts}</div>
              <div style={{ fontSize: "12px", color: "#546E7A" }}>Total Practice Sessions</div>
            </div>
            <div style={{ flex: 1, backgroundColor: "#E8F5E9", padding: "12px", borderRadius: "4px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2E7D32" }}>{successRate}%</div>
              <div style={{ fontSize: "12px", color: "#546E7A" }}>Success Rate (≥95%)</div>
            </div>
            <div style={{ flex: 1, backgroundColor: "#FFFDE7", padding: "12px", borderRadius: "4px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#F57F17" }}>{averageAccuracy}%</div>
              <div style={{ fontSize: "12px", color: "#546E7A" }}>Average Tone Accuracy</div>
            </div>
          </div>

          <h4>Session Recall Log</h4>
          {sessionLogs.length > 0 ? (
            <div style={{ maxHeight: "200px", overflowY: "auto", fontSize: "14px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                    <th style={{ padding: "4px" }}>Time</th>
                    <th style={{ padding: "4px" }}>Word</th>
                    <th style={{ padding: "4px" }}>Accuracy</th>
                    <th style={{ padding: "4px" }}>Speed</th>
                    <th style={{ padding: "4px" }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "4px" }}>{log.timestamp}</td>
                      <td style={{ padding: "4px" }}>{log.character}</td>
                      <td style={{ padding: "4px" }}>{log.toneAccuracy}%</td>
                      <td style={{ padding: "4px" }}>{log.speedSetting}x</td>
                      <td style={{ padding: "4px", color: log.isCorrect ? "green" : "red", fontWeight: "bold" }}>
                        {log.isCorrect ? "PASS" : "FAIL"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "#999", fontSize: "14px" }}>No logs recorded yet. Complete some recall cards to generate stats.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
