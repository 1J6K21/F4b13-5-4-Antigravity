import React, { useState } from 'react';
import { VocabularyItem, VocabCharacterMapping } from '../types/hanzi';

interface PinyinRecallCardProps {
  item: VocabularyItem;
  learningState?: string;
  onPlayAudio?: (text: string) => void;
  onStateChange?: (itemId: string, newState: 'NEW' | 'RECOGNIZED' | 'ACTIVE_PRODUCTION' | 'MASTERED') => void;
  onReviewRecall?: (itemId: string, score: 'forgot' | 'hard' | 'good' | 'easy') => void;
}

export function detectTone(pinyinChar: string): number {
  if (/[āēīōūǖĀĒĪŌŪǕ]/.test(pinyinChar)) return 1;
  if (/[áéíóúǘÁÉÍÓÚǗ]/.test(pinyinChar)) return 2;
  if (/[ǎěǐǒǔǚǍĚǏǑǓǙ]/.test(pinyinChar)) return 3;
  if (/[àèìòùǜÀÈÌÒÙǛ]/.test(pinyinChar)) return 4;
  return 5; // Neutral
}

export function generateMappingsFallback(hanzi: string, pinyin: string): VocabCharacterMapping[] {
  const syllables = pinyin.trim().split(/\s+/);
  let parts: string[] = [];

  if (syllables.length === hanzi.length) {
    parts = syllables;
  } else {
    // Try regex-based syllable detection
    const regexSyllables = pinyin.match(/[a-zāáǎàēéěèīíǐìōóǒòūúǔùüǖǘǚǜ]+/gi) || [];
    if (regexSyllables.length === hanzi.length) {
      parts = regexSyllables;
    } else {
      // Fallback: first character gets full pinyin, others are blank
      parts = Array.from(hanzi).map((_, idx) => (idx === 0 ? pinyin : ''));
    }
  }

  return Array.from(hanzi).map((char, idx) => {
    const py = parts[idx] || '';
    return {
      sequence_order: idx,
      character: char,
      pinyin: py,
      tone: detectTone(py)
    };
  });
}

export function getToneColorClass(tone: number): string {
  switch (tone) {
    case 1:
      return 'text-rose-500'; // First tone: Flat Red
    case 2:
      return 'text-emerald-500'; // Second tone: Rising Green
    case 3:
      return 'text-sky-500'; // Third tone: Dipping Blue
    case 4:
      return 'text-purple-500'; // Fourth tone: Falling Purple
    default:
      return 'text-slate-400'; // Neutral tone: Gray
  }
}

export const PinyinRecallCard: React.FC<PinyinRecallCardProps> = ({
  item,
  learningState = 'NEW',
  onPlayAudio,
  onStateChange,
  onReviewRecall
}) => {
  const [showPinyin, setShowPinyin] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  const mappings = item.character_mappings && item.character_mappings.length > 0
    ? item.character_mappings
    : generateMappingsFallback(item.hanzi, item.pinyin);

  const getToneName = (tone: number): string => {
    switch (tone) {
      case 1: return '1st Tone (Flat)';
      case 2: return '2nd Tone (Rising)';
      case 3: return '3rd Tone (Dipping)';
      case 4: return '4th Tone (Falling)';
      default: return '5th Tone (Neutral)';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between min-h-[300px] w-full max-w-sm mx-auto hover:border-slate-700 transition-all text-slate-100">
      {/* Card Header: SRS Learning State & Quick Toggles */}
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Learning State</span>
          <select
            value={learningState}
            onChange={(e) => onStateChange?.(item.id, e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1 text-indigo-400 font-semibold focus:outline-none focus:border-indigo-500"
          >
            <option value="NEW">New</option>
            <option value="RECOGNIZED">Recognized</option>
            <option value="ACTIVE_PRODUCTION">Active Pro</option>
            <option value="MASTERED">Mastered</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPinyin(!showPinyin)}
            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
              showPinyin ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
            title="Toggle Pinyin visibility"
          >
            {showPinyin ? 'Pinyin On' : 'Pinyin Off'}
          </button>
          <button
            onClick={() => setShowEnglish(!showEnglish)}
            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
              showEnglish ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
            title="Toggle Definition visibility"
          >
            {showEnglish ? 'Def On' : 'Def Off'}
          </button>
        </div>
      </div>

      {/* Main Flashcard Body */}
      <div className="flex-grow flex flex-col justify-center items-center py-4">
        {/* Character-Pinyin Alignment Grid */}
        <div className="flex flex-row justify-center items-end gap-4 mb-4">
          {mappings.map((mapping, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              {/* Pinyin above character, color-coded */}
              <span
                className={`text-sm font-semibold tracking-wide transition-opacity duration-300 h-6 ${
                  showPinyin ? 'opacity-100' : 'opacity-0 select-none'
                } ${getToneColorClass(mapping.tone)}`}
                title={getToneName(mapping.tone)}
              >
                {mapping.pinyin}
              </span>
              
              {/* Large Hanzi character */}
              <span className="text-5xl font-bold font-serif text-slate-50 mt-1 select-all hover:scale-105 transition-transform duration-200">
                {mapping.character}
              </span>

              {/* Tone marker bar */}
              <div
                className={`w-6 h-1 mt-2 rounded-full ${
                  mapping.tone === 1 ? 'bg-rose-500' :
                  mapping.tone === 2 ? 'bg-emerald-500' :
                  mapping.tone === 3 ? 'bg-sky-500' :
                  mapping.tone === 4 ? 'bg-purple-500' : 'bg-slate-600'
                }`}
                title={getToneName(mapping.tone)}
              />
            </div>
          ))}
        </div>

        {/* Audio Synthesis Trigger */}
        <div className="mt-2">
          <button
            onClick={() => onPlayAudio?.(item.hanzi)}
            className="p-2 bg-slate-800 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-800 rounded-full text-indigo-400 hover:text-indigo-300 active:scale-95 transition-all shadow-md"
            title="Listen to pronunciation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
        </div>

        {/* Semantic Definition */}
        <div className="mt-6 text-center w-full min-h-[40px] px-4">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">English Definition</div>
          {showEnglish ? (
            <p className="text-slate-200 font-medium text-sm line-clamp-2" title={item.english}>
              {item.english}
            </p>
          ) : (
            <button
              onClick={() => setShowEnglish(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              Reveal meaning
            </button>
          )}
        </div>
      </div>

      {/* Card Footer: SRS Recall Scoring buttons */}
      {onReviewRecall && (
        <div className="mt-4 border-t border-slate-800 pt-3">
          <span className="text-[10px] text-center block text-slate-500 mb-2 font-medium">Rate Recall Accuracy</span>
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => onReviewRecall(item.id, 'forgot')}
              className="py-1 px-1 bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-900 rounded text-[11px] font-semibold transition-colors active:scale-95"
            >
              Forgot
            </button>
            <button
              onClick={() => onReviewRecall(item.id, 'hard')}
              className="py-1 px-1 bg-amber-950/20 hover:bg-amber-900/40 text-amber-400 border border-amber-900 rounded text-[11px] font-semibold transition-colors active:scale-95"
            >
              Hard
            </button>
            <button
              onClick={() => onReviewRecall(item.id, 'good')}
              className="py-1 px-1 bg-sky-950/20 hover:bg-sky-900/40 text-sky-400 border border-sky-900 rounded text-[11px] font-semibold transition-colors active:scale-95"
            >
              Good
            </button>
            <button
              onClick={() => onReviewRecall(item.id, 'easy')}
              className="py-1 px-1 bg-emerald-950/20 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-900 rounded text-[11px] font-semibold transition-colors active:scale-95"
            >
              Easy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
