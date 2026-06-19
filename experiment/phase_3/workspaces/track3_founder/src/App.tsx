import React, { useState, useEffect } from 'react';
import { PinyinRecallCard } from './components/PinyinRecallCard';
import { VocabularyImport } from './components/VocabularyImport';
import { AudioPlayerSlider } from './components/AudioPlayerSlider';
import { JournalFeedback } from './components/JournalFeedback';

interface VocabItem {
  id: string;
  characters: string;
  pinyin: string;
  english: string;
}

// Zero-friction onboarding default words if server connection fails or is loading
const FALLBACK_VOCAB: VocabItem[] = [
  { id: 'hsk1-1', characters: '你好', pinyin: 'nǐ hǎo', english: 'hello' },
  { id: 'hsk1-2', characters: '谢谢', pinyin: 'xièxie', english: 'thank you' },
  { id: 'hsk1-3', characters: '再见', pinyin: 'zàijiàn', english: 'goodbye' },
  { id: 'hsk1-4', characters: '苹果', pinyin: 'píngguǒ', english: 'apple' },
  { id: 'hsk1-5', characters: '猫', pinyin: 'māo', english: 'cat' }
];

export const App: React.FC = () => {
  const [activeVocab, setActiveVocab] = useState<VocabItem[]>(FALLBACK_VOCAB);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [serverStatus, setServerStatus] = useState<'connected' | 'disconnected'>('disconnected');

  // Load initial vocabulary from backend
  const fetchVocabulary = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/vocab');
      const data = await response.json();
      if (response.ok && data.success) {
        setActiveVocab(data.items);
        setServerStatus('connected');
      } else {
        setServerStatus('disconnected');
      }
    } catch (err) {
      setServerStatus('disconnected');
      // If server is not running, we degrade gracefully to offline state using HSK defaults
      setActiveVocab(FALLBACK_VOCAB);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabulary();
  }, []);

  // Sync index boundaries when cards are imported or removed
  useEffect(() => {
    if (currentCardIndex >= activeVocab.length) {
      setCurrentCardIndex(Math.max(0, activeVocab.length - 1));
    }
  }, [activeVocab, currentCardIndex]);

  const handleImportSuccess = (newItems: VocabItem[]) => {
    // Append the newly imported items to our local state list
    setActiveVocab(prev => [...prev, ...newItems]);
    setServerStatus('connected');
  };

  const handleReset = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/vocab/reset', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setActiveVocab(data.items);
        setCurrentCardIndex(0);
        setServerStatus('connected');
      }
    } catch (err) {
      // Offline fallback reset
      setActiveVocab(FALLBACK_VOCAB);
      setCurrentCardIndex(0);
      setServerStatus('disconnected');
    }
  };

  const handleNextCard = () => {
    if (activeVocab.length === 0) return;
    setCurrentCardIndex((prev) => (prev + 1) % activeVocab.length);
  };

  const handlePrevCard = () => {
    if (activeVocab.length === 0) return;
    setCurrentCardIndex((prev) => (prev - 1 + activeVocab.length) % activeVocab.length);
  };

  const currentVocab = activeVocab[currentCardIndex] || null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      
      {/* 1. Premium Monetization Pathway Top Upsell Bar */}
      <div className="bg-indigo-950 text-indigo-100 py-2.5 px-4 text-center text-xs font-medium border-b border-indigo-900 flex justify-center items-center space-x-2">
        <span className="bg-indigo-500 text-white font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase">
          HANZIFLOW PRO
        </span>
        <span>
          Accelerate your retention with precise speed verification, unlimited CSV imports, and deep grammar analyses.
        </span>
        <button
          onClick={() => {
            setIsPremium(true);
            alert('Welcome to HanziFlow Pro! All premium speed slider constraints and journal hints have been enabled.');
          }}
          className="text-white underline hover:text-indigo-200 font-bold ml-2 transition-colors"
        >
          {isPremium ? 'Pro Enabled ✓' : 'Upgrade for $9.99/mo'}
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                HanziFlow <span className="text-indigo-600">汉字流</span>
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                serverStatus === 'connected' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
              }`}>
                {serverStatus === 'connected' ? 'Cloud Sync Active' : 'Offline / Sandbox Mode'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              A scientifically optimized Chinese vocabulary studying and output journaling engine.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold py-2 px-4 rounded-lg text-sm shadow-sm transition-colors"
              title="Reset vocabulary database to HSK 1 starters"
            >
              Reset to HSK 1 Starters
            </button>
            
            <a
              href="#journal-section"
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors border border-indigo-100"
            >
              Write Daily Journal
            </a>
          </div>
        </header>

        {/* Scientifically Anchored Onboarding Tip */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start space-x-3 text-indigo-900 shadow-sm">
          <svg className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs space-y-1">
            <h4 className="font-bold">Founder OS Retention Strategy: Active Tone-Anchoring</h4>
            <p>
              By default, HanziFlow displays Chinese characters alongside their Pinyin pronunciation and English translations. 
              Studies indicate that presenting characters together with phonetic tone-marks reduces tone-confusion, minimizes cognitive friction, 
              and establishes rapid retention loops necessary for GTM user adoption.
            </p>
          </div>
        </div>

        {/* Dashboard Grid layout */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Study Dashboard Card & Journal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Flashcard Recall block */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">1. Pinyin Recall Flashcard</h3>
                <span className="text-xs text-gray-400">Avoids Cognitive Tone Friction</span>
              </div>
              <PinyinRecallCard
                vocab={currentVocab}
                onNext={handleNextCard}
                onPrev={handlePrevCard}
                currentIndex={currentCardIndex}
                totalCards={activeVocab.length}
                renderAudioPlayer={(text) => <AudioPlayerSlider text={text} />}
              />
            </div>

            {/* Daily Journal Review block */}
            <div id="journal-section">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">2. Sentence Journal & Active Recall Tracker</h3>
                <span className="text-xs text-gray-400">Scrubs PII / Scans Vocab matches</span>
              </div>
              <JournalFeedback activeVocab={activeVocab} />
            </div>

          </div>

          {/* Column 3: Custom Import & Vocabulary List Table */}
          <div className="space-y-8">
            
            {/* CSV Import */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">3. Custom CSV Importer</h3>
              <VocabularyImport onImportSuccess={handleImportSuccess} />
            </div>

            {/* Active Vocab list */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Active Study List ({activeVocab.length})
                </h4>
                {isPremium && (
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    Premium Active
                  </span>
                )}
              </div>

              <div className="overflow-y-auto max-h-96 pr-1 space-y-2.5">
                {loading ? (
                  <p className="text-xs text-gray-500 text-center py-6 animate-pulse">Syncing vocabulary database...</p>
                ) : activeVocab.map((vocabItem, idx) => (
                  <div 
                    key={vocabItem.id}
                    onClick={() => setCurrentCardIndex(idx)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex justify-between items-center ${
                      idx === currentCardIndex 
                        ? 'bg-indigo-50 border-indigo-300 shadow-sm' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      {/* Chinese character alongside Pinyin */}
                      <div className="flex items-baseline space-x-2">
                        <span className="font-bold text-gray-900 text-lg">{vocabItem.characters}</span>
                        <span className="text-xs text-indigo-600 font-medium font-mono">{vocabItem.pinyin}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{vocabItem.english}</p>
                    </div>

                    <div className="shrink-0 flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Speak aloud
                          const utterance = new SpeechSynthesisUtterance(vocabItem.characters);
                          utterance.lang = 'zh-CN';
                          window.speechSynthesis.speak(utterance);
                        }}
                        className="p-1 hover:bg-gray-100 text-gray-500 rounded"
                        title="Quick Speak"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9.5H4.5v5h3.25L12 18.75z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                {activeVocab.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-6">Your study list is empty.</p>
                )}
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* Footer copyright */}
      <footer className="max-w-7xl mx-auto px-4 border-t border-gray-200 py-6 mt-12 text-center text-xs text-gray-400">
        HanziFlow Vocabulary System. Designed for rapid GTM. Powered by Founder OS Framework.
      </footer>
    </div>
  );
};
export default App;
