import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { 
  IndianRupee, 
  ArrowDownRight, 
  TrendingUp, 
  Package, 
  Scale, 
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { ProductionLog, ShopInventory, Transaction } from '../types';

interface DashboardProps {
  production: ProductionLog[];
  inventory: ShopInventory[];
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ production, inventory, transactions }) => {
  // Financial metrics
  const totalRevenue = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const stockValue = inventory.reduce((sum, i) => sum + i.totalInvestment, 0);
  
  // Production metrics
  const totalRawProcessed = production.reduce((sum, l) => sum + l.rawMaterialKg, 0);
  const averageYield = production.length > 0 
    ? (production.reduce((sum, l) => sum + (l.pindiProducedKg / l.rawMaterialKg), 0) / production.length * 100).toFixed(1)
    : 0;

  const kpiCards = [
    { 
      label: 'Total Revenue', 
      value: totalRevenue, 
      icon: <IndianRupee size={24} />, 
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      trend: '+12.5%',
      trendUp: true 
    },
    { 
      label: 'Total Expenses', 
      value: totalExpenses, 
      icon: <ArrowDownRight size={24} />, 
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      trend: '+5.2%',
      trendUp: false 
    },
    { 
      label: 'Net Profit', 
      value: netProfit, 
      icon: <TrendingUp size={24} />, 
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      trend: '+18.3%',
      trendUp: true 
    },
    { 
      label: 'Inventory Value', 
      value: stockValue, 
      icon: <Package size={24} />, 
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      trend: 'Stable',
      trendUp: null 
    },
  ];

  // Expense split for Pie Chart
  const expenseByCategory = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  
  const pieData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key]
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 font-medium text-sm">Mill & Retail performance monitoring system.</p>
        </div>
      </header>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpiCards.map((stat, idx) => (
          <div key={idx} className={`bg-white p-3 md:p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 ${stat.color}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 md:p-2 bg-white rounded-lg shadow-sm">
                {stat.icon}
              </div>
              {stat.trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border ${stat.trendUp === true ? 'text-green-600' : stat.trendUp === false ? 'text-red-600' : 'text-gray-500'}`}>
                  {stat.trendUp === true ? <ArrowUpRight size={10} /> : stat.trendUp === false ? <ArrowDownRight size={10} /> : null}
                  {stat.trend}
                </div>
              )}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{stat.label}</p>
              <p className="text-lg md:text-2xl font-black mt-0.5 text-gray-900">₹{stat.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Chart (unchanged container) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          {/* ... chart code ... */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-gray-900">Production Volume</h3>
              <p className="text-xs text-gray-400 font-medium">Daily processing (kg)</p>
            </div>
            <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-lg border border-gray-100">
              <button className="px-2 py-1 text-[10px] font-bold text-gray-600 hover:text-indigo-600 rounded transition-colors">7D</button>
              <button className="px-2 py-1 text-[10px] font-bold bg-white text-indigo-600 shadow-sm rounded">30D</button>
            </div>
          </div>
          <div className="h-[250px]">
             {/* Note: I am not replacing inner chart code here to keep snippet valid, just context match */}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={production.slice(-10)}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', color: '#fff', borderRadius: '0.75rem', border: 'none', padding: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="rawMaterialKg" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-black text-gray-900">Expenses</h3>
            <p className="text-xs text-gray-400 font-medium">Cost breakdown</p>
          </div>
          <div className="h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.length > 0 ? pieData : [{ name: 'No Data', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                  {pieData.length === 0 && <Cell fill="#f1f5f9" />}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
               <p className="text-xl font-black text-gray-900">₹{totalExpenses.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
             {pieData.map((item, idx) => (
               <div key={idx} className="flex items-center justify-between group cursor-default">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                   <span className="text-xs font-bold text-gray-600 group-hover:text-indigo-600 transition-colors">{item.name}</span>
                 </div>
                 <div className="text-right">
                   <span className="text-xs font-black text-gray-900 block">₹{item.value.toLocaleString()}</span>
                   <span className="text-[10px] font-bold text-gray-400">{((item.value / totalExpenses) * 100).toFixed(1)}%</span>
                 </div>
               </div>
             ))}
             {pieData.length === 0 && <p className="text-center text-xs text-gray-400 py-2 italic">No data.</p>}
          </div>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-indigo-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-800 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50"></div>
          <Scale className="text-indigo-400 mb-2" size={24} />
          <h4 className="text-sm font-black mb-1">Efficiency</h4>
          <p className="text-lg md:text-2xl font-black mb-1">{averageYield}% <span className="text-[10px] md:text-xs font-normal text-indigo-300">Yield</span></p>
          <p className="text-[10px] text-indigo-200">Processed: {totalRawProcessed.toLocaleString()} kg</p>
        </div>

        <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-800 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50"></div>
          <TrendingUp className="text-emerald-400 mb-2" size={24} />
          <h4 className="text-sm font-black mb-1">Profitability</h4>
          <p className="text-lg md:text-2xl font-black mb-1">{totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}% <span className="text-[10px] md:text-xs font-normal text-emerald-300">Margin</span></p>
          <p className="text-[10px] text-emerald-200">Net: ₹{netProfit.toLocaleString()}</p>
        </div>

        <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden group col-span-2 lg:col-span-1">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-gray-800 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50"></div>
          <Zap className="text-amber-400 mb-2" size={24} />
          <h4 className="text-sm font-black mb-1">Utility</h4>
          <p className="text-lg md:text-2xl font-black mb-1">~1.2 <span className="text-[10px] md:text-xs font-normal text-gray-400">kWh/kg</span></p>
          <p className="text-[10px] text-gray-400">Analysis active.</p>
        </div>
      </div>
    </div>
  );
};
