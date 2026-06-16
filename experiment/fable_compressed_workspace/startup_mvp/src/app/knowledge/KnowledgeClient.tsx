"use client";

import { useStore } from "@/store/useStore";
import { useState } from "react";
import { UploadCloud, File, Trash2 } from "lucide-react";

export default function KnowledgeClient() {
  const documents = useStore((state) => state.documents);
  const addDocument = useStore((state) => state.addDocument);
  const removeDocument = useStore((state) => state.removeDocument);

  const [text, setText] = useState("");
  const [docName, setDocName] = useState("");

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !docName) return;

    addDocument({
      id: Math.random().toString(36).substr(2, 9),
      name: docName,
      content: text,
      uploadedAt: new Date().toISOString(),
    });

    setText("");
    setDocName("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Knowledge Base
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Upload your past security questionnaires, SOC2 reports, and security policies here. The AI will use these to answer new questionnaires.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg border border-gray-100 p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Source</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Document Name</label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g., Q3 2023 Security Policy"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste document content or past QA pairs here..."
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <UploadCloud className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add to Knowledge Base
          </button>
        </form>
      </div>

      <div className="bg-white shadow sm:rounded-lg border border-gray-100">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Uploaded Sources ({documents.length})</h3>
        </div>
        <ul role="list" className="divide-y divide-gray-200">
          {documents.length === 0 ? (
            <li className="p-6 text-center text-gray-500">No sources uploaded yet.</li>
          ) : (
            documents.map((doc) => (
              <li key={doc.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center">
                  <File className="h-6 w-6 text-indigo-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
