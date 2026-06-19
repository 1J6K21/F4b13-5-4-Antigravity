import React, { useState } from 'react';

interface VocabItem {
  id: string;
  characters: string;
  pinyin: string;
  english: string;
}

interface VocabularyImportProps {
  onImportSuccess: (newItems: VocabItem[]) => void;
}

export const VocabularyImport: React.FC<VocabularyImportProps> = ({ onImportSuccess }) => {
  const [csvInput, setCsvInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!csvInput.trim()) {
      setError('Please paste some CSV content first.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/vocab/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData: csvInput }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(`Successfully imported ${data.importedCount} vocabulary words!`);
        onImportSuccess(data.items);
        setCsvInput('');
      } else {
        setError(data.error || 'Failed to import vocabulary.');
      }
    } catch (err) {
      setError('Connection to server failed. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    setCsvInput(
      'characters,pinyin,english\n' +
      '香蕉,xiāngjiāo,banana\n' +
      '狗,gǒu,dog\n' +
      '水,shuǐ,water\n' +
      '学校,xuéxiào,school'
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">CSV Vocabulary Import</h2>
        <button
          type="button"
          onClick={loadSampleData}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
        >
          Load Sample CSV
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Import your custom decks. Ensure your CSV has a header containing: 
        <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-600 font-mono mx-1">characters</code>, 
        <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-600 font-mono mx-1">pinyin</code>, and 
        <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-600 font-mono mx-1">english</code>.
      </p>

      <form onSubmit={handleImport} className="space-y-4">
        <div>
          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            rows={5}
            placeholder="characters,pinyin,english&#10;苹果,píngguǒ,apple&#10;猫,māo,cat"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Processing...' : 'Import Vocabulary'}
        </button>
      </form>
    </div>
  );
};
