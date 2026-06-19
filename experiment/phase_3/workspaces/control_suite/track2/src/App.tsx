import React, { useState, useEffect } from 'react';
import { VocabularyList, VocabularyItem, JournalEntry } from './types/hanzi';
import { VocabularyImport } from './components/VocabularyImport';
import { PinyinRecallCard } from './components/PinyinRecallCard';
import { AudioPlayerSlider } from './components/AudioPlayerSlider';
import { JournalFeedback } from './components/JournalFeedback';

// Pre-populated default vocabulary decks
const DEFAULT_DECKS: VocabularyList[] = [
  {
    id: 'deck-hsk3-food',
    user_id: 'demo-user',
    title: 'HSK 3 - Eating Out & Food',
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    words: [
      {
        id: 'w1',
        list_id: 'deck-hsk3-food',
        hanzi: '苹果',
        pinyin: 'píngguǒ',
        english: 'apple',
        character_mappings: [
          { sequence_order: 0, character: '苹', pinyin: 'píng', tone: 2 },
          { sequence_order: 1, character: '果', pinyin: 'guǒ', tone: 3 }
        ]
      },
      {
        id: 'w2',
        list_id: 'deck-hsk3-food',
        hanzi: '菜单',
        pinyin: 'càidān',
        english: 'menu',
        character_mappings: [
          { sequence_order: 0, character: '菜', pinyin: 'cài', tone: 4 },
          { sequence_order: 1, character: '单', pinyin: 'dān', tone: 1 }
        ]
      },
      {
        id: 'w3',
        list_id: 'deck-hsk3-food',
        hanzi: '米饭',
        pinyin: 'mǐfàn',
        english: 'cooked rice',
        character_mappings: [
          { sequence_order: 0, character: '米', pinyin: 'mǐ', tone: 3 },
          { sequence_order: 1, character: '饭', pinyin: 'fàn', tone: 4 }
        ]
      },
      {
        id: 'w4',
        list_id: 'deck-hsk3-food',
        hanzi: '面条',
        pinyin: 'miàntiáo',
        english: 'noodles',
        character_mappings: [
          { sequence_order: 0, character: '面', pinyin: 'miàn', tone: 4 },
          { sequence_order: 1, character: '条', pinyin: 'tiáo', tone: 2 }
        ]
      }
    ]
  },
  {
    id: 'deck-everyday-convo',
    user_id: 'demo-user',
    title: 'Everyday Mandarin Basics',
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    words: [
      {
        id: 'w5',
        list_id: 'deck-everyday-convo',
        hanzi: '你好',
        pinyin: 'nǐhǎo',
        english: 'hello',
        character_mappings: [
          { sequence_order: 0, character: '你', pinyin: 'nǐ', tone: 3 },
          { sequence_order: 1, character: '好', pinyin: 'hǎo', tone: 3 }
        ]
      },
      {
        id: 'w6',
        list_id: 'deck-everyday-convo',
        hanzi: '谢谢',
        pinyin: 'xièxie',
        english: 'thank you',
        character_mappings: [
          { sequence_order: 0, character: '谢', pinyin: 'xiè', tone: 4 },
          { sequence_order: 1, character: '谢', pinyin: 'xie', tone: 5 }
        ]
      },
      {
        id: 'w7',
        list_id: 'deck-everyday-convo',
        hanzi: '再见',
        pinyin: 'zàijiàn',
        english: 'goodbye',
        character_mappings: [
          { sequence_order: 0, character: '再', pinyin: 'zài', tone: 4 },
          { sequence_order: 1, character: '见', pinyin: 'jiàn', tone: 4 }
        ]
      }
    ]
  }
];

export const App: React.FC = () => {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [vocabDecks, setVocabDecks] = useState<VocabularyList[]>(DEFAULT_DECKS);
  const [activeDeckId, setActiveDeckId] = useState<string | null>('deck-hsk3-food');
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'study' | 'journal' | 'import'>('study');

  // Audio link state
  const [audioTextToPlay, setAudioTextToPlay] = useState('欢迎使用 HanziFlow');
  const [audioAutoTrigger, setAudioAutoTrigger] = useState(0);

  // Stats
  const [streak, setStreak] = useState(3);
  const [reviewsDone, setReviewsDone] = useState(12);

  // Find active deck
  const activeDeck = vocabDecks.find(deck => deck.id === activeDeckId) || null;
  const activeWords = activeDeck?.words || [];

  const handleImportSuccess = (listId: string, title: string, count: number) => {
    // Refresh or simulate loading lists
    // Here we query or mock add the list
    const newDeck: VocabularyList = {
      id: listId,
      user_id: 'demo-user',
      title: title,
      is_public: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Prepopulate words locally for immediate visual satisfaction (will fetch actual list words in production)
      words: [
        { id: `${listId}-w1`, list_id: listId, hanzi: '苹果', pinyin: 'píngguǒ', english: 'apple' },
        { id: `${listId}-w2`, list_id: listId, hanzi: '菜单', pinyin: 'càidān', english: 'menu' }
      ]
    };

    setVocabDecks(prev => [newDeck, ...prev]);
    setActiveDeckId(listId);
    setActiveTab('study');
  };

  const handlePlayAudio = (text: string) => {
    setAudioTextToPlay(text);
    setAudioAutoTrigger(prev => prev + 1);
  };

  const handleSaveJournalSuccess = (entry: any) => {
    const newJournal: JournalEntry = {
      id: entry.journal_id,
      user_id: 'demo-user',
      content: entry.feedback.corrected_content, // show corrected in list
      created_at: entry.created_at || new Date().toISOString(),
      target_vocab_list_id: activeDeckId || undefined,
      vocab_matched_count: entry.vocab_matched_count,
      feedback: {
        corrected_content: entry.feedback.corrected_content,
        grammar_notes: entry.feedback.grammar_notes,
        vocab_evaluation: entry.vocab_evaluation
      }
    };
    setJournals(prev => [newJournal, ...prev]);
    setStreak(prev => prev + 1);
  };

  const handleReviewRecall = (itemId: string, score: 'forgot' | 'hard' | 'good' | 'easy') => {
    setReviewsDone(prev => prev + 1);
    // Visual indicator of updated SRS status
    console.log(`Word ${itemId} reviewed. Score: ${score}`);
  };

  const handleStateChange = (itemId: string, newState: 'NEW' | 'RECOGNIZED' | 'ACTIVE_PRODUCTION' | 'MASTERED') => {
    setVocabDecks(prev => prev.map(deck => {
      if (!deck.words) return deck;
      return {
        ...deck,
        words: deck.words.map(w => {
          if (w.id === itemId) {
            // Log/simulate update
            return { ...w };
          }
          return w;
        })
      };
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* Header bar */}
      <header className="border-b border-slate-900 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md">
              <span className="font-serif text-xl font-bold text-white">流</span>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                HanziFlow
              </span>
              <span className="text-[10px] block text-slate-500 font-semibold uppercase tracking-wider">Tone & Output Studio</span>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="flex items-center gap-4">
            {/* Account Tier Switcher */}
            <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 items-center">
              <span className="text-[10px] px-2 text-slate-500 uppercase font-bold">Tier:</span>
              <button
                onClick={() => setIsPremium(false)}
                className={`px-2.5 py-1 text-xs rounded font-bold transition-all ${
                  !isPremium
                    ? 'bg-slate-800 text-slate-100 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setIsPremium(true)}
                className={`px-2.5 py-1 text-xs rounded font-bold transition-all relative ${
                  isPremium
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Premium ★
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Quick Stats section */}
      <section className="bg-slate-900/20 py-8 border-b border-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Stat 1: Study Streak */}
            <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                🔥
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Daily Streak</span>
                <span className="text-2xl font-bold">{streak} Days</span>
              </div>
            </div>

            {/* Stat 2: Cards Reviewed */}
            <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                📚
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">SRS Reviews Today</span>
                <span className="text-2xl font-bold">{reviewsDone} Cards</span>
              </div>
            </div>

            {/* Stat 3: Total Active Vocabulary */}
            <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                ✓
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Total Vocab Words</span>
                <span className="text-2xl font-bold">
                  {vocabDecks.reduce((sum, d) => sum + (d.words?.length || 0), 0)}
                </span>
              </div>
            </div>

            {/* Stat 4: Audio Controller Status */}
            <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center">
                ⚡
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Account Tier Status</span>
                <span className="text-xs font-bold text-slate-300">
                  {isPremium ? 'Premium (Azure Neural Streams & Custom Speed)' : 'Free (Local SpeechSynthesis, standard 1x)'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Workspace Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar: Lists Navigation & Live Audio Controller */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* List Selection Widget */}
            <div className="bg-slate-900 border border-slate-850 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                <span>Vocabulary Decks</span>
                <button
                  onClick={() => setActiveTab('import')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  + Upload CSV
                </button>
              </h3>
              
              <div className="space-y-1">
                {vocabDecks.map((deck) => {
                  const isSelected = deck.id === activeDeckId;
                  return (
                    <button
                      key={deck.id}
                      onClick={() => {
                        setActiveDeckId(deck.id);
                        if (activeTab === 'import') setActiveTab('study');
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-900/40 font-bold'
                          : 'bg-slate-950/20 text-slate-400 border border-transparent hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate pr-2">{deck.title}</span>
                      <span className="px-1.5 py-0.5 text-[10px] bg-slate-800 rounded text-slate-400">
                        {deck.words?.length || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Audio Synthesis Settings Widget */}
            <AudioPlayerSlider
              key={`${audioTextToPlay}-${audioAutoTrigger}`}
              initialText={audioTextToPlay}
              isPremium={isPremium}
            />

            {/* Previous Journals Feed */}
            {journals.length > 0 && (
              <div className="bg-slate-900 border border-slate-850 rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Journal History ({journals.length})
                </h3>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {journals.map((j) => (
                    <div key={j.id} className="bg-slate-950 border border-slate-900 p-2.5 rounded text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-500 text-[10px]">
                        <span>{new Date(j.created_at).toLocaleDateString()}</span>
                        <span className="text-indigo-400 font-bold">{j.vocab_matched_count} used</span>
                      </div>
                      <p className="text-slate-300 line-clamp-2 italic font-serif">"{j.content}"</p>
                      {j.feedback?.grammar_notes && (
                        <div className="text-[10px] text-slate-400 bg-slate-900 p-1.5 rounded">
                          💡 {j.feedback.grammar_notes.slice(0, 80)}...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Center Pane: Dynamic Studying Tab / Writing Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Tabs Selector */}
            <div className="flex border-b border-slate-850">
              <button
                onClick={() => setActiveTab('study')}
                className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'study'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Character study cards
              </button>
              <button
                onClick={() => setActiveTab('journal')}
                className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'journal'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Interactive writing workspace
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'import'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Upload custom deck (CSV)
              </button>
            </div>

            {/* TAB CONTENT 1: STUDY FLASHCARDS */}
            {activeTab === 'study' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-200">
                      {activeDeck ? activeDeck.title : 'No Deck Selected'}
                    </h2>
                    <p className="text-slate-500 text-xs">
                      Study character tones, segments, and audio pronunciations below.
                    </p>
                  </div>
                </div>

                {activeWords.length === 0 ? (
                  <div className="text-center py-20 bg-slate-900/30 border border-slate-850 rounded-xl">
                    <p className="text-slate-500 text-sm mb-4">No characters in this vocabulary deck.</p>
                    <button
                      onClick={() => setActiveTab('import')}
                      className="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-500"
                    >
                      Import Words from CSV
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {activeWords.map((word) => (
                      <PinyinRecallCard
                        key={word.id}
                        item={word}
                        onPlayAudio={handlePlayAudio}
                        onReviewRecall={handleReviewRecall}
                        onStateChange={handleStateChange}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: JOURNAL WRITING */}
            {activeTab === 'journal' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-4 text-xs text-indigo-300 flex items-center gap-2.5">
                  <span className="text-base">💡</span>
                  <span>
                    Select a deck in the left sidebar first. The checklist will reveal matches in real-time as you write. Then submit to trigger automated AI grammar revisions.
                  </span>
                </div>

                <JournalFeedback
                  activeVocabItems={activeWords}
                  activeListId={activeDeckId}
                  isPremium={isPremium}
                  onPlayAudio={handlePlayAudio}
                  onSaveSuccess={handleSaveJournalSuccess}
                />
              </div>
            )}

            {/* TAB CONTENT 3: IMPORT CSV */}
            {activeTab === 'import' && (
              <div className="animate-fadeIn">
                <VocabularyImport onImportSuccess={handleImportSuccess} />
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
