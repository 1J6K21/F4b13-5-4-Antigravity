import { useState, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calculator, TrendingDown, DollarSign, AlertCircle, Plus, Trash2, Zap, Rocket, LineChart as LineChartIcon, CheckCircle2 } from 'lucide-react';

type ExpenseCategory = 'Payroll' | 'Software' | 'Marketing' | 'Office' | 'Legal' | 'Other';

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  isRecurring: boolean;
}

interface RevenueStream {
  id: string;
  name: string;
  monthlyAmount: number;
  growthRate: number; // Monthly growth %
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Payroll: '#3b82f6',
  Software: '#8b5cf6',
  Marketing: '#ec4899',
  Office: '#f59e0b',
  Legal: '#10b981',
  Other: '#64748b'
};

export default function App() {
  const [cashBalance, setCashBalance] = useState<number>(500000);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', name: 'Founders', amount: 8000, category: 'Payroll', isRecurring: true },
    { id: '2', name: 'AWS', amount: 1500, category: 'Software', isRecurring: true },
    { id: '3', name: 'Ads', amount: 3000, category: 'Marketing', isRecurring: true }
  ]);
  const [revenues, setRevenues] = useState<RevenueStream[]>([
    { id: '1', name: 'SaaS Subscriptions', monthlyAmount: 2000, growthRate: 10 }
  ]);

  const [newExpense, setNewExpense] = useState<Partial<Expense>>({ category: 'Payroll', isRecurring: true });
  const [newRevenue, setNewRevenue] = useState<Partial<RevenueStream>>({});

  const totalMonthlyExpenses = useMemo(() => 
    expenses.filter(e => e.isRecurring).reduce((acc, curr) => acc + curr.amount, 0),
  [expenses]);

  const totalMonthlyRevenue = useMemo(() => 
    revenues.reduce((acc, curr) => acc + curr.monthlyAmount, 0),
  [revenues]);

  const burnRate = totalMonthlyExpenses - totalMonthlyRevenue;
  const runwayMonths = burnRate > 0 ? cashBalance / burnRate : Infinity;

  // Opportunity Hunter / Founder Mode: Default Alive / Fundraising Trigger
  const isDefaultAlive = burnRate <= 0;
  const fundraisingWarning = runwayMonths < 9 && runwayMonths > 0;

  // Projection logic
  const projectionData = useMemo(() => {
    let currentCash = cashBalance;
    let currentRevenue = totalMonthlyRevenue;
    const data = [];
    
    for (let i = 0; i <= 24; i++) {
      const currentBurn = totalMonthlyExpenses - currentRevenue;
      data.push({
        month: `Month ${i}`,
        cash: Math.max(0, currentCash),
        expenses: totalMonthlyExpenses,
        revenue: currentRevenue,
        burn: currentBurn
      });
      currentCash -= currentBurn;
      
      // Calculate revenue growth for next month
      currentRevenue = revenues.reduce((acc, rev) => {
        // Compound growth
        const grown = rev.monthlyAmount * Math.pow(1 + rev.growthRate / 100, i);
        return acc + grown;
      }, 0);

      if (currentCash <= 0 && data.length > 1) {
        break; // Stop projecting much after running out of cash
      }
    }
    return data;
  }, [cashBalance, expenses, revenues, totalMonthlyExpenses, totalMonthlyRevenue]);

  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      setExpenses([...expenses, { ...newExpense, id: Date.now().toString() } as Expense]);
      setNewExpense({ name: '', amount: undefined, category: 'Payroll', isRecurring: true });
    }
  };

  const addRevenue = () => {
    if (newRevenue.name && newRevenue.monthlyAmount !== undefined) {
      setRevenues([...revenues, { ...newRevenue, id: Date.now().toString(), growthRate: newRevenue.growthRate || 0 } as RevenueStream]);
      setNewRevenue({ name: '', monthlyAmount: undefined, growthRate: 0 });
    }
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const removeRevenue = (id: string) => {
    setRevenues(revenues.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Rocket className="text-blue-600" />
              Antigravity Runway
            </h1>
            <p className="text-slate-500 mt-1">Strategic cash management for founders</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-right">
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Current Cash</div>
              <input 
                type="number" 
                value={cashBalance}
                onChange={(e) => setCashBalance(Number(e.target.value))}
                className="text-2xl font-bold text-slate-900 bg-transparent text-right w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
              />
            </div>
          </div>
        </header>

        {/* Opportunity Hunter Insights */}
        {isDefaultAlive ? (
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">Default Alive</h3>
              <p className="text-green-800 text-sm mt-1">
                Your revenue growth outpaces your expenses. You control your own destiny. Consider reinvesting profits into aggressive growth or acquiring competitors while they struggle to fundraise.
              </p>
            </div>
          </div>
        ) : fundraisingWarning ? (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900">Fundraising Window Open</h3>
              <p className="text-amber-800 text-sm mt-1">
                You have {runwayMonths.toFixed(1)} months of runway. VC rounds typically take 3-6 months from pitch to money in the bank. <strong>Opportunity:</strong> Start backchanneling with investors now. Reduce burn by extending software contracts annually for discounts.
              </p>
            </div>
          </div>
        ) : (
           <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
            <Zap className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Growth Mode</h3>
              <p className="text-blue-800 text-sm mt-1">
                You have comfortable runway ({runwayMonths.toFixed(1)} months). Invest aggressively in product-led growth to scale revenue, but watch your payback periods closely.
              </p>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Monthly Burn Rate</p>
              <h2 className="text-3xl font-bold text-slate-900">${burnRate.toLocaleString()}</h2>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <LineChartIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Runway</p>
              <h2 className="text-3xl font-bold text-slate-900">
                {burnRate <= 0 ? 'Infinite' : `${runwayMonths.toFixed(1)} mos`}
              </h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Monthly Revenue</p>
              <h2 className="text-3xl font-bold text-slate-900">${totalMonthlyRevenue.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Cash Out-of-Zero Projection</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(val) => `$${(val/1000)}k`} />
                  <RechartsTooltip 
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Cash Balance']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="cash" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCash)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue vs Expenses</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(val) => `$${(val/1000)}k`} />
                  <RechartsTooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expenses */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calculator className="text-slate-500" size={20} />
              Monthly Expenses
            </h3>
            
            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {expenses.map(expense => (
                <div key={expense.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[expense.category] }} />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{expense.name}</p>
                      <p className="text-xs text-slate-500">{expense.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-700">${expense.amount.toLocaleString()}</span>
                    <button onClick={() => removeExpense(expense.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 items-start mt-4 border-t border-slate-100 pt-4">
              <input 
                type="text" 
                placeholder="Name" 
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newExpense.name || ''}
                onChange={e => setNewExpense({...newExpense, name: e.target.value})}
              />
              <input 
                type="number" 
                placeholder="Amount" 
                className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newExpense.amount || ''}
                onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})}
              />
              <select 
                className="w-28 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newExpense.category}
                onChange={e => setNewExpense({...newExpense, category: e.target.value as ExpenseCategory})}
              >
                {Object.keys(CATEGORY_COLORS).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button 
                onClick={addExpense}
                className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="text-slate-500" size={20} />
              Revenue Streams
            </h3>
            
            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {revenues.map(rev => (
                <div key={rev.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-300 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{rev.name}</p>
                    <p className="text-xs text-green-600 font-medium">+{rev.growthRate}% MoM Growth</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-700">${rev.monthlyAmount.toLocaleString()}</span>
                    <button onClick={() => removeRevenue(rev.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {revenues.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                  Pre-revenue? Add your first stream to see when you'll hit default alive.
                </div>
              )}
            </div>

            <div className="flex gap-2 items-start mt-4 border-t border-slate-100 pt-4">
              <input 
                type="text" 
                placeholder="Stream Name" 
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newRevenue.name || ''}
                onChange={e => setNewRevenue({...newRevenue, name: e.target.value})}
              />
              <input 
                type="number" 
                placeholder="Amount" 
                className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newRevenue.monthlyAmount || ''}
                onChange={e => setNewRevenue({...newRevenue, monthlyAmount: Number(e.target.value)})}
              />
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="Growth %" 
                  className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newRevenue.growthRate || ''}
                  onChange={e => setNewRevenue({...newRevenue, growthRate: Number(e.target.value)})}
                />
              </div>
              <button 
                onClick={addRevenue}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
