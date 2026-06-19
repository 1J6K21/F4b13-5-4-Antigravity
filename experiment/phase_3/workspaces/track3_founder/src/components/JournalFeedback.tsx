import React, { useState } from 'react';

interface VocabItem {
  id: string;
  characters: string;
  pinyin: string;
  english: string;
}

interface ReviewResponse {
  success: boolean;
  originalContent: string;
  scrubbedContent: string;
  wordsIdentified: VocabItem[];
}

interface JournalFeedbackProps {
  activeVocab: VocabItem[];
}

export const JournalFeedback: React.FC<JournalFeedbackProps> = ({ activeVocab }) => {
  const [journalContent, setJournalContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReviewResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    if (!journalContent.trim()) {
      setError('Please write something in your journal before submitting.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/journal/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: journalContent }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to analyze journal.');
      }
    } catch (err) {
      setError('Connection to backend failed. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const insertSamplePII = () => {
    setJournalContent(
      'Today I wrote an email to teacher@chineseclass.com and called 555-019-2834 to practice saying 你好!'
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Daily Vocabulary Journal</h2>
        <p className="text-xs text-gray-500 mt-1">
          Bridge passive reading with active output. Write a sentence or diary entry using your vocabulary.
        </p>
      </div>

      {/* Suggestion Prompt */}
      {activeVocab.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-700">
          <strong>Daily Challenge Prompt:</strong> Try writing a sentence using 
          <span className="font-bold underline ml-1">
            {activeVocab[Math.floor(Math.sin(new Date().getDate()) * activeVocab.length + activeVocab.length) % activeVocab.length]?.characters}
          </span> or 
          <span className="font-bold underline ml-1">
            {activeVocab[0]?.characters}
          </span>!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-700">Write in English and Chinese:</label>
            <button
              type="button"
              onClick={insertSamplePII}
              className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 underline"
            >
              Insert PII Sample
            </button>
          </div>
          <textarea
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            rows={4}
            placeholder="Today I ate a tasty 苹果 (apple) and saw a cute 猫 (cat) in the street..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow transition-colors disabled:opacity-50"
        >
          {loading ? 'Analyzing Recall...' : 'Submit Journal for Review'}
        </button>
      </form>

      {/* Review Results Output */}
      {result && (
        <div className="border-t border-gray-100 pt-5 space-y-4">
          <h3 className="text-md font-bold text-gray-800">Review Feedback</h3>

          {/* Privacy Engine scrubbing verification */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              PII-Scrubbed Journal Entry
            </span>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 font-mono break-words">
              {result.scrubbedContent}
            </div>
            {result.originalContent !== result.scrubbedContent && (
              <span className="text-[10px] text-green-600 font-medium flex items-center">
                ✓ PII Scrubbing Active: Personal credentials filtered successfully.
              </span>
            )}
          </div>

          {/* Vocabulary Recognition / Recall stats */}
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
              Vocabulary Words Recalled
            </span>
            {result.wordsIdentified.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.wordsIdentified.map(word => (
                  <div 
                    key={word.id}
                    className="flex items-center space-x-1.5 bg-green-50 border border-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                  >
                    <span>{word.characters}</span>
                    <span className="text-gray-400">({word.pinyin})</span>
                    <span className="text-green-600 font-bold">✓ Recalled</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">
                No active vocabulary words identified. Try including characters from your active studying list!
              </p>
            )}
          </div>

          {/* Premium AI Feedback Upsell */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex justify-between items-center">
            <div>
              <strong className="text-amber-800">HanziFlow AI Coach (Pro)</strong>
              <p className="text-gray-600 text-[10px] mt-0.5">
                Unlock grammatical feedback and sentence correctors.
              </p>
            </div>
            <button
              onClick={() => alert('Monetization pathway triggered: Premium purchase modal.')}
              className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-3 py-1.5 rounded transition-all shadow-sm shrink-0 ml-3"
            >
              Unlock Pro ($9.99/mo)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
