
import React from 'react';
import { UtilityLog } from '../types';
import { Plus, Search, Zap, PenTool, Home } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export const UtilityLogsPage: React.FC = () => {
    const [logs, setLogs] = React.useState<UtilityLog[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        date: new Date().toISOString().split('T')[0],
        type: 'Electricity' as 'Electricity' | 'Maintenance' | 'Rent',
        cost: '',
        reading: ''
    });

    const fetchLogs = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const res = await fetch('/api/admin/utility_logs', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (res.ok) {
                const json = await res.json();
                setLogs(json.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch utility logs', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchLogs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newLog = {
            date: formData.date,
            type: formData.type,
            cost: Number(formData.cost),
            reading: formData.reading ? Number(formData.reading) : null // optional field
        };

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const res = await fetch('/api/admin/utility_logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(newLog),
            });

            if (res.ok) {
                await fetchLogs();
                setIsModalOpen(false);
                setFormData({
                    date: new Date().toISOString().split('T')[0],
                    type: 'Electricity',
                    cost: '',
                    reading: ''
                });
            } else {
                alert('Failed to save log');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving log');
        }
    };

    // Derived Metrics
    // const totalCost = logs.reduce((sum, l) => sum + l.cost, 0);

    if (loading) return <div className="p-4">Loading utility logs...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-xl text-yellow-600">
                        <Zap size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase text-yellow-600">Power Costs</p>
                        <h3 className="text-xl font-black text-yellow-700">
                             ₹{logs.filter(l => l.type === 'Electricity').reduce((s, l) => s + l.cost, 0).toLocaleString()}
                        </h3>
                    </div>
                </div>
                 <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                        <PenTool size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase text-blue-600">Maintenance</p>
                        <h3 className="text-xl font-black text-blue-700">
                             ₹{logs.filter(l => l.type === 'Maintenance').reduce((s, l) => s + l.cost, 0).toLocaleString()}
                        </h3>
                    </div>
                </div>
                 <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                        <Home size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase text-purple-600">Rent / Other</p>
                        <h3 className="text-xl font-black text-purple-700">
                             ₹{logs.filter(l => l.type === 'Rent').reduce((s, l) => s + l.cost, 0).toLocaleString()}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Utilities</h2>
                    <p className="text-gray-500">Track electricity, maintenance, and operational costs.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                    <Plus size={20} />
                    Add Entry
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search logs..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Reading / Note</th>
                                <th className="px-6 py-4 text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.map((l) => (
                                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{l.date}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
                                            ${l.type === 'Electricity' ? 'bg-yellow-100 text-yellow-700' : 
                                              l.type === 'Maintenance' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {l.type === 'Electricity' && <Zap size={12} />}
                                            {l.type === 'Maintenance' && <PenTool size={12} />}
                                            {l.type === 'Rent' && <Home size={12} />}
                                            {l.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {l.reading ? `Reading: ${l.reading}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-right text-gray-900">
                                        ₹{l.cost.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                             {logs.length === 0 && (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No utility logs recorded.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                    {logs.map((l) => (
                        <div key={l.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
                                    ${l.type === 'Electricity' ? 'bg-yellow-50 text-yellow-700' : 
                                      l.type === 'Maintenance' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                                    {l.type === 'Electricity' && <Zap size={12} />}
                                    {l.type === 'Maintenance' && <PenTool size={12} />}
                                    {l.type === 'Rent' && <Home size={12} />}
                                    {l.type}
                                </span>
                                <span className="font-bold text-gray-900">₹{l.cost.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span className="font-mono bg-gray-50 px-2 py-1 rounded">{l.date}</span>
                                {l.reading && <span>Meter: {l.reading}</span>}
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            No utility logs found.
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold mb-4">Add Utility Log</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as 'Electricity' | 'Maintenance' | 'Rent'})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="Electricity">Electricity</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Rent">Rent / Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost (Rs)</label>
                                    <input type="number" required placeholder="0" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                            
                            {formData.type === 'Electricity' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Meter Reading (Optional)</label>
                                    <input type="number" placeholder="KWh" value={formData.reading} onChange={e => setFormData({...formData, reading: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
