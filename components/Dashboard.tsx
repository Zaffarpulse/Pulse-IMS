
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { AlertTriangle, Package, ShoppingCart, TrendingUp, Sparkles, Loader2, ArrowUpRight } from 'lucide-react';
import { InventoryItem, POStatus, PurchaseOrder } from '../types';
import { generateInventoryInsight } from '../services/geminiService';

interface DashboardProps {
  inventory: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
}

const COLORS = ['#4f46e5', '#f59e0b', '#ef4444', '#64748b'];

const Dashboard: React.FC<DashboardProps> = ({ inventory, purchaseOrders }) => {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Memoized Stats Logic
  const stats = useMemo(() => {
    const totalItems = inventory.reduce((acc, item) => acc + item.quantity, 0);
    const lowStockItems = inventory.filter(i => i.quantity <= i.minStock).length;
    const pendingPos = purchaseOrders.filter(po => po.status === POStatus.PENDING_APPROVAL).length;
    const totalValue = inventory.reduce((acc, item) => acc + (item.quantity * (item.purchasePrice || 0)), 0);
    return { totalItems, lowStockItems, pendingPos, totalValue };
  }, [inventory, purchaseOrders]);

  // Memoized Chart Data
  const statusDistribution = useMemo(() => [
    { name: 'In Stock', value: inventory.filter(i => i.status === 'In Stock').length },
    { name: 'Low Stock', value: inventory.filter(i => i.status === 'Low Stock').length },
    { name: 'Out of Stock', value: inventory.filter(i => i.status === 'Out of Stock').length },
    { name: 'Maintenance', value: inventory.filter(i => i.status === 'Under Maintenance').length },
  ], [inventory]);

  const categoryData = useMemo(() => {
    const data = inventory.reduce((acc: any[], item) => {
      const existing = acc.find((c: any) => c.name === item.category);
      if (existing) {
        existing.value += item.quantity;
      } else {
        acc.push({ name: item.category, value: item.quantity });
      }
      return acc;
    }, []);
    return data.sort((a: any, b: any) => b.value - a.value).slice(0, 10); // Limit to top 10 for performance
  }, [inventory]);

  const handleAiGenerate = async () => {
    setIsGeneratingAi(true);
    const report = await generateInventoryInsight(inventory);
    setAiReport(report);
    setIsGeneratingAi(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div><h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Executive Dashboard</h1><p className="text-slate-500 mt-1 text-sm font-medium">Real-time inventory intelligence and alerts.</p></div>
        <button onClick={handleAiGenerate} disabled={isGeneratingAi} className="mt-4 sm:mt-0 flex items-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-70 font-medium text-sm">{isGeneratingAi ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}{isGeneratingAi ? 'Analyzing Data...' : 'Generate AI Insights'}</button>
      </div>

      {aiReport && (
        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 shadow-md ring-1 ring-indigo-50">
          <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-indigo-900 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-indigo-500" /> AI Strategic Report</h3><button onClick={() => setAiReport(null)} className="text-slate-400 hover:text-slate-600 text-sm font-medium">Close Report</button></div>
          <div className="prose prose-indigo max-w-none text-slate-600 text-sm whitespace-pre-wrap font-medium">{aiReport}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative group overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-300"><Package className="w-20 h-20" /></div>
          <div className="relative z-10"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><Package className="w-5 h-5" /></div><span className="text-sm font-semibold text-blue-100 tracking-wide uppercase">Total Assets</span></div><p className="text-3xl font-bold tracking-tight">{stats.totalItems.toLocaleString()}</p><div className="mt-2 text-xs font-medium text-blue-100 bg-blue-700/30 inline-block px-2 py-1 rounded">Global Inventory Count</div></div>
        </div>
        <div className="relative group overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200 hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-300"><AlertTriangle className="w-20 h-20" /></div>
          <div className="relative z-10"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><AlertTriangle className="w-5 h-5" /></div><span className="text-sm font-semibold text-orange-100 tracking-wide uppercase">Critical Stock</span></div><p className="text-3xl font-bold tracking-tight">{stats.lowStockItems}</p><div className="mt-2 text-xs font-medium text-orange-100 bg-orange-700/30 inline-block px-2 py-1 rounded flex items-center gap-1">Action Required <ArrowUpRight className="w-3 h-3" /></div></div>
        </div>
        <div className="relative group overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200 hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-300"><ShoppingCart className="w-20 h-20" /></div>
          <div className="relative z-10"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><ShoppingCart className="w-5 h-5" /></div><span className="text-sm font-semibold text-violet-100 tracking-wide uppercase">Pending Orders</span></div><p className="text-3xl font-bold tracking-tight">{stats.pendingPos}</p><div className="mt-2 text-xs font-medium text-violet-100 bg-violet-700/30 inline-block px-2 py-1 rounded">Awaiting Approval</div></div>
        </div>
        <div className="relative group overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-300"><TrendingUp className="w-20 h-20" /></div>
          <div className="relative z-10"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><TrendingUp className="w-5 h-5" /></div><span className="text-sm font-semibold text-emerald-100 tracking-wide uppercase">Total Value</span></div><p className="text-3xl font-bold tracking-tight">${stats.totalValue.toLocaleString()}</p><div className="mt-2 text-xs font-medium text-emerald-100 bg-emerald-700/30 inline-block px-2 py-1 rounded">Current Valuation</div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50">
          <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-slate-800">Inventory Status Distribution</h3><span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">Real-time</span></div>
          <div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" stroke="none">{statusDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: 'none' }} itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#475569' }} /></PieChart></ResponsiveContainer></div>
          <div className="flex justify-center flex-wrap gap-4 mt-4 text-xs font-medium text-slate-600">{statusDistribution.map((entry, index) => (<div key={entry.name} className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"><span className="w-3 h-3 rounded-full mr-2 shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>{entry.name}: <span className="ml-1 font-bold">{entry.value}</span></div>))}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50">
          <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-slate-800">Category Analysis</h3><button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">View Details</button></div>
          <div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={categoryData} barSize={32}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} tick={{fill: '#64748b'}} interval={0} angle={-15} textAnchor="end" height={50} /><YAxis axisLine={false} tickLine={false} fontSize={11} tick={{fill: '#64748b'}} /><Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: 'none' }} /><Bar dataKey="value" fill="url(#colorGradient)" radius={[6, 6, 0, 0]} /><defs><linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.9}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0.6}/></linearGradient></defs></BarChart></ResponsiveContainer></div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
