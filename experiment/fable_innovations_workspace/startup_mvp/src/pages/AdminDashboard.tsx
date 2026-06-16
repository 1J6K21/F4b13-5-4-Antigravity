import { useState } from 'react';
import { useAppStore } from '../store/store';
import { LogOut, LayoutDashboard, Database, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { user, tickets, knowledgeBase, updateKnowledgeBase, logout } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'analytics' | 'tickets' | 'knowledge'>('analytics');
  const [kbText, setKbText] = useState(knowledgeBase);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
  const escalatedCount = tickets.filter(t => t.status === 'escalated').length;
  const openCount = tickets.filter(t => t.status === 'open').length;

  const chartData = [
    { name: 'Resolved by AI', count: resolvedCount, fill: '#10B981' },
    { name: 'Escalated', count: escalatedCount, fill: '#F59E0B' },
    { name: 'Open', count: openCount, fill: '#6366F1' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1 rounded">R</span>
            ResolvAI Admin
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="h-5 w-5" /> Analytics
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${activeTab === 'tickets' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <MessageSquare className="h-5 w-5" /> All Tickets
          </button>
          <button 
            onClick={() => setActiveTab('knowledge')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${activeTab === 'knowledge' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Database className="h-5 w-5" /> Knowledge Base
          </button>
        </nav>
        <div className="p-4 border-t">
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 w-full px-4 py-2">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Total Tickets</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{tickets.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Autonomous Resolution Rate</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {tickets.length ? Math.round((resolvedCount / tickets.length) * 100) : 0}%
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Money Saved (Est)</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">${resolvedCount * 5}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-96">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Outcomes</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Ticket Stream</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tickets.map((t) => (
                      <tr key={t.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.customerEmail}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${t.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                              t.status === 'escalated' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-indigo-100 text-indigo-800'}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Knowledge Base</h2>
              <p className="text-gray-500 text-sm">Train your ResolvAI agent by providing policies and resolution steps.</p>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
                <textarea
                  value={kbText}
                  onChange={(e) => setKbText(e.target.value)}
                  rows={12}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4 border"
                />
                <button
                  onClick={() => updateKnowledgeBase(kbText)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded shadow-sm hover:bg-indigo-700 font-medium"
                >
                  Save & Retrain Agent
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
