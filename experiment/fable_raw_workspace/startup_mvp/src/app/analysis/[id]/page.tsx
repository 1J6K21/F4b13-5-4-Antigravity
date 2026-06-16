import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';
import Navigation from '@/components/Navigation';
import { PieChart, List, MessageSquare } from 'lucide-react';

export default async function AnalysisDetail({ params }: { params: { id: string } }) {
  const session = getSession();
  if (!session) {
    redirect('/login');
  }

  const analysis = db.prepare('SELECT * FROM analyses WHERE id = ? AND user_id = ?').get(params.id, session.userId) as any;
  if (!analysis) {
    return (
      <>
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900">Analysis not found</h1>
        </main>
      </>
    );
  }

  const insights = db.prepare('SELECT * FROM insights WHERE analysis_id = ? ORDER BY count DESC').all(params.id) as any[];

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="pb-5 border-b border-gray-200 mb-8">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {analysis.title}
          </h2>
          <p className="mt-2 text-sm text-gray-500 flex items-center">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold mr-3">
              {analysis.status}
            </span>
            Created on {new Date(analysis.created_at).toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {insights.map((insight, idx) => (
            <div key={insight.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {idx === 0 ? <MessageSquare className="h-6 w-6 text-red-400" /> : <List className="h-6 w-6 text-blue-400" />}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{insight.category}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{insight.count} mentions</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <p className="text-gray-700 italic">&quot;{insight.summary}&quot;</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </>
  );
}
