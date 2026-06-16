"use client";

import { useStore } from "@/store/useStore";
import Link from "next/link";
import { FileText, Database, Plus, CheckCircle } from "lucide-react";

export default function DashboardClient() {
  const documents = useStore((state) => state.documents);
  const questionnaires = useStore((state) => state.questionnaires);

  const completed = questionnaires.reduce(
    (acc, q) => acc + q.qas.filter((qa) => qa.status === "approved").length,
    0
  );
  const total = questionnaires.reduce((acc, q) => acc + q.qas.length, 0);
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Welcome back
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            href="/questionnaire/new"
            className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            New Questionnaire
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Database className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Knowledge Base Docs</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{documents.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/knowledge" className="font-medium text-indigo-600 hover:text-indigo-900">
                Manage documents
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Questionnaires</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{questionnaires.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/questionnaire" className="font-medium text-indigo-600 hover:text-indigo-900">
                View all
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Automation Rate</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{progress}%</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm text-gray-500">Answers approved</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg border border-gray-100">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Questionnaires</h3>
        </div>
        <ul role="list" className="divide-y divide-gray-200">
          {questionnaires.length === 0 ? (
            <li className="p-6 text-center text-gray-500">No questionnaires yet. Upload one to get started.</li>
          ) : (
            questionnaires.slice(-5).reverse().map((q) => (
              <li key={q.id}>
                <Link href={`/questionnaire/${q.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div className="text-sm font-medium text-indigo-600 truncate">{q.name}</div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {q.qas.filter((qa) => qa.status === 'approved').length} / {q.qas.length} Approved
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
