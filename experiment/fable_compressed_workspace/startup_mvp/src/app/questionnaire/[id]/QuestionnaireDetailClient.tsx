"use client";

import { useStore } from "@/store/useStore";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Check, X, Download, ArrowLeft, Edit2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function QuestionnaireDetailClient() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const questionnaire = useStore((state) => 
    state.questionnaires.find((q) => q.id === id)
  );
  const updateQAStatus = useStore((state) => state.updateQAStatus);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  if (!questionnaire) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Questionnaire not found.</p>
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Question,Answer,Status\n"
      + questionnaire.qas.map(e => `"${e.question.replace(/"/g, '""')}","${e.answer.replace(/"/g, '""')}","${e.status}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${questionnaire.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const progress = Math.round(
    (questionnaire.qas.filter((qa) => qa.status === "approved").length / questionnaire.qas.length) * 100
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {questionnaire.name}
        </h2>
      </div>

      <div className="bg-white shadow sm:rounded-lg border border-gray-100 p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Progress</p>
          <p className="text-2xl font-bold text-gray-900">{progress}% Approved</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Download className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
          Export to CSV
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {questionnaire.qas.map((qa) => (
            <li key={qa.id} className={cn("p-6", qa.status === 'approved' ? 'bg-green-50' : qa.status === 'rejected' ? 'bg-red-50' : 'bg-white')}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Q: {qa.question}</h4>
                  
                  {editingId === qa.id ? (
                    <div className="mt-2">
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => {
                            updateQAStatus(questionnaire.id, qa.id, 'approved', editValue);
                            setEditingId(null);
                          }}
                          className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                        >
                          Save & Approve
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-100 flex-1">
                        {qa.answer}
                      </p>
                      <button
                        onClick={() => {
                          setEditingId(qa.id);
                          setEditValue(qa.answer);
                        }}
                        className="ml-4 text-gray-400 hover:text-indigo-600 p-1"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {!editingId && (
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <button
                      onClick={() => updateQAStatus(questionnaire.id, qa.id, 'approved')}
                      className={cn("p-2 rounded-full border", qa.status === 'approved' ? "bg-green-100 border-green-200 text-green-600" : "bg-white border-gray-300 text-gray-400 hover:text-green-600 hover:border-green-300")}
                      title="Approve"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => updateQAStatus(questionnaire.id, qa.id, 'rejected')}
                      className={cn("p-2 rounded-full border", qa.status === 'rejected' ? "bg-red-100 border-red-200 text-red-600" : "bg-white border-gray-300 text-gray-400 hover:text-red-600 hover:border-red-300")}
                      title="Reject"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
