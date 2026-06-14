import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlusCircle, Trash2, TrendingDown, TrendingUp, DollarSign, Clock } from 'lucide-react';

function App() {
  const [initialCash, setInitialCash] = useState(100000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(5000);
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Server Costs', amount: 500 },
    { id: 2, name: 'Salaries', amount: 8000 },
    { id: 3, name: 'Marketing', amount: 1500 }
  ]);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netBurnRate = totalExpenses - monthlyRevenue;
  const runwayMonths = netBurnRate > 0 ? initialCash / netBurnRate : Infinity;

  const chartData = useMemo(() => {
    const data = [];
    let currentCash = initialCash;
    for (let i = 0; i <= 12; i++) {
      data.push({
        month: `Month ${i}`,
        cash: Math.max(0, currentCash)
      });
      if (currentCash <= 0) break;
      currentCash -= netBurnRate;
    }
    return data;
  }, [initialCash, netBurnRate]);

  const addExpense = (e) => {
    e.preventDefault();
    if (!newExpenseName || !newExpenseAmount) return;
    setExpenses([
      ...expenses,
      { id: Date.now(), name: newExpenseName, amount: Number(newExpenseAmount) }
    ]);
    setNewExpenseName('');
    setNewExpenseAmount('');
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Startup Runway Tracker</h1>
          <p className="text-slate-500 mt-2">Monitor your cash flow, burn rate, and financial runway.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center text-slate-500 mb-2">
              <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
              <h3 className="font-medium">Initial Cash</h3>
            </div>
            <input 
              type="number" 
              className="text-3xl font-bold w-full bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-blue-500 outline-none transition-colors"
              value={initialCash}
              onChange={(e) => setInitialCash(Number(e.target.value))}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center text-slate-500 mb-2">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
              <h3 className="font-medium">Monthly Revenue</h3>
            </div>
            <input 
              type="number" 
              className="text-3xl font-bold w-full bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-emerald-500 outline-none transition-colors"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center text-slate-500 mb-2">
              <TrendingDown className="w-5 h-5 mr-2 text-rose-500" />
              <h3 className="font-medium">Net Burn Rate</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              ${netBurnRate > 0 ? netBurnRate.toLocaleString() : 0}
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-sm border ${runwayMonths < 6 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="flex items-center mb-2">
              <Clock className={`w-5 h-5 mr-2 ${runwayMonths < 6 ? 'text-rose-500' : 'text-emerald-500'}`} />
              <h3 className={`font-medium ${runwayMonths < 6 ? 'text-rose-700' : 'text-emerald-700'}`}>Runway</h3>
            </div>
            <div className={`text-3xl font-bold ${runwayMonths < 6 ? 'text-rose-900' : 'text-emerald-900'}`}>
              {runwayMonths === Infinity ? 'Infinite' : `${runwayMonths.toFixed(1)} months`}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold mb-6 text-slate-900">Cash Balance Projection</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b'}}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Cash Balance']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cash" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#1d4ed8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Expenses</h3>
              <span className="text-lg font-bold text-slate-700">${totalExpenses.toLocaleString()}/mo</span>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-3">
              {expenses.map(expense => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group">
                  <span className="font-medium text-slate-700">{expense.name}</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-slate-900 mr-4">${expense.amount.toLocaleString()}</span>
                    <button 
                      onClick={() => removeExpense(expense.id)}
                      className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {expenses.length === 0 && (
                <div className="text-center text-slate-500 py-8">No expenses added yet.</div>
              )}
            </div>

            <form onSubmit={addExpense} className="pt-4 border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Expense name"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  value={newExpenseName}
                  onChange={(e) => setNewExpenseName(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
