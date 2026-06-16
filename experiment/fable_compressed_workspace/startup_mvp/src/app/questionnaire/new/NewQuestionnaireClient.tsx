"use client";

import { useStore } from "@/store/useStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2 } from "lucide-react";

export default function NewQuestionnaireClient() {
  const addQuestionnaire = useStore((state) => state.addQuestionnaire);
  const documents = useStore((state) => state.documents);
  const router = useRouter();

  const [name, setName] = useState("");
  const [questionsText, setQuestionsText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !questionsText) return;

    setLoading(true);

    // Mock AI Generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const questions = questionsText.split("\n").filter((q) => q.trim().length > 0);
    const qas = questions.map((q) => {
      // Simple mock logic: check if keywords exist in docs
      const lowerQ = q.toLowerCase();
      let answer = "I do not have enough information to answer this based on the knowledge base.";
      
      const combinedDocs = documents.map(d => d.content.toLowerCase()).join(" ");
      
      if (combinedDocs.length > 0) {
          if (lowerQ.includes("encrypt") || lowerQ.includes("data at rest")) {
              answer = "Yes, data is encrypted at rest using industry-standard AES-256 encryption.";
          } else if (lowerQ.includes("mfa") || lowerQ.includes("multi-factor")) {
              answer = "Yes, Multi-Factor Authentication (MFA) is enforced for all employees.";
          } else if (lowerQ.includes("soc") || lowerQ.includes("compliance")) {
              answer = "We are SOC 2 Type II compliant and undergo annual audits.";
          } else if (lowerQ.includes("penetration") || lowerQ.includes("pentest")) {
              answer = "Yes, we conduct third-party penetration testing annually.";
          } else {
              answer = "Based on our security policies, we adhere to industry best practices regarding this matter. (Needs Review)";
          }
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        question: q.trim(),
        answer,
        status: "pending" as const,
      };
    });

    const newQ = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      createdAt: new Date().toISOString(),
      qas,
    };

    addQuestionnaire(newQ);
    router.push(`/questionnaire/${newQ.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          New Questionnaire
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Paste the list of security questions you need answered. The AI will generate responses based on your Knowledge Base.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg border border-gray-100 p-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Questionnaire Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Acme Corp Vendor Assessment"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Questions (One per line)</label>
            <textarea
              rows={10}
              value={questionsText}
              onChange={(e) => setQuestionsText(e.target.value)}
              placeholder="Do you encrypt data at rest?&#10;Is MFA required?&#10;..."
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          {documents.length === 0 && (
             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
               <div className="flex">
                 <div className="ml-3">
                   <p className="text-sm text-yellow-700">
                     Warning: You have no documents in your Knowledge Base. The AI will not be able to generate accurate answers.
                   </p>
                 </div>
               </div>
             </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Generating Answers...
              </>
            ) : (
              <>
                <UploadCloud className="-ml-1 mr-2 h-5 w-5" />
                Generate Answers
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
