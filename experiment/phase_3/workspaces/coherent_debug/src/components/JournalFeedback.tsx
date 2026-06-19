import React, { useState, useEffect } from 'react';
import { VocabularyItem, JournalFeedback as IJournalFeedback, JournalVocabEvaluation } from '../types/hanzi';

interface JournalFeedbackProps {
  activeVocabItems: VocabularyItem[];
  activeListId: string | null;
  isPremium?: boolean;
  onSaveSuccess?: (entry: any) => void;
  onPlayAudio?: (text: string) => void;
}

export const JournalFeedback: React.FC<JournalFeedbackProps> = ({
  activeVocabItems,
  activeListId,
  isPremium = false,
  onSaveSuccess,
  onPlayAudio
}) => {
  const [content, setContent] = useState('');
  const [matchedWords, setMatchedWords] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Results states
  const [feedbackResult, setFeedbackResult] = useState<{
    journal_id: string;
    vocab_matched_count: number;
    vocab_evaluation: JournalVocabEvaluation[];
    feedback: IJournalFeedback;
  } | null>(null);

  const charLimit = isPremium ? 2000 : 150;

  // Track matched vocabulary in real-time as user types
  useEffect(() => {
    if (!content.trim() || activeVocabItems.length === 0) {
      setMatchedWords([]);
      return;
    }
    const matched = activeVocabItems.filter(item => content.includes(item.hanzi));
    setMatchedWords(matched);
  }, [content, activeVocabItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!activeListId) {
      setErrorMsg('Please select a target vocabulary deck to match against.');
      return;
    }
    if (content.length > charLimit) {
      setErrorMsg(`Content exceeds character limit of ${charLimit} for your account tier.`);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setFeedbackResult(null);

    try {
      const response = await fetch('/api/v1/journals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': isPremium ? 'Bearer premium-token' : 'Bearer free-token'
        },
        body: JSON.stringify({
          content: content.trim(),
          target_vocab_list_id: activeListId
        })
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error?.message || resData.message || 'Submission failed.');
      }

      setFeedbackResult(resData.data);
      if (onSaveSuccess) {
        onSaveSuccess(resData.data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit journal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setFeedbackResult(null);
    setErrorMsg(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CORRECT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-900">
            ● Correct Usage
          </span>
        );
      case 'INCORRECT_GRAMMAR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/40 text-rose-400 border border-rose-900">
            ● Grammar Error
          </span>
        );
      case 'IMPROVED_PHRASING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-950/40 text-sky-400 border border-sky-900">
            ● Improved Phrasing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            ● Unknown
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-100 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Interactive Study Journal
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Write Chinese compositions incorporating your target vocabulary and receive instant AI feedback.
          </p>
        </div>

        {feedbackResult && (
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 active:scale-95 transition-all"
          >
            Write New Entry
          </button>
        )}
      </div>

      {!feedbackResult ? (
        /* WRITING WORKSPACE */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Editor Textarea Panel */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Write in Chinese
                </label>
                <span className={`text-xs ${content.length > charLimit ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                  {content.length} / {charLimit} characters
                </span>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your Chinese journal entry here. Incorporate words from the deck..."
                rows={8}
                disabled={!activeListId}
                className={`w-full bg-slate-800 border rounded-lg p-4 text-base leading-relaxed text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  !activeListId ? 'border-slate-800 bg-slate-900/50 cursor-not-allowed opacity-50' : 'border-slate-700'
                }`}
              />

              {!activeListId && (
                <div className="text-amber-400/80 text-xs flex items-center gap-1.5 bg-amber-950/20 border border-amber-900/50 p-2.5 rounded">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Please choose a vocabulary deck from the sidebar before you begin writing.
                </div>
              )}
            </div>

            {/* Target Vocabulary Checklist Panel */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 h-fit max-h-[300px] overflow-y-auto">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex justify-between">
                <span>Target Words Checklist</span>
                <span className="text-indigo-400">{matchedWords.length} / {activeVocabItems.length} used</span>
              </h3>

              {activeVocabItems.length === 0 ? (
                <div className="text-slate-600 text-xs py-4 text-center">No words in this deck yet.</div>
              ) : (
                <ul className="space-y-2">
                  {activeVocabItems.map((item) => {
                    const isMatched = content.includes(item.hanzi);
                    return (
                      <li
                        key={item.id}
                        className={`flex items-center justify-between text-xs p-2 rounded transition-all ${
                          isMatched
                            ? 'bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 font-medium'
                            : 'bg-slate-900 border border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`text-base font-semibold ${isMatched ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {item.hanzi}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">[{item.pinyin}]</span>
                        </span>
                        
                        {isMatched ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                            ✓ Found
                          </span>
                        ) : (
                          <span className="text-slate-600">✕ Missing</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

          </div>

          {errorMsg && (
            <div className="bg-rose-950/40 border border-rose-800 text-rose-300 px-4 py-3 rounded text-sm">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-slate-800">
            <button
              type="submit"
              disabled={isLoading || !content.trim() || !activeListId}
              className={`px-6 py-2.5 rounded font-bold text-sm shadow-md transition-all ${
                isLoading || !content.trim() || !activeListId
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing Writing...
                </span>
              ) : (
                'Submit Journal for AI Feedback'
              )}
            </button>
          </div>
        </form>
      ) : (
        /* AI CORRECTION & REVIEW PANEL */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Original vs. Corrected Text */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Your Submission</h3>
                <div className="bg-slate-950 border border-slate-900 rounded-lg p-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {content}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Corrected Phrasing</h3>
                  <button
                    onClick={() => onPlayAudio?.(feedbackResult.feedback.corrected_content)}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold bg-indigo-950/20 border border-indigo-900/40 px-2.5 py-1 rounded"
                    title="Speak corrected entry"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    Listen to Correction
                  </button>
                </div>
                <div className="bg-indigo-950/10 border border-indigo-900/30 rounded-lg p-4 text-slate-100 text-base leading-relaxed whitespace-pre-wrap font-serif">
                  {feedbackResult.feedback.corrected_content}
                </div>
              </div>
            </div>

            {/* Right Column: Grammar Notes & Vocab Mapping */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Grammar & Tone Explanations</h3>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {feedbackResult.feedback.grammar_notes}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Target Vocabulary Usage Status</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {feedbackResult.vocab_evaluation.map((evalItem) => (
                    <div
                      key={evalItem.vocab_item_id}
                      className="bg-slate-950 border border-slate-900 rounded p-2.5 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-sm text-slate-200">{evalItem.character}</span>
                      {getStatusBadge(evalItem.status)}
                    </div>
                  ))}
                  {feedbackResult.vocab_evaluation.length === 0 && (
                    <div className="text-slate-600 text-xs text-center py-2">No target vocabulary evaluated in feedback.</div>
                  )}
                </div>
              </div>
            </div>

          </div>

          <div className="bg-indigo-950/10 border border-indigo-900/20 rounded-lg p-4 text-center text-xs text-indigo-400/80 flex justify-center items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            This journal has been successfully scrubbed of any PII, encrypted using AES-256-GCM, and stored safely in our database.
          </div>
        </div>
      )}
    </div>
  );
};
