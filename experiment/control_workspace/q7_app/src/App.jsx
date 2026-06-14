import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  DollarSign,
  TrendingDown,
  Clock,
  Plus,
  Trash2,
  Activity,
  Wallet,
  AlertCircle,
} from "lucide-react";

const INITIAL_EXPENSES = [
  {
    id: 1,
    name: "Cloud Infrastructure (AWS)",
    amount: 2500,
    category: "Engineering",
  },
  { id: 2, name: "SaaS Tools", amount: 800, category: "Operations" },
  { id: 3, name: "Office Rent", amount: 3000, category: "Facilities" },
  { id: 4, name: "Payroll", amount: 45000, category: "Team" },
  { id: 5, name: "Marketing Ads", amount: 5000, category: "Marketing" },
];

export default function App() {
  const [balance, setBalance] = useState(500000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(15000);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);

  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("Engineering");

  const totalMonthlyExpenses = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const netBurnRate = useMemo(() => {
    return totalMonthlyExpenses - monthlyRevenue;
  }, [totalMonthlyExpenses, monthlyRevenue]);

  const runwayMonths = useMemo(() => {
    if (netBurnRate <= 0) return Infinity;
    return balance / netBurnRate;
  }, [balance, netBurnRate]);

  // Generate projection data for 12 months
  const projectionData = useMemo(() => {
    const data = [];
    let currentBalance = balance;
    for (let i = 0; i <= 12; i++) {
      data.push({
        month: `Month ${i}`,
        balance: Math.max(0, currentBalance),
        burn: netBurnRate > 0 ? netBurnRate : 0,
      });
      currentBalance -= netBurnRate;
    }
    return data;
  }, [balance, netBurnRate]);

  // Group expenses for bar chart
  const expensesByCategory = useMemo(() => {
    const grouped = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpenseName || !newExpenseAmount) return;

    const newExp = {
      id: Date.now(),
      name: newExpenseName,
      amount: parseFloat(newExpenseAmount),
      category: newExpenseCategory,
    };

    setExpenses([...expenses, newExp]);
    setNewExpenseName("");
    setNewExpenseAmount("");
  };

  const handleRemoveExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="text-blue-600 w-8 h-8" />
              Startup Metrics Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Track your runway, burn rate, and expenses in real-time.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-4">
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <label className="text-xs text-blue-600 font-semibold uppercase tracking-wider block mb-1">
                Current Balance
              </label>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                className="bg-transparent text-xl font-bold text-blue-900 focus:outline-none w-32"
              />
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
              <label className="text-xs text-green-600 font-semibold uppercase tracking-wider block mb-1">
                Monthly Rev.
              </label>
              <input
                type="number"
                value={monthlyRevenue}
                onChange={(e) =>
                  setMonthlyRevenue(parseFloat(e.target.value) || 0)
                }
                className="bg-transparent text-xl font-bold text-green-900 focus:outline-none w-32"
              />
            </div>
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-orange-100 text-orange-600 rounded-xl">
              <TrendingDown className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Net Burn Rate (Monthly)
              </p>
              <h2
                className={`text-2xl font-bold ${netBurnRate > 0 ? "text-red-600" : "text-green-600"}`}
              >
                {formatCurrency(netBurnRate)}
              </h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-purple-100 text-purple-600 rounded-xl">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Estimated Runway
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                {runwayMonths === Infinity
                  ? "Profitable! 🚀"
                  : `${runwayMonths.toFixed(1)} months`}
              </h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Monthly Expenses
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalMonthlyExpenses)}
              </h2>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-500" /> Cash Balance
              Projection (12 Months)
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={projectionData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorBalance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tickFormatter={(val) => `$${val / 1000}k`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gray-500" /> Expenses by
              Category
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={expensesByCategory}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    type="number"
                    tickFormatter={(val) => `$${val / 1000}k`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f3f4f6" }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Bar
                    dataKey="value"
                    fill="#8b5cf6"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Expenses List & Add Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900">
              Fixed & Variable Expenses
            </h3>
            {runwayMonths < 6 && runwayMonths > 0 && (
              <span className="flex items-center gap-1 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full font-medium">
                <AlertCircle className="w-4 h-4" /> Danger: Less than 6 months
                runway
              </span>
            )}
          </div>

          <div className="p-6">
            <form
              onSubmit={handleAddExpense}
              className="flex flex-wrap gap-4 mb-8"
            >
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Expense Name (e.g. AWS)"
                  value={newExpenseName}
                  onChange={(e) => setNewExpenseName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  placeholder="Amount"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                  min="0"
                />
              </div>
              <div className="w-48">
                <select
                  value={newExpenseCategory}
                  onChange={(e) => setNewExpenseCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Team">Team</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Legal">Legal</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Expense
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-sm text-gray-500 border-b border-gray-200">
                    <th className="pb-3 font-medium">Expense Item</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium text-right">
                      Amount (Monthly)
                    </th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-8 text-gray-500"
                      >
                        No expenses added yet.
                      </td>
                    </tr>
                  ) : (
                    expenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 font-medium text-gray-900">
                          {expense.name}
                        </td>
                        <td className="py-4">
                          <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium">
                            {expense.category}
                          </span>
                        </td>
                        <td className="py-4 text-right font-medium text-gray-900">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleRemoveExpense(expense.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                            title="Remove expense"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {expenses.length > 0 && (
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td
                        colSpan="2"
                        className="py-4 px-4 font-bold text-gray-900 rounded-l-lg"
                      >
                        Total Monthly Expenses
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-gray-900">
                        {formatCurrency(totalMonthlyExpenses)}
                      </td>
                      <td className="rounded-r-lg"></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
