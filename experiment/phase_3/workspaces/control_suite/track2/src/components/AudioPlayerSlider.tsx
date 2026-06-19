import React, { useState, useEffect, useRef } from 'react';

interface AudioPlayerSliderProps {
  initialText?: string;
  isPremium?: boolean;
  onPlayStart?: (text: string) => void;
}

export const AudioPlayerSlider: React.FC<AudioPlayerSliderProps> = ({
  initialText = '欢迎使用 HanziFlow 学习中文！',
  isPremium = false,
  onPlayStart
}) => {
  const [text, setText] = useState(initialText);
  const [speed, setSpeed] = useState(1.0);
  const [accent, setAccent] = useState<'CN' | 'TW'>('CN');
  const [engine, setEngine] = useState<'browser' | 'premium'>('browser');
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize SpeechSynthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const list = window.speechSynthesis.getVoices();
        const zhVoices = list.filter(v => v.lang.toLowerCase().includes('zh') || v.lang.toLowerCase().includes('cmn'));
        setVoices(zhVoices);
        if (zhVoices.length > 0 && !selectedVoiceName) {
          // Select default CN voice
          const defCn = zhVoices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith('zh-cn')) || zhVoices[0];
          setSelectedVoiceName(defCn.name);
        }
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedVoiceName]);

  const handleStop = () => {
    if (engine === 'browser') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
    setIsPlaying(false);
  };

  const handlePlay = async () => {
    if (!text.trim()) return;
    setErrorMsg(null);
    handleStop(); // Stop current playback

    onPlayStart?.(text);

    if (engine === 'browser') {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setErrorMsg('Web Speech API is not supported in this browser.');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speed;

      // Match voice based on accent selection or manually selected voice
      const targetLangMatch = accent === 'TW' ? 'zh-tw' : 'zh-cn';
      const systemVoices = window.speechSynthesis.getVoices();
      
      let voice = systemVoices.find(v => v.name === selectedVoiceName);
      if (!voice) {
        voice = systemVoices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(targetLangMatch))
                || systemVoices.find(v => v.lang.toLowerCase().includes('zh'))
                || systemVoices[0];
      }

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = (e) => {
        console.error('SpeechSynthesisUtterance error:', e);
        setErrorMsg('Browser speech synthesis encountered an error.');
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Premium Engine: Fetch from Node Express server stream
      setIsPlaying(true);
      try {
        const queryParams = new URLSearchParams({
          character: text,
          speed: speed.toFixed(2),
          accent: accent
        });
        const url = `/api/v1/audio/retrieve?${queryParams.toString()}`;

        const audio = new Audio(url);
        audioRef.current = audio;
        
        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          setErrorMsg('Failed to play neural audio from server. Falling back to browser audio...');
          setIsPlaying(false);
          // Auto fallback to browser
          setEngine('browser');
        };

        await audio.play();
      } catch (err: any) {
        setErrorMsg('Premium voice backend service is unavailable.');
        setIsPlaying(false);
      }
    }
  };

  // Speed presets
  const speeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl text-slate-100 max-w-lg mx-auto">
      <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-3 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
        Web Speech & Neural Audio Controller
      </h3>

      <div className="space-y-4">
        {/* Text Input area */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Text to Pronounce
          </label>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter Chinese characters..."
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 pr-10 resize-none"
            />
            {text && (
              <button
                onClick={() => setText('')}
                className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                title="Clear text"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Engine and Accent Selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Audio Engine
            </label>
            <div className="flex bg-slate-800 rounded p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setEngine('browser')}
                className={`flex-1 text-center py-1 text-xs rounded font-medium transition-all ${
                  engine === 'browser' ? 'bg-slate-700 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Browser TTS
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isPremium) {
                    setEngine('premium');
                  } else {
                    setErrorMsg('Custom neural voice streams require a Premium subscription.');
                  }
                }}
                className={`flex-1 text-center py-1 text-xs rounded font-medium transition-all relative ${
                  engine === 'premium'
                    ? 'bg-indigo-600 text-slate-100 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Neural TTS
                {!isPremium && (
                  <span className="absolute -top-1.5 -right-1 bg-yellow-500 text-slate-950 font-extrabold text-[8px] px-1 rounded-full scale-90">
                    PRO
                  </span>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Regional Accent
            </label>
            <div className="flex bg-slate-800 rounded p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setAccent('CN')}
                className={`flex-1 text-center py-1 text-xs rounded font-medium transition-all ${
                  accent === 'CN' ? 'bg-slate-700 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Beijing (CN)
              </button>
              <button
                type="button"
                onClick={() => setAccent('TW')}
                className={`flex-1 text-center py-1 text-xs rounded font-medium transition-all ${
                  accent === 'TW' ? 'bg-slate-700 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Taiwan (TW)
              </button>
            </div>
          </div>
        </div>

        {/* Browser specific voice selection */}
        {engine === 'browser' && voices.length > 0 && (
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Select Browser Voice
            </label>
            <select
              value={selectedVoiceName}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Playback Speed Slider & Presets */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Playback Speed
            </label>
            <span className="text-xs font-mono font-bold text-indigo-400">{speed.toFixed(2)}x</span>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.25"
              max="2.0"
              step="0.05"
              value={speed}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (val !== 1.0 && !isPremium) {
                  setErrorMsg('Custom speeds (excluding 1.0x) require Premium Tier subscription.');
                  setSpeed(1.0);
                  return;
                }
                setSpeed(val);
              }}
              className="flex-grow accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex justify-between mt-2">
            {speeds.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  if (s !== 1.0 && !isPremium) {
                    setErrorMsg('Custom speeds require Premium Tier subscription.');
                    setSpeed(1.0);
                    return;
                  }
                  setSpeed(s);
                }}
                className={`px-1.5 py-0.5 text-[10px] rounded transition-colors ${
                  speed === s
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {s.toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        {/* Warning messages */}
        {errorMsg && (
          <div className="bg-rose-950/30 border border-rose-900 text-rose-300 px-3 py-2 rounded text-xs flex justify-between items-center">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-200 font-bold ml-2">
              ✕
            </button>
          </div>
        )}

        {/* Player controls */}
        <div className="flex gap-2 items-center pt-2 border-t border-slate-800 justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePlay}
              className={`flex items-center gap-1.5 px-4 py-2 rounded font-bold text-xs shadow-md transition-all active:scale-95 ${
                isPlaying
                  ? 'bg-indigo-700 text-indigo-100 hover:bg-indigo-600'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                  Replay
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Speak Text
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleStop}
              disabled={!isPlaying}
              className={`flex items-center gap-1.5 px-3 py-2 rounded font-bold text-xs border border-slate-700 transition-all ${
                isPlaying
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100'
                  : 'bg-slate-900 text-slate-600 cursor-not-allowed border-slate-800'
              }`}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
              Stop
            </button>
          </div>

          <div className="text-[10px] text-slate-500 font-medium">
            {isPlaying && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Playing...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
