import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { FileText, PlusCircle, ArrowRight } from 'lucide-react';

export default async function Dashboard() {
  const session = getSession();
  if (!session) {
    redirect('/login');
  }

  // Fetch analyses for the user
  const analyses = db.prepare('SELECT * FROM analyses WHERE user_id = ? ORDER BY created_at DESC').all(session.userId) as any[];

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Welcome to Insightify
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Here are your recent feedback analyses.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Analysis
            </Link>
          </div>
        </div>

        {analyses.length === 0 ? (
          <div className="text-center bg-white rounded-lg shadow px-4 py-12 sm:px-6 lg:px-8 border border-gray-200 border-dashed">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No analyses yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by uploading a CSV of customer feedback.</p>
            <div className="mt-6">
              <Link
                href="/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Upload CSV
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {analyses.map((analysis) => (
                <li key={analysis.id}>
                  <Link href={`/analysis/${analysis.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-6 w-6 text-gray-400 mr-4" />
                        <div>
                          <p className="text-sm font-medium text-blue-600 truncate">{analysis.title}</p>
                          <p className="mt-1 flex items-center text-sm text-gray-500">
                            {new Date(analysis.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${analysis.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {analysis.status}
                        </span>
                        <ArrowRight className="ml-4 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
