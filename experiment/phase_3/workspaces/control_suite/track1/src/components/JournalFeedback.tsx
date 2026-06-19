import React, { useState } from 'react';
import { VocabularyItem } from './VocabularyImport';

interface JournalFeedbackProps {
  vocabList: VocabularyItem[];
  onJournalSubmitted: (entry: any) => void;
}

export const JournalFeedback: React.FC<JournalFeedbackProps> = ({ vocabList, onJournalSubmitted }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [selectedVocabIds, setSelectedVocabIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successEntry, setSuccessEntry] = useState<any | null>(null);

  const toggleVocabSelection = (id: number) => {
    setSelectedVocabIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessEntry(null);

    if (!content.trim()) {
      setError('Journal content cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          rating,
          vocabIds: selectedVocabIds
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit journal');
      }

      setSuccessEntry(data.journal);
      setContent('');
      setSelectedVocabIds([]);
      onJournalSubmitted(data.journal);
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', marginTop: '20px' }}>
      <h3 style={{ marginTop: 0 }}>Create a Vocab Journal Entry</h3>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        Write a short paragraph or sentence practicing your vocabulary. The server will scrub any sensitive PII (emails, phone numbers, etc.) automatically.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Vocabulary Word Selector */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Associate Vocabulary Word(s):
          </label>
          {vocabList.length === 0 ? (
            <span style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>
              No vocabulary words available. Please import some first.
            </span>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '100px', overflowY: 'auto', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
              {vocabList.map(v => {
                const isSelected = selectedVocabIds.includes(v.id);
                return (
                  <button
                    type="button"
                    key={v.id}
                    onClick={() => toggleVocabSelection(v.id)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #bbb',
                      backgroundColor: isSelected ? '#28a745' : '#f8f9fa',
                      color: isSelected ? 'white' : '#333',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    {v.character} ({v.pinyin})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Journal Content:</label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Today I called my mom at 555-0199 and said 你好!"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        {/* Rating Slider/Radio */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Recall confidence rating (1 - Poor, 5 - Excellent): <strong>{rating}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        {error && <div style={{ color: '#d9534f', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Submitting...' : 'Save Journal Entry'}
        </button>
      </form>

      {/* Success display showing PII Redaction comparison */}
      {successEntry && (
        <div style={{ marginTop: '20px', borderTop: '2px solid #5cb85c', paddingTop: '15px', backgroundColor: '#f4fbf4', padding: '10px', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#5cb85c' }}>✓ Journal Entry Saved!</h4>
          <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
            <strong>Original Text:</strong>
            <p style={{ margin: '3px 0', color: '#666', fontStyle: 'italic' }}>{successEntry.originalContent}</p>
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            <strong>Persisted (PII-Scrubbed) Text:</strong>
            <p style={{ margin: '3px 0', color: '#2b542c', fontWeight: 'bold' }}>{successEntry.scrubbedContent}</p>
          </div>
        </div>
      )}
    </div>
  );
};
