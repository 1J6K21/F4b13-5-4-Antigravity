'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Papa from 'papaparse';
import { UploadCloud } from 'lucide-react';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setLoading(true);
    setError('');

    Papa.parse(file, {
      complete: async (results) => {
        // Extract feedback text from first column or named column
        const rows = results.data as any[];
        // Simple extraction: just take all string values
        let feedback: string[] = [];
        for (const row of rows) {
          const values = Object.values(row);
          if (values.length > 0 && typeof values[0] === 'string' && values[0].trim() !== '') {
             feedback.push(values[0]);
          }
        }

        try {
          const res = await fetch('/api/analyses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, feedback }),
          });

          if (res.ok) {
            const data = await res.json();
            router.push(`/analysis/${data.analysisId}`);
          } else {
            const data = await res.json();
            setError(data.error || 'Failed to analyze feedback');
            setLoading(false);
          }
        } catch (err) {
          setError('Network error');
          setLoading(false);
        }
      },
      header: true,
      skipEmptyLines: true
    });
  };

  return (
    <>
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">New Feedback Analysis</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Upload a CSV file containing your user feedback (e.g. App Store reviews, Zendesk tickets).</p>
            </div>
            <form className="mt-5" onSubmit={handleUpload}>
              {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Analysis Title</label>
                <input
                  type="text"
                  required
                  className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="e.g., Q3 App Store Reviews"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">CSV File</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" accept=".csv" required onChange={(e) => setFile(e.target.files?.[0] || null)} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">CSV up to 10MB</p>
                    {file && <p className="text-sm font-semibold text-gray-900 mt-2">{file.name}</p>}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {loading ? 'Analyzing with AI...' : 'Analyze Feedback'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
