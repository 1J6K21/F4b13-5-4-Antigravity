import React from "react";

interface AudioPlayerSliderProps {
  speed: number;
  onSpeedChange: (newSpeed: number) => void;
}

export const AudioPlayerSlider: React.FC<AudioPlayerSliderProps> = ({ speed, onSpeedChange }) => {
  // Enforce the safe scientific limits [0.5, 2.0]
  const MIN_SPEED = 0.5;
  const MAX_SPEED = 2.0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseFloat(e.target.value);
    // Boundary assertion check
    const clampedVal = Math.max(MIN_SPEED, Math.min(MAX_SPEED, rawVal));
    onSpeedChange(parseFloat(clampedVal.toFixed(1)));
  };

  const getSpeedClassification = (val: number): string => {
    if (val < 0.5) return "Invalid (Dangerous Distortion)";
    if (val >= 0.5 && val < 0.8) return "Slow-Tempo (Optimal for Tone Mapping & Auditory Processing)";
    if (val >= 0.8 && val <= 1.2) return "Normal Conversational Speed";
    if (val > 1.2 && val <= 2.0) return "Fast-Tempo (Optimal for Auditory Working Memory Training)";
    return "Invalid (Dangerous Distortion)";
  };

  const testPronunciation = () => {
    if (!window.speechSynthesis) {
      alert("Speech Synthesis is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("欢迎使用 HanziFlow");
    utterance.lang = "zh-CN";
    utterance.rate = speed;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
      <h3>3. Audio Player Speed Control</h3>
      <p style={{ fontSize: "14px", color: "#666" }}>
        Adjust the pronunciation speed. Speed boundaries are strictly constrained between <strong>{MIN_SPEED}x</strong> and <strong>{MAX_SPEED}x</strong> to prevent voice distortion.
      </p>

      <div style={{ margin: "20px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label htmlFor="speed-slider" style={{ fontWeight: "bold" }}>Playback Speed: {speed}x</label>
          <span style={{
            fontSize: "12px",
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: speed < 0.8 ? "#FFF3E0" : speed <= 1.2 ? "#E8F5E9" : "#E3F2FD",
            color: speed < 0.8 ? "#E65100" : speed <= 1.2 ? "#1B5E20" : "#0D47A1",
            fontWeight: "bold"
          }}>
            {getSpeedClassification(speed)}
          </span>
        </div>

        <input
          id="speed-slider"
          type="range"
          min={MIN_SPEED}
          max={MAX_SPEED}
          step="0.1"
          value={speed}
          onChange={handleSliderChange}
          style={{
            width: "100%",
            accentColor: "#2196F3",
            cursor: "pointer"
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
          <span>{MIN_SPEED}x (Min Boundary)</span>
          <span>1.0x (Standard)</span>
          <span>{MAX_SPEED}x (Max Boundary)</span>
        </div>
      </div>

      <button
        onClick={testPronunciation}
        style={{
          padding: "8px 16px",
          backgroundColor: "#9C27B0",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        🔊 Test Speech Speed
      </button>
    </div>
  );
};
