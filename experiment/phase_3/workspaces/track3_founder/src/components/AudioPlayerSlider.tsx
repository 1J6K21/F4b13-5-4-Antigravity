import React, { useState } from 'react';

interface AudioPlayerSliderProps {
  text: string;
}

export const AudioPlayerSlider: React.FC<AudioPlayerSliderProps> = ({ text }) => {
  const [speed, setSpeed] = useState<number>(1.0);
  const [serverValidation, setServerValidation] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ status: 'idle' });

  const handleSpeak = () => {
    if (!text) return;
    
    // Stop any speech that is currently playing
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a Chinese voice if possible
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(voice => voice.lang.includes('zh') || voice.lang.includes('CN') || voice.lang.includes('TW'));
    if (zhVoice) {
      utterance.voice = zhVoice;
    }
    
    utterance.lang = 'zh-CN';
    
    // Set speed within verified browser boundary (0.5 to 2.0)
    utterance.rate = speed;
    
    window.speechSynthesis.speak(utterance);
  };

  const handleServerValidation = async () => {
    setServerValidation({ status: 'loading' });
    try {
      const response = await fetch(`http://localhost:5001/api/audio/tts?text=${encodeURIComponent(text)}&speed=${speed}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setServerValidation({
          status: 'success',
          message: `Server Verified! Speed multiplier: ${data.speed}x`
        });
      } else {
        setServerValidation({
          status: 'error',
          message: data.error || 'Server validation failed.'
        });
      }
    } catch (err) {
      setServerValidation({
        status: 'error',
        message: 'Unable to connect to server for validation.'
      });
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm space-y-3">
      {/* Playback Button & Speech Action */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleSpeak}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-3 rounded-lg shadow-sm flex items-center justify-center space-x-2 text-sm transition-colors"
          title="Play native text-to-speech pronunciation"
        >
          {/* SVG Play Icon */}
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Pronounce</span>
        </button>

        <button
          onClick={handleServerValidation}
          className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-medium py-2 px-3 rounded-lg text-sm transition-colors"
          title="Send settings to Express backend for range-limit testing"
        >
          Verify Range
        </button>
      </div>

      {/* Speed Slider Control */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
          <span>Playback Speed</span>
          <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-mono text-[11px]">
            {speed.toFixed(1)}x
          </span>
        </div>
        
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          style={{ accentColor: '#4f46e5' }} // Brand-consistent form accent color (from modern web guidelines)
          className="w-full cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
        />
        
        <div className="flex justify-between text-[10px] text-gray-400 font-mono px-1">
          <span>0.5x (Slow)</span>
          <span>1.0x (Normal)</span>
          <span>2.0x (Fast)</span>
        </div>
      </div>

      {/* Validation status badge */}
      {serverValidation.status !== 'idle' && (
        <div className={`text-xs p-2 rounded-lg border text-center transition-all ${
          serverValidation.status === 'loading' ? 'bg-gray-100 border-gray-200 text-gray-600 animate-pulse' :
          serverValidation.status === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
          'bg-red-50 border-red-200 text-red-700'
        }`}>
          {serverValidation.status === 'loading' && 'Checking speed validation constraints...'}
          {serverValidation.status === 'success' && serverValidation.message}
          {serverValidation.status === 'error' && (
            <span><strong>Error:</strong> {serverValidation.message}</span>
          )}
        </div>
      )}
    </div>
  );
};
