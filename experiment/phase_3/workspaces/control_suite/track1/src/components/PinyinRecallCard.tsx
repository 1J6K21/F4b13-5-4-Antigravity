import React, { useState } from 'react';
import { VocabularyItem } from './VocabularyImport';
import { AudioPlayerSlider } from './AudioPlayerSlider';

interface PinyinRecallCardProps {
  vocabItem: VocabularyItem;
  onFeedback: (rating: number) => void;
}

export const PinyinRecallCard: React.FC<PinyinRecallCardProps> = ({ vocabItem, onFeedback }) => {
  const [revealed, setRevealed] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleSubmitFeedback = () => {
    if (selectedRating !== null) {
      onFeedback(selectedRating);
      // Reset card state for the next item
      setRevealed(false);
      setSelectedRating(null);
    }
  };

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '12px',
      padding: '24px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      maxWidth: '450px',
      margin: '20px auto',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '1rem', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Active Recall Card
      </div>
      
      {/* Target Chinese Character */}
      <div style={{ fontSize: '4.5rem', fontWeight: 'bold', margin: '20px 0', color: '#333' }}>
        {vocabItem.character}
      </div>

      {/* Audio pronunciation controls */}
      <AudioPlayerSlider text={vocabItem.character} />

      {!revealed ? (
        <button
          onClick={handleReveal}
          style={{
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginTop: '20px',
            width: '100%'
          }}
        >
          👀 Show Pinyin & Definition
        </button>
      ) : (
        <div style={{ marginTop: '20px', textAlign: 'left', borderTop: '2px dashed #eee', paddingTop: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: '#666' }}>Pinyin:</span>
            <span style={{ fontSize: '1.4rem', marginLeft: '10px', color: '#0056b3', fontWeight: 'bold' }}>
              {vocabItem.pinyin}
            </span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontWeight: 'bold', color: '#666' }}>Definition:</span>
            <span style={{ fontSize: '1.2rem', marginLeft: '10px', color: '#333' }}>
              {vocabItem.definition}
            </span>
          </div>

          {/* User performance self-evaluation rating */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>
              How well did you recall this?
            </label>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '15px' }}>
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedRating(num)}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: selectedRating === num ? '#007bff' : '#f8f9fa',
                    color: selectedRating === num ? '#fff' : '#333',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmitFeedback}
              disabled={selectedRating === null}
              style={{
                backgroundColor: selectedRating === null ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: selectedRating === null ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              Submit & Next Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
