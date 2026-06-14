import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Plus,
  Trash2,
  DollarSign,
  TrendingDown,
  Calendar,
  PieChart as PieChartIcon
} from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

function App() {
  const [cashBalance, setCashBalance] = useState(150000);
  const [expenses, setExpenses] = useState([
    { id: generateId(), name: 'Server Hosting', amount: 500, category: 'Infrastructure' },
    { id: generateId(), name: 'SaaS Tools', amount: 300, category: 'Software' },
    { id: generateId(), name: 'Contractors', amount: 4000, category: 'Payroll' },
  ]);

  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: 'General' });

  // Calculations
  const monthlyBurn = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const runwayMonths = monthlyBurn > 0 ? (cashBalance / monthlyBurn).toFixed(1) : '∞';

  // Generate projection data
  const projectionData = useMemo(() => {
    const data = [];
    let currentCash = cashBalance;
    const monthsToProject = monthlyBurn > 0 ? Math.min(Math.ceil(cashBalance / monthlyBurn) + 2, 24) : 12;

    for (let i = 0; i <= monthsToProject; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      const monthStr = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      data.push({
        month: monthStr,
        cash: Math.max(currentCash, 0),
        cashLabel: Math.max(currentCash, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
      });
      
      currentCash -= monthlyBurn;
    }
    return data;
  }, [cashBalance, monthlyBurn]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.name || !newExpense.amount) return;
    
    setExpenses([...expenses, {
      id: generateId(),
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category
    }]);
    
    setNewExpense({ name: '', amount: '', category: 'General' });
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <TrendingDown className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">RunwayTracker</h1>
          </div>
          <div className="text-sm font-medium text-slate-500">Startup Financial Dashboard</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Current Cash</h3>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="mt-2 flex items-baseline">
              <input 
                type="number" 
                value={cashBalance}
                onChange={(e) => setCashBalance(Number(e.target.value))}
                className="text-4xl font-extrabold text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none w-full max-w-[200px]"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Monthly Burn</h3>
              <TrendingDown className="w-5 h-5 text-rose-500" />
            </div>
            <div className="mt-2 flex items-baseline">
              <span className="text-4xl font-extrabold text-slate-900">{formatCurrency(monthlyBurn)}</span>
              <span className="ml-2 text-sm font-medium text-slate-500">/mo</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Calendar className="w-24 h-24" />
            </div>
            <div className="flex items-center justify-between pb-4 relative z-10">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Runway</h3>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div className="mt-2 flex items-baseline relative z-10">
              <span className="text-4xl font-extrabold text-slate-900">{runwayMonths}</span>
              <span className="ml-2 text-sm font-medium text-slate-500">months</span>
            </div>
            {monthlyBurn > 0 && runwayMonths < 6 && (
              <div className="mt-4 text-xs font-semibold text-rose-600 bg-rose-50 rounded-full px-3 py-1 inline-block">
                Warning: Critical Runway
              </div>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-slate-400" />
            Cash Projection
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{fill: '#64748b', fontSize: 12}}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{fill: '#64748b', fontSize: 12}}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [formatCurrency(value), 'Cash Remaining']}
                />
                <Area 
                  type="monotone" 
                  dataKey="cash" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCash)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses Manager */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-slate-400" />
            Monthly Expenses
          </h2>
          
          {/* Add Expense Form */}
          <form onSubmit={handleAddExpense} className="flex flex-col md:flex-row gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Description</label>
              <input
                type="text"
                placeholder="e.g. AWS Hosting"
                value={newExpense.name}
                onChange={e => setNewExpense({...newExpense, name: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Category</label>
              <select
                value={newExpense.category}
                onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
              >
                <option>Infrastructure</option>
                <option>Software</option>
                <option>Payroll</option>
                <option>Marketing</option>
                <option>Office</option>
                <option>General</option>
              </select>
            </div>
            <div className="w-full md:w-48">
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Amount/mo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400">$</span>
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={!newExpense.name || !newExpense.amount}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </button>
            </div>
          </form>

          {/* Expenses List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-semibold text-slate-500">
                  <th className="pb-3 pl-4">Expense</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400 text-sm">
                      No expenses added yet.
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="py-4 pl-4 font-medium text-slate-800">{expense.name}</td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-4 text-right font-medium text-slate-800">{formatCurrency(expense.amount)}</td>
                      <td className="py-4 pr-4 text-right">
                        <button
                          onClick={() => removeExpense(expense.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Remove expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {expenses.length > 0 && (
                <tfoot>
                  <tr className="bg-slate-50">
                    <td colSpan="2" className="py-4 pl-4 font-bold text-slate-800">Total Monthly Burn</td>
                    <td className="py-4 text-right font-bold text-slate-800 text-lg">{formatCurrency(monthlyBurn)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
