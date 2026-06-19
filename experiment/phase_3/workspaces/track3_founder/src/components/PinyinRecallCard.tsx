import React, { useState, useEffect } from 'react';

interface VocabItem {
  id: string;
  characters: string;
  pinyin: string;
  english: string;
}

interface CardProgress {
  reviews: number;
  correct: number;
}

interface PinyinRecallCardProps {
  vocab: VocabItem | null;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalCards: number;
  renderAudioPlayer: (text: string) => React.ReactNode;
}

export const PinyinRecallCard: React.FC<PinyinRecallCardProps> = ({
  vocab,
  onNext,
  onPrev,
  currentIndex,
  totalCards,
  renderAudioPlayer
}) => {
  const [showPinyin, setShowPinyin] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(true);
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});

  // Sync state or reset show settings when card changes
  useEffect(() => {
    // Keep pinyin visible by default to prevent tone confusion / cognitive friction as per Founder guidelines
    setShowPinyin(true);
    setShowEnglish(true);
  }, [vocab]);

  if (!vocab) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100 flex flex-col justify-center items-center h-80">
        <p className="text-gray-500 text-lg">No vocabulary loaded.</p>
        <p className="text-gray-400 text-sm mt-1">Import a CSV deck or reset to default words to begin.</p>
      </div>
    );
  }

  const cardStats = progress[vocab.id] || { reviews: 0, correct: 0 };

  const handleFeedback = (isCorrect: boolean) => {
    setProgress(prev => {
      const currentStats = prev[vocab.id] || { reviews: 0, correct: 0 };
      return {
        ...prev,
        [vocab.id]: {
          reviews: currentStats.reviews + 1,
          correct: currentStats.correct + (isCorrect ? 1 : 0)
        }
      };
    });
    // Autoplay or advance to next card after a small delay
    setTimeout(() => {
      onNext();
    }, 400);
  };

  const accuracy = cardStats.reviews > 0 
    ? Math.round((cardStats.correct / cardStats.reviews) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col justify-between h-[28rem]">
      {/* Header index info */}
      <div className="flex justify-between items-center text-xs text-gray-400 font-semibold">
        <span>CARD {currentIndex + 1} OF {totalCards}</span>
        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-mono">
          Reviews: {cardStats.reviews} | Acc: {accuracy}%
        </span>
      </div>

      {/* Main characters and Pinyin recall space */}
      <div className="flex-grow flex flex-col justify-center items-center my-6 space-y-4">
        {/* Chinese Characters */}
        <h1 className="text-6xl font-extrabold text-gray-900 tracking-wide select-all">
          {vocab.characters}
        </h1>

        {/* Audio Slider Player slot */}
        <div className="w-full max-w-xs pt-2">
          {renderAudioPlayer(vocab.characters)}
        </div>

        {/* Pronunciation & Tone Display (Avoids Cognitive Friction) */}
        <div className="h-12 flex items-center justify-center">
          {showPinyin ? (
            <p className="text-2xl font-semibold text-indigo-600 tracking-wide bg-indigo-50 px-4 py-1.5 rounded-lg border border-indigo-100">
              {vocab.pinyin}
            </p>
          ) : (
            <button
              onClick={() => setShowPinyin(true)}
              className="text-sm font-medium text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-1.5 rounded-lg border border-indigo-100 border-dashed transition-all"
            >
              Reveal Pinyin Pronunciation
            </button>
          )}
        </div>

        {/* English Definition */}
        <div className="h-12 flex items-center justify-center">
          {showEnglish ? (
            <p className="text-gray-600 text-center text-lg max-w-sm">
              {vocab.english}
            </p>
          ) : (
            <button
              onClick={() => setShowEnglish(true)}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 px-4 py-1.5 rounded-lg border border-dashed transition-all"
            >
              Reveal Meaning
            </button>
          )}
        </div>
      </div>

      {/* Control Actions & SRS Feedbacks */}
      <div className="space-y-4">
        {/* Toggle options */}
        <div className="flex justify-center space-x-6 text-xs font-semibold text-gray-500">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPinyin}
              onChange={(e) => setShowPinyin(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Pinyin Visible</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showEnglish}
              onChange={(e) => setShowEnglish(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Definition Visible</span>
          </label>
        </div>

        {/* Navigation / Feedback buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleFeedback(false)}
            className="flex flex-col items-center justify-center py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-semibold border border-red-200 rounded-xl transition-all"
          >
            <span className="text-sm">Need Practice</span>
            <span className="text-[10px] font-normal opacity-85">Mark incorrect</span>
          </button>
          <button
            onClick={() => handleFeedback(true)}
            className="flex flex-col items-center justify-center py-2.5 px-4 bg-green-50 hover:bg-green-100 text-green-700 font-semibold border border-green-200 rounded-xl transition-all"
          >
            <span className="text-sm">Got It Right!</span>
            <span className="text-[10px] font-normal opacity-85">Mark correct</span>
          </button>
        </div>

        {/* Card Switcher navigation */}
        <div className="flex justify-between items-center pt-1 text-sm">
          <button
            onClick={onPrev}
            className="text-gray-600 hover:text-indigo-600 font-semibold flex items-center space-x-1"
          >
            <span>← Previous</span>
          </button>
          <span className="text-gray-400 font-mono text-xs">Accurate tone-anchoring</span>
          <button
            onClick={onNext}
            className="text-gray-600 hover:text-indigo-600 font-semibold flex items-center space-x-1"
          >
            <span>Next →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
