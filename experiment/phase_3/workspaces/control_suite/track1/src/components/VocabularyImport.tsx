import React, { useState } from 'react';

export interface VocabularyItem {
  id: number;
  character: string;
  pinyin: string;
  definition: string;
}

interface VocabularyImportProps {
  onImportSuccess: (imported: VocabularyItem[]) => void;
}

export const VocabularyImport: React.FC<VocabularyImportProps> = ({ onImportSuccess }) => {
  const [csvText, setCsvText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
    };
    reader.onerror = () => {
      setError('Failed to read CSV file');
    };
    reader.readAsText(file);
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!csvText.trim()) {
      setError('Please provide CSV data by pasting text or uploading a file.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/vocab/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to import vocabulary');
      }

      setSuccess(`Successfully imported ${result.importedCount} vocabulary items!`);
      setCsvText('');
      onImportSuccess(result.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during import.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginTop: 0 }}>Import Chinese Vocabulary</h3>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        Import a CSV file or paste raw CSV text with the headers: <code>character,pinyin,definition</code>.
      </p>
      
      <form onSubmit={handleImport}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Upload CSV File:</label>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            style={{ display: 'block', width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Or Paste CSV Text:</label>
          <textarea
            rows={5}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="character,pinyin,definition&#10;你好,nǐ hǎo,hello&#10;谢谢,xièxie,thank you"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', fontFamily: 'monospace', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {error && <div style={{ color: '#d9534f', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}
        {success && <div style={{ color: '#5cb85c', marginBottom: '15px', fontWeight: 'bold' }}>{success}</div>}

        <button 
          type="submit" 
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Importing...' : 'Import Vocabulary'}
        </button>
      </form>
    </div>
  );
};
