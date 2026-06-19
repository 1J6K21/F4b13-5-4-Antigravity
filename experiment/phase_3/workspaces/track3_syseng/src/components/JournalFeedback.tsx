import React, { useState, useEffect } from 'react';

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

interface JournalFeedbackProps {
  vocabList: VocabItem[];
  onJournalSubmitSuccess: (updatedVocab: { vocabId: string; newStreak: number; nextReviewAt: string }[]) => void;
}

export const JournalFeedback: React.FC<JournalFeedbackProps> = ({
  vocabList,
  onJournalSubmitSuccess,
}) => {
  const [content, setContent] = useState('');
  const [detectedVocab, setDetectedVocab] = useState<VocabItem[]>([]);
  const [ratings, setRatings] = useState<Record<string, 'easy' | 'medium' | 'hard'>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedEntry, setSubmittedEntry] = useState<{
    id: string;
    content: string;
    createdAt: string;
  } | null>(null);

  // Scan content for target vocabulary terms dynamically
  useEffect(() => {
    if (!content.trim()) {
      setDetectedVocab([]);
      return;
    }

    const detected = vocabList.filter(vocab => content.includes(vocab.character));
    setDetectedVocab(detected);

    // Initialize ratings for newly detected words
    setRatings(prev => {
      const nextRatings = { ...prev };
      detected.forEach(vocab => {
        if (!nextRatings[vocab.id]) {
          nextRatings[vocab.id] = 'easy'; // default to easy
        }
      });
      return nextRatings;
    });
  }, [content, vocabList]);

  const handleRatingChange = (vocabId: string, rating: 'easy' | 'medium' | 'hard') => {
    setRatings(prev => ({
      ...prev,
      [vocabId]: rating,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmittedEntry(null);

    if (!content.trim()) {
      setError('Journal content cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const vocabRatings = detectedVocab.map(v => ({
        vocabId: v.id,
        rating: ratings[v.id] || 'easy',
      }));

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          vocabRatings,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit journal entry.');
      }

      setSubmittedEntry(data.journalEntry);
      onJournalSubmitSuccess(data.vocabUpdates);
      setContent('');
      setRatings({});
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the journal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 border border-gray-200 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-950">Active Recall Journal</h3>
        <p className="text-sm text-gray-500">
          Write a short story or diary entry in Chinese. Try incorporating your vocabulary words!
          Privacy shield is active: phone numbers, emails, and SSNs will be scrubbed on submission.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="journal-textarea" className="sr-only">Chinese Journal Content</label>
          <textarea
            id="journal-textarea"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今天我很开心。我学习中文。我的邮箱是 jack@test.com，电话是 123-456-7890..."
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-950"
            disabled={loading}
          />
        </div>

        {/* Detected Vocabulary Words */}
        {detectedVocab.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200 space-y-3">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Practiced Vocabulary Detected ({detectedVocab.length})
            </h4>
            <div className="space-y-2.5">
              {detectedVocab.map(vocab => (
                <div
                  key={vocab.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-2 rounded border border-blue-100 text-sm"
                >
                  <div>
                    <span className="font-semibold text-gray-950 text-base mr-2">{vocab.character}</span>
                    <span className="text-gray-500 font-mono">({vocab.pinyin})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500 mr-2 font-medium">Recall Level:</span>
                    {(['hard', 'medium', 'easy'] as const).map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleRatingChange(vocab.id, rating)}
                        className={`px-2 py-0.5 rounded text-xs font-medium border capitalize transition-colors ${
                          ratings[vocab.id] === rating
                            ? rating === 'easy'
                              ? 'bg-green-600 border-green-600 text-white'
                              : rating === 'medium'
                              ? 'bg-yellow-500 border-yellow-500 text-white'
                              : 'bg-red-600 border-red-600 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving Entry...' : 'Save Journal & Log Feedback'}
        </button>
      </form>

      {/* Persistent display of latest submitted journal (showing the scrubbing result) */}
      {submittedEntry && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-sm space-y-2">
          <h4 className="font-bold text-green-900 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            Journal Logged & Sanitized Successfully!
          </h4>
          <div className="bg-white p-3 rounded border border-green-100 text-gray-800 font-serif leading-relaxed italic">
            "{submittedEntry.content}"
          </div>
          <p className="text-[10px] text-green-700 text-right">
            Logged at: {new Date(submittedEntry.createdAt).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};
