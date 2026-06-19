import React, { useState } from 'react';

interface AudioPlayerSliderProps {
  text: string;
}

export const AudioPlayerSlider: React.FC<AudioPlayerSliderProps> = ({ text }) => {
  const [speed, setSpeed] = useState<number>(1.0);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSpeed(value);
    setError(null);
  };

  const playAudio = async () => {
    setError(null);
    setStatus('Contacting backend for audio validation...');

    try {
      // 1. Call Express backend to retrieve audio configuration and check speed constraints
      const response = await fetch(
        `http://localhost:3001/api/audio?text=${encodeURIComponent(text)}&speed=${speed}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server validation failed');
      }

      setStatus('Playing audio (Web Speech API)...');

      // 2. Play using local Web Speech API SpeechSynthesis
      if ('speechSynthesis' in window) {
        // Cancel any currently playing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = speed; // Bound by 0.25x - 2.0x

        // Try to find a Chinese voice
        const voices = window.speechSynthesis.getVoices();
        const zhVoice = voices.find(v => v.lang.startsWith('zh'));
        if (zhVoice) {
          utterance.voice = zhVoice;
        } else {
          utterance.lang = 'zh-CN';
        }

        utterance.onend = () => setStatus('');
        utterance.onerror = (e) => {
          console.error(e);
          setStatus('');
          setError('Speech synthesis failed to complete.');
        };

        window.speechSynthesis.speak(utterance);
      } else {
        throw new Error('Web Speech API (SpeechSynthesis) not supported in this browser.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during playback.');
      setStatus('');
    }
  };

  return (
    <div style={{ padding: '10px 0', borderTop: '1px solid #eee', marginTop: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
        <button
          onClick={playAudio}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔊 Play Audio
        </button>

        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '2px' }}>
            Speed: <strong>{speed.toFixed(2)}x</strong> (Limit: 0.25x - 2.0x)
          </label>
          <input
            type="range"
            min="0.25"
            max="2.0"
            step="0.05"
            value={speed}
            onChange={handleSpeedChange}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
      </div>

      {status && <div style={{ fontSize: '0.85rem', color: '#007bff' }}>{status}</div>}
      {error && <div style={{ fontSize: '0.85rem', color: '#d9534f', fontWeight: 'bold' }}>{error}</div>}
    </div>
  );
};
