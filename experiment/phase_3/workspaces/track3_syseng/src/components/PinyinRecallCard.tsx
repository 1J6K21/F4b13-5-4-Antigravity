import React, { useState, useEffect } from 'react';
import { AudioPlayerSlider } from './AudioPlayerSlider.tsx';

export interface VocabItem {
  id: string;
  character: string;
  pinyin: string;
  translation: string;
  streak: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewAt: string;
}

interface PinyinRecallCardProps {
  vocabItem: VocabItem;
  onAnswerChecked: (vocabId: string, rating: 'easy' | 'medium' | 'hard') => void;
  onNext: () => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

// Utility to remove accents from Pinyin characters for loose validation checks
function stripPinyinAccents(pinyin: string): string {
  return pinyin
    .normalize('NFD') // splits accented chars into base + combining mark
    .replace(/[\u0300-\u036f]/g, '') // removes the combining accent marks
    .toLowerCase()
    .replace(/ü/g, 'u')
    .replace(/v/g, 'u');
}

export const PinyinRecallCard: React.FC<PinyinRecallCardProps> = ({
  vocabItem,
  onAnswerChecked,
  onNext,
  playbackSpeed,
  setPlaybackSpeed,
}) => {
  const [userGuess, setUserGuess] = useState('');
  const [hasChecked, setHasChecked] = useState(false);
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'near' | 'incorrect';
    message: string;
  } | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    // Reset state for new card
    setUserGuess('');
    setHasChecked(false);
    setFeedback(null);
    setShowSolution(false);
  }, [vocabItem]);

  const checkAnswer = () => {
    const guessTrimmed = userGuess.trim().toLowerCase();
    const canonPinyin = vocabItem.pinyin.trim().toLowerCase();
    const canonNoAccents = stripPinyinAccents(canonPinyin);
    const guessNoAccents = stripPinyinAccents(guessTrimmed);

    // Remove spacing/punctuation for flexible matching
    const formatForCompare = (s: string) => s.replace(/[^a-z0-9]/g, '');

    const normalizedCanon = formatForCompare(canonPinyin);
    const normalizedGuess = formatForCompare(guessTrimmed);
    const normalizedCanonNoAccents = formatForCompare(canonNoAccents);
    const normalizedGuessNoAccents = formatForCompare(guessNoAccents);

    if (normalizedGuess === normalizedCanon) {
      setFeedback({
        status: 'correct',
        message: 'Perfect! Correct Pinyin and tones.',
      });
    } else if (normalizedGuessNoAccents === normalizedCanonNoAccents) {
      setFeedback({
        status: 'near',
        message: `Close! The spelling is correct, but check the tones. Correct: "${vocabItem.pinyin}"`,
      });
    } else {
      setFeedback({
        status: 'incorrect',
        message: `Incorrect. Correct Pinyin is "${vocabItem.pinyin}".`,
      });
    }
    setHasChecked(true);
  };

  const handleRatingSelect = (rating: 'easy' | 'medium' | 'hard') => {
    onAnswerChecked(vocabItem.id, rating);
    onNext();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 border border-gray-200 space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Pinyin Recall Card
        </span>
        <span className="text-xs bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded">
          Streak: {vocabItem.streak}
        </span>
      </div>

      <div className="text-center space-y-4">
        {/* Large Chinese Character */}
        <div className="text-7xl font-bold text-gray-950 font-serif leading-tight">
          {vocabItem.character}
        </div>

        {/* Audio Slider Component integrated directly */}
        <div className="flex justify-center pt-2">
          <AudioPlayerSlider
            text={vocabItem.character}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
          />
        </div>
      </div>

      {/* Answer Form */}
      <div className="space-y-3">
        <label htmlFor="pinyin-guess" className="block text-sm font-medium text-gray-700">
          Enter Pinyin
        </label>
        <div className="flex gap-2">
          <input
            id="pinyin-guess"
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !hasChecked) {
                checkAnswer();
              }
            }}
            placeholder="e.g. nǐ hǎo"
            className="flex-1 min-w-0 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-950"
            disabled={hasChecked}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <button
            type="button"
            onClick={checkAnswer}
            disabled={hasChecked || !userGuess.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors disabled:opacity-50"
          >
            Check
          </button>
        </div>
      </div>

      {/* Feedback Panel */}
      {feedback && (
        <div
          className={`p-4 rounded-md border text-sm ${
            feedback.status === 'correct'
              ? 'bg-green-50 text-green-800 border-green-200'
              : feedback.status === 'near'
              ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <p className="font-semibold">{feedback.message}</p>
          <div className="mt-2 text-gray-600">
            <span className="font-medium">Translation: </span>
            {vocabItem.translation}
          </div>
        </div>
      )}

      {/* Solution Panel */}
      {showSolution && !feedback && (
        <div className="p-4 bg-gray-50 text-gray-800 border border-gray-200 rounded-md text-sm space-y-1">
          <div>
            <span className="font-medium text-gray-500">Pinyin: </span>
            <span className="font-semibold text-gray-900">{vocabItem.pinyin}</span>
          </div>
          <div>
            <span className="font-medium text-gray-500">Translation: </span>
            <span className="font-semibold text-gray-900">{vocabItem.translation}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-2">
        {!hasChecked && !showSolution && (
          <button
            type="button"
            onClick={() => setShowSolution(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Show Answer
          </button>
        )}

        {(hasChecked || showSolution) && (
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 text-center uppercase tracking-wider">
              Rate Recall Quality
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRatingSelect('hard')}
                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-medium py-2 px-3 rounded text-sm transition-colors"
              >
                Hard (Reset)
              </button>
              <button
                type="button"
                onClick={() => handleRatingSelect('medium')}
                className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 font-medium py-2 px-3 rounded text-sm transition-colors"
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => handleRatingSelect('easy')}
                className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-medium py-2 px-3 rounded text-sm transition-colors"
              >
                Easy
              </button>
            </div>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onNext}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                Skip / Next Card
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
