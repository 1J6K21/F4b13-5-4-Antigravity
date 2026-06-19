import React, { useState, useEffect } from 'react';
import { VocabularyImport } from './components/VocabularyImport.tsx';
import { PinyinRecallCard } from './components/PinyinRecallCard.tsx';
import { JournalFeedback } from './components/JournalFeedback.tsx';

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

export interface JournalEntry {
  id: string;
  content: string;
  createdAt: string;
  vocabRatings: { vocabId: string; rating: 'easy' | 'medium' | 'hard' }[];
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'study' | 'journal' | 'vocabulary' | 'archive'>('study');
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const vocabRes = await fetch('/api/vocab');
      const vocabData = await vocabRes.json();
      if (vocabData.success) {
        setVocabList(vocabData.items);
      }

      const journalRes = await fetch('/api/journals');
      const journalData = await journalRes.json();
      if (journalData.success) {
        setJournals(journalData.items);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImportSuccess = (newItems: VocabItem[]) => {
    setVocabList(prev => [...prev, ...newItems]);
  };

  const syncVocabUpdates = (updates: { vocabId: string; newStreak: number; nextReviewAt: string }[]) => {
    setVocabList(prev =>
      prev.map(v => {
        const update = updates.find(u => u.vocabId === v.id);
        if (update) {
          return {
            ...v,
            streak: update.newStreak,
            nextReviewAt: update.nextReviewAt,
          };
        }
        return v;
      })
    );
  };

  const handleCardAnswerChecked = async (vocabId: string, rating: 'easy' | 'medium' | 'hard') => {
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `Flashcard review rating: ${rating}`,
          vocabRatings: [{ vocabId, rating }],
        }),
      });
      const data = await response.json();
      if (data.success) {
        syncVocabUpdates(data.vocabUpdates);
        // Refresh journal history to capture the flashcard review log
        const journalRes = await fetch('/api/journals');
        const journalData = await journalRes.json();
        if (journalData.success) {
          setJournals(journalData.items);
        }
      }
    } catch (err) {
      console.error('Error updating flashcard rating:', err);
    }
  };

  const handleJournalSubmitSuccess = async (
    updates: { vocabId: string; newStreak: number; nextReviewAt: string }[]
  ) => {
    syncVocabUpdates(updates);
    // Refresh journal history
    try {
      const journalRes = await fetch('/api/journals');
      const journalData = await journalRes.json();
      if (journalData.success) {
        setJournals(journalData.items);
      }
    } catch (err) {
      console.error('Error fetching journal list:', err);
    }
  };

  const handleNextCard = () => {
    setCurrentCardIndex(prev => (vocabList.length > 0 ? (prev + 1) % vocabList.length : 0));
  };

  const dueVocabs = vocabList.filter(
    v => new Date(v.nextReviewAt).getTime() <= new Date().getTime()
  );

  const currentVocab = vocabList[currentCardIndex];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      {/* Top Banner Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold tracking-tight">HanziFlow 🌊</span>
            <span className="text-xs bg-indigo-500 font-medium px-2 py-0.5 rounded-full uppercase">
              Systems Edition
            </span>
          </div>
          <p className="text-sm text-indigo-100 max-w-sm">
            Scientifically optimized Spaced Repetition flashcards coupled with active context journaling.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Navigation Tabs & Study Space */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tab Navigation */}
              <nav className="flex bg-white rounded-lg p-1.5 shadow border border-gray-200" aria-label="Tabs">
                {(['study', 'journal', 'vocabulary', 'archive'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 text-center py-2 px-3 text-sm font-semibold rounded-md capitalize transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {tab === 'study' ? 'Recall Cards' : tab === 'archive' ? 'Journal Archive' : tab}
                  </button>
                ))}
              </nav>

              {/* Tab Panels */}
              {activeTab === 'study' && (
                <div className="space-y-6">
                  {vocabList.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center space-y-4 shadow-sm">
                      <div className="text-4xl">📭</div>
                      <h3 className="text-lg font-bold text-gray-800">Your vocabulary list is empty</h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Get started by importing words using the CSV Import tool on the right side of the screen.
                      </p>
                    </div>
                  ) : currentVocab ? (
                    <div className="space-y-4">
                      {dueVocabs.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2 rounded text-xs font-semibold flex items-center justify-between">
                          <span>⚠️ You have {dueVocabs.length} card(s) ready for review!</span>
                          <button
                            type="button"
                            onClick={() => {
                              const dueIndex = vocabList.findIndex(v => v.id === dueVocabs[0].id);
                              if (dueIndex !== -1) setCurrentCardIndex(dueIndex);
                            }}
                            className="bg-amber-600 text-white px-2 py-0.5 rounded text-[10px] hover:bg-amber-700"
                          >
                            Review Due Card
                          </button>
                        </div>
                      )}
                      
                      <PinyinRecallCard
                        vocabItem={currentVocab}
                        onAnswerChecked={handleCardAnswerChecked}
                        onNext={handleNextCard}
                        playbackSpeed={playbackSpeed}
                        setPlaybackSpeed={setPlaybackSpeed}
                      />

                      <div className="flex justify-between items-center text-xs text-gray-500 px-1">
                        <span>Card {currentCardIndex + 1} of {vocabList.length}</span>
                        <button
                          type="button"
                          onClick={handleNextCard}
                          className="hover:text-gray-900 font-medium"
                        >
                          Next Card &rarr;
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {activeTab === 'journal' && (
                <JournalFeedback
                  vocabList={vocabList}
                  onJournalSubmitSuccess={handleJournalSubmitSuccess}
                />
              )}

              {activeTab === 'vocabulary' && (
                <div className="bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-950">Vocabulary Database</h3>
                    <span className="text-xs text-gray-500 font-medium">{vocabList.length} words total</span>
                  </div>
                  <div className="divide-y divide-gray-200 overflow-x-auto">
                    {vocabList.length === 0 ? (
                      <p className="p-8 text-center text-sm text-gray-500">No words found. Import some words to start.</p>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase">
                          <tr>
                            <th className="px-6 py-3">Character</th>
                            <th className="px-6 py-3">Pinyin</th>
                            <th className="px-6 py-3">Translation</th>
                            <th className="px-6 py-3">Streak</th>
                            <th className="px-6 py-3">Next Review</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-gray-800">
                          {vocabList.map(item => {
                            const isDue = new Date(item.nextReviewAt).getTime() <= Date.now();
                            return (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-serif text-lg font-bold text-gray-950">{item.character}</td>
                                <td className="px-6 py-4 font-mono text-xs">{item.pinyin}</td>
                                <td className="px-6 py-4">{item.translation}</td>
                                <td className="px-6 py-4">
                                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    {item.streak}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`text-xs ${isDue ? 'text-amber-600 font-bold' : 'text-gray-500'}`}>
                                    {isDue ? 'Ready to Review' : new Date(item.nextReviewAt).toLocaleDateString()}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'archive' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-950 px-1">Study Journal Archive</h3>
                  {journals.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500 shadow-sm">
                      No journal entries saved yet. Go write your first entry!
                    </div>
                  ) : (
                    journals.map(entry => (
                      <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3">
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>ID: {entry.id}</span>
                          <span>{new Date(entry.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-800 font-serif whitespace-pre-wrap leading-relaxed text-base italic border-l-4 border-indigo-200 pl-4">
                          "{entry.content}"
                        </p>
                        {entry.vocabRatings.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2 items-center">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">
                              Practiced:
                            </span>
                            {entry.vocabRatings.map(ratingItem => {
                              const vItem = vocabList.find(v => v.id === ratingItem.vocabId);
                              return (
                                <span
                                  key={ratingItem.vocabId}
                                  className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded font-medium"
                                >
                                  <strong>{vItem ? vItem.character : 'Unknown'}</strong>
                                  <span className="text-[10px] text-indigo-500 uppercase">({ratingItem.rating})</span>
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Import & Study Stats */}
            <div className="space-y-6">
              <VocabularyImport onImportSuccess={handleImportSuccess} />

              <div className="bg-white shadow rounded-lg p-6 border border-gray-200 space-y-4">
                <h3 className="text-md font-bold text-gray-900 uppercase tracking-wider text-xs">
                  Study Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded border border-gray-100">
                    <span className="block text-2xl font-black text-blue-600">{vocabList.length}</span>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">Total Vocabulary</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100">
                    <span className="block text-2xl font-black text-amber-600">{dueVocabs.length}</span>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">Cards Due Review</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100 col-span-2">
                    <span className="block text-2xl font-black text-indigo-600">{journals.length}</span>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">Saved Journal Logs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
