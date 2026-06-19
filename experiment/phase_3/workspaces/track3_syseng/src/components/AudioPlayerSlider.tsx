import React, { useState } from 'react';

interface AudioPlayerSliderProps {
  text: string;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

export const AudioPlayerSlider: React.FC<AudioPlayerSliderProps> = ({
  text,
  playbackSpeed,
  setPlaybackSpeed,
}) => {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Play using Client-side Speech Synthesis
  const playLocalTts = () => {
    setError(null);
    if (!('speechSynthesis' in window)) {
      setError('Web Speech API is not supported in this browser.');
      return;
    }

    try {
      window.speechSynthesis.cancel(); // cancel any active speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      
      // Defensive Clamp: client-side speed clamp
      const clampedSpeed = Math.min(2.0, Math.max(0.5, playbackSpeed));
      utterance.rate = clampedSpeed;

      utterance.onstart = () => setPlaying(true);
      utterance.onend = () => setPlaying(false);
      utterance.onerror = (e) => {
        console.error('TTS error:', e);
        setError(`Local playback error: ${e.error}`);
        setPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      setError(`Local playback failed: ${err.message}`);
    }
  };

  // Play using Server-side synthesized audio
  const playServerAudio = async () => {
    setError(null);
    setPlaying(true);

    try {
      // Defensive Clamp: clamp parameter before request
      const clampedSpeed = Math.min(2.0, Math.max(0.5, playbackSpeed));
      const url = `/api/audio?text=${encodeURIComponent(text)}&speed=${clampedSpeed}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned status ${response.status}`);
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (e) => {
        console.error('Audio element error:', e);
        setError('Failed to play the synthesized audio file.');
        setPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (err: any) {
      setError(err.message || 'Server audio playback failed.');
      setPlaying(false);
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseFloat(e.target.value);
    if (!isNaN(rawVal)) {
      // Keep inside bounds
      const bounded = Math.min(2.0, Math.max(0.5, rawVal));
      setPlaybackSpeed(bounded);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      {/* Speed Slider Control */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
          <label htmlFor="playback-speed-slider">Playback Speed</label>
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">
            {playbackSpeed.toFixed(1)}x
          </span>
        </div>
        <input
          id="playback-speed-slider"
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={playbackSpeed}
          onChange={handleSpeedChange}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>0.5x (Slow)</span>
          <span>1.0x (Normal)</span>
          <span>2.0x (Fast)</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={playLocalTts}
          disabled={playing}
          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium py-1.5 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9H4.5a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h3.25L12 18.75z" />
          </svg>
          Local TTS
        </button>

        <button
          type="button"
          onClick={playServerAudio}
          disabled={playing}
          className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-medium py-1.5 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Server Wave
        </button>
      </div>

      {error && (
        <div className="p-2 bg-red-50 text-red-700 text-xs rounded border border-red-150">
          {error}
        </div>
      )}
    </div>
  );
};
