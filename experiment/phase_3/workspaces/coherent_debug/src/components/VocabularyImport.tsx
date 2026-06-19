import React, { useState, useRef } from 'react';

interface VocabularyImportProps {
  onImportSuccess?: (listId: string, title: string, count: number) => void;
  isPremium?: boolean;
  token?: string;
}

interface CSVRow {
  character: string;
  pinyin: string;
  definition: string;
  error?: string;
}

export const VocabularyImport: React.FC<VocabularyImportProps> = ({ onImportSuccess, isPremium = false, token }) => {
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<CSVRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simple robust RFC 4180 compliant CSV parser
  const parseCSVText = (text: string): string[][] => {
    const lines: string[][] = [];
    let row: string[] = [];
    let currentVal = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            currentVal += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          currentVal += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          row.push(currentVal);
          currentVal = '';
        } else if (char === '\n' || char === '\r') {
          if (char === '\r' && nextChar === '\n') {
            i++;
          }
          row.push(currentVal);
          lines.push(row);
          row = [];
          currentVal = '';
        } else {
          currentVal += char;
        }
      }
    }
    
    if (row.length > 0 || currentVal !== '') {
      row.push(currentVal);
      lines.push(row);
    }
    
    return lines.map(r => r.map(cell => cell.trim()));
  };

  const handleFileChange = (selectedFile: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setValidationErrors([]);
    setPreviewRows([]);

    if (selectedFile.size > 2 * 1024 * 1024) {
      setErrorMsg('The uploaded CSV file exceeds the maximum allowed size of 2MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);

    // Parse locally for interactive preview and validations
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const rawRows = parseCSVText(text).filter(r => r.length > 0 && r.some(cell => cell !== ''));
      if (rawRows.length < 2) {
        setValidationErrors(['CSV must contain a header row and at least one data row.']);
        return;
      }

      const headers = rawRows[0].map(h => h.toLowerCase());
      const charIndex = headers.indexOf('character');
      const pinyinIndex = headers.indexOf('pinyin');
      const defIndex = headers.indexOf('definition');

      if (charIndex === -1 || pinyinIndex === -1 || defIndex === -1) {
        setValidationErrors([
          `Invalid headers: Found [${rawRows[0].join(', ')}]. Expected columns: "character", "pinyin", and "definition".`
        ]);
        return;
      }

      const parsed: CSVRow[] = [];
      const errors: string[] = [];

      for (let i = 1; i < rawRows.length; i++) {
        const rowData = rawRows[i];
        
        // Pad row if it has fewer elements than headers
        const character = rowData[charIndex] || '';
        const pinyin = rowData[pinyinIndex] || '';
        const definition = rowData[defIndex] || '';

        const rowErrors: string[] = [];

        // Validate character (Chinese character range \u4e00-\u9fa5)
        const chinRegex = /^[\u4e00-\u9fa5]+$/;
        if (!character) {
          rowErrors.push('Missing character');
        } else if (!chinRegex.test(character)) {
          rowErrors.push('Character column must contain ONLY Chinese characters (\\u4e00-\\u9fa5)');
        } else if (character.length > 20) {
          rowErrors.push('Character length must not exceed 20');
        }

        // Validate pinyin
        if (!pinyin) {
          rowErrors.push('Missing pinyin');
        }

        // Validate definition
        if (!definition) {
          rowErrors.push('Missing definition');
        } else if (definition.length > 500) {
          rowErrors.push('Definition length must not exceed 500 characters');
        }

        const rowErrStr = rowErrors.join(', ');
        if (rowErrStr) {
          errors.push(`Row ${i + 1}: ${rowErrStr}`);
        }

        parsed.push({
          character,
          pinyin,
          definition,
          error: rowErrStr || undefined
        });
      }

      setPreviewRows(parsed);
      setValidationErrors(errors);
      
      // Auto-populate list title from filename if not set
      if (!title) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        setTitle(nameWithoutExt.replace(/[-_]/g, ' '));
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a CSV file to upload.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Please specify a title for this vocabulary list.');
      return;
    }
    if (validationErrors.length > 0) {
      setErrorMsg('Please resolve CSV validation errors before uploading.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('is_public', String(isPublic));
    formData.append('file', file);

    try {
      const response = await fetch('/api/v1/vocabulary-lists/import', {
        method: 'POST',
        headers: {
          'Authorization': isPremium ? 'Bearer premium-token' : 'Bearer free-token'
        },
        body: formData,
      });

      const resData = await response.json();

      if (!response.ok) {
        if (resData.error && resData.error.message) {
          let detailedErr = resData.error.message;
          if (resData.error.details && Array.isArray(resData.error.details)) {
            detailedErr += '\n' + resData.error.details.map((d: any) => `Row ${d.row}: ${d.issue}`).join('\n');
          }
          throw new Error(detailedErr);
        } else {
          throw new Error(resData.message || 'Import failed with status code ' + response.status);
        }
      }

      setSuccessMsg(`Successfully imported vocabulary list! "${resData.data.title}" loaded with ${resData.data.imported_count} words.`);
      setFile(null);
      setPreviewRows([]);
      setTitle('');
      setIsPublic(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onImportSuccess && resData.data.list_id) {
        onImportSuccess(resData.data.list_id, resData.data.title, resData.data.imported_count);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during list importation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-100 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-indigo-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        CSV Vocabulary Import
      </h2>
      <p className="text-slate-400 text-sm mb-6">
        Upload a custom deck. The CSV must have headers: <code className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded">character</code>, <code className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded">pinyin</code>, and <code className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded">definition</code>.
      </p>

      <form onSubmit={handleUploadSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Vocabulary Deck Title
            </label>
            <input
              type="text"
              placeholder="e.g. HSK 3 - Fruits"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-end h-full pb-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-700 bg-slate-800 rounded focus:ring-indigo-500 focus:ring-offset-slate-900"
              />
              <span className="text-sm font-medium text-slate-300">Share Publicly (Available to other users)</span>
            </label>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10'
              : file
              ? 'border-emerald-600 bg-emerald-950/10'
              : 'border-slate-700 hover:border-indigo-400 bg-slate-800/40'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
            accept=".csv"
            className="hidden"
          />
          <svg className="w-10 h-10 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm font-medium block mb-1">
            {file ? file.name : 'Drag & drop your CSV file here, or click to browse'}
          </span>
          <span className="text-xs text-slate-500">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Maximum file size: 2MB'}
          </span>
        </div>

        {/* Errors & Alerts */}
        {errorMsg && (
          <div className="bg-rose-900/40 border border-rose-800 text-rose-200 px-4 py-3 rounded text-sm whitespace-pre-line">
            <strong>Import Error:</strong> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-300 px-4 py-3 rounded text-sm">
            {successMsg}
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="bg-amber-950/40 border border-amber-800 text-amber-200 px-4 py-3 rounded text-xs space-y-1 max-h-36 overflow-y-auto">
            <div className="font-semibold text-sm mb-1 text-amber-400">CSV Form Validation Warnings:</div>
            {validationErrors.map((err, idx) => (
              <div key={idx}>• {err}</div>
            ))}
          </div>
        )}

        {/* Preview Panel */}
        {previewRows.length > 0 && (
          <div className="mt-4 border border-slate-800 rounded bg-slate-950 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">CSV Upload Preview ({previewRows.length} words found)</h3>
            <div className="overflow-x-auto max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium">
                    <th className="py-2 px-3">Character</th>
                    <th className="py-2 px-3">Pinyin</th>
                    <th className="py-2 px-3">Definition</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {previewRows.slice(0, 10).map((row, index) => (
                    <tr key={index} className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-medium text-slate-100">{row.character}</td>
                      <td className="py-2 px-3 text-slate-300">{row.pinyin}</td>
                      <td className="py-2 px-3 text-slate-400 truncate max-w-xs">{row.definition}</td>
                      <td className="py-2 px-3 text-right">
                        {row.error ? (
                          <span className="text-rose-400 font-medium" title={row.error}>❌ Invalid</span>
                        ) : (
                          <span className="text-emerald-400 font-medium">✓ Valid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewRows.length > 10 && (
                <div className="text-slate-500 text-[10px] text-center pt-2 italic">
                  Showing first 10 of {previewRows.length} rows...
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !file || validationErrors.length > 0}
            className={`px-5 py-2.5 rounded font-semibold text-sm shadow transition-all ${
              isLoading || !file || validationErrors.length > 0
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
                Processing Import...
              </span>
            ) : (
              'Confirm & Import List'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
