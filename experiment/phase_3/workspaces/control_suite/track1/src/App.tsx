import React, { useState, useEffect } from 'react';
import { VocabularyImport, VocabularyItem } from './components/VocabularyImport';
import { PinyinRecallCard } from './components/PinyinRecallCard';
import { JournalFeedback } from './components/JournalFeedback';

export const App: React.FC = () => {
  const [vocabList, setVocabList] = useState<VocabularyItem[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'study' | 'vocab' | 'journal'>('study');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Fetch initial vocabulary and journals from Express server
  const fetchData = async () => {
    try {
      const vocabRes = await fetch('http://localhost:3001/api/vocab');
      if (vocabRes.ok) {
        const vocabData = await vocabRes.json();
        if (vocabData.success) {
          setVocabList(vocabData.data);
        }
      }

      const journalRes = await fetch('http://localhost:3001/api/journals');
      if (journalRes.ok) {
        const journalData = await journalRes.json();
        if (journalData.success) {
          setJournals(journalData.data);
        }
      }
    } catch (err) {
      console.error('Error fetching initial data from server:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImportSuccess = (imported: VocabularyItem[]) => {
    setVocabList(prev => [...prev, ...imported]);
  };

  const handleJournalSubmitted = (newEntry: any) => {
    setJournals(prev => [newEntry, ...prev]);
  };

  const handleCardFeedback = async (rating: number) => {
    // 1. Submit review feedback to the backend to update spaced repetition (progress tracking)
    if (vocabList[currentCardIndex]) {
      try {
        await fetch('http://localhost:3001/api/vocab/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vocabId: vocabList[currentCardIndex].id,
            rating
          })
        });
      } catch (err) {
        console.error('Failed to submit review progress:', err);
      }
    }

    // 2. Advance to the next card index in the queue
    if (vocabList.length > 0) {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % vocabList.length);
    }
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px', color: '#333' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, color: '#333' }}>汉字Flow (HanziFlow)</h1>
        <span style={{ fontSize: '0.9rem', padding: '4px 8px', borderRadius: '12px', backgroundColor: '#eee', fontWeight: 'bold' }}>
          Vocab Size: {vocabList.length}
        </span>
      </header>

      {/* Import Section always visible or togglable */}
      <VocabularyImport onImportSuccess={handleImportSuccess} />

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('study')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'study' ? '3px solid #007bff' : 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeTab === 'study' ? 'bold' : 'normal'
          }}
        >
          📖 Study Cards
        </button>
        <button
          onClick={() => setActiveTab('vocab')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'vocab' ? '3px solid #007bff' : 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeTab === 'vocab' ? 'bold' : 'normal'
          }}
        >
          🗂 All Vocabulary
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'journal' ? '3px solid #007bff' : 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeTab === 'journal' ? 'bold' : 'normal'
          }}
        >
          ✍ Journaling
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'study' && (
        <div>
          {vocabList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed #ccc', borderRadius: '8px', color: '#777' }}>
              <h3>No vocabulary items available yet.</h3>
              <p>Please paste some CSV text or upload a CSV file above to start studying!</p>
            </div>
          ) : (
            <div>
              <PinyinRecallCard
                vocabItem={vocabList[currentCardIndex]}
                onFeedback={handleCardFeedback}
              />
              <div style={{ textAlign: 'center', marginTop: '10px', color: '#666', fontSize: '0.9rem' }}>
                Card {currentCardIndex + 1} of {vocabList.length} (loops continuously)
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'vocab' && (
        <div>
          <h3>Vocabulary List</h3>
          {vocabList.length === 0 ? (
            <p style={{ color: '#777', fontStyle: 'italic' }}>No vocabulary items found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Character</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Pinyin</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Definition</th>
                </tr>
              </thead>
              <tbody>
                {vocabList.map((item, idx) => (
                  <tr key={item.id || idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontSize: '1.2rem', fontWeight: 'bold' }}>{item.character}</td>
                    <td style={{ padding: '12px', color: '#0056b3' }}>{item.pinyin}</td>
                    <td style={{ padding: '12px' }}>{item.definition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'journal' && (
        <div>
          <JournalFeedback vocabList={vocabList} onJournalSubmitted={handleJournalSubmitted} />

          <h3 style={{ marginTop: '30px' }}>Journal History</h3>
          {journals.length === 0 ? (
            <p style={{ color: '#777', fontStyle: 'italic' }}>No journal entries yet. Write your first reflection above!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              {journals.map((entry) => (
                <div key={entry.id} style={{ border: '1px solid #eee', borderRadius: '6px', padding: '15px', backgroundColor: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#777' }}>
                    <span>Recall Rating: <strong>{entry.rating}/5</strong></span>
                    <span>{new Date(entry.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '1rem', color: '#333' }}>{entry.scrubbedContent}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default App;
