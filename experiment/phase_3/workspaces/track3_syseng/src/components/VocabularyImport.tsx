import React, { useState } from 'react';

interface VocabItem {
  id: string;
  character: string;
  pinyin: string;
  translation: string;
}

interface VocabularyImportProps {
  onImportSuccess: (newItems: VocabItem[]) => void;
}

export const VocabularyImport: React.FC<VocabularyImportProps> = ({ onImportSuccess }) => {
  const [csvText, setCsvText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const validateLocalCsv = (text: string): string | null => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return 'CSV content is empty.';
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    if (!headers.includes('character') || !headers.includes('pinyin') || !headers.includes('translation')) {
      return "CSV headers must include 'character', 'pinyin', and 'translation'.";
    }
    
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',').map(c => c.trim());
      if (columns.length < 3) {
        return `Row ${i + 1} has fewer than 3 columns.`;
      }
    }
    return null;
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessCount(null);

    const validationError = validateLocalCsv(csvText);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/vocab/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csvText }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to import vocabulary.');
      }

      setSuccessCount(data.count);
      onImportSuccess(data.items);
      setCsvText('');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during import.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-950 mb-2">Import Custom Vocabulary</h3>
      <p className="text-sm text-gray-500 mb-4">
        Enter comma-separated lines. The first row must define the headers: 
        <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded font-mono text-xs ml-1">
          character,pinyin,translation
        </code>.
      </p>

      <form onSubmit={handleImport} className="space-y-4">
        <div>
          <label htmlFor="csv-input" className="sr-only">CSV Vocabulary Text</label>
          <textarea
            id="csv-input"
            rows={5}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="character,pinyin,translation&#10;苹果,píngguǒ,apple&#10;香蕉,xiāngjiāo,banana"
            className="w-full font-mono text-sm border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-950"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        {successCount !== null && (
          <div className="p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200">
            Successfully imported {successCount} vocabulary items!
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !csvText.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Importing...' : 'Upload & Import'}
        </button>
      </form>
    </div>
  );
};
