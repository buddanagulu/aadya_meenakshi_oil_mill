
import React from 'react';
import { Ledger } from '../types';
import { Plus, Search, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export const LedgersPage: React.FC = () => {
    const [ledgers, setLedgers] = React.useState<Ledger[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        personName: '',
        totalDebt: '',
        status: 'Active' as 'Active' | 'Settled',
        lastTransactionDate: new Date().toISOString().split('T')[0]
    });

    const fetchLedgers = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const res = await fetch('/api/admin/ledgers', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (res.ok) {
                const json = await res.json();
                setLedgers(json.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch ledgers', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchLedgers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newLedger = {
            person_name: formData.personName,
            total_debt: Number(formData.totalDebt),
            status: formData.status,
            last_transaction_date: formData.lastTransactionDate
        };

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const res = await fetch('/api/admin/ledgers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(newLedger),
            });

            if (res.ok) {
                await fetchLedgers();
                setIsModalOpen(false);
                setFormData({
                    personName: '',
                    totalDebt: '',
                    status: 'Active',
                    lastTransactionDate: new Date().toISOString().split('T')[0]
                });
            } else {
                alert('Failed to save ledger');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving ledger');
        }
    };

    // Total Dues Calculation - Properties are now snake_case in Ledger type
    const totalDues = ledgers.reduce((sum, l) => sum + (l.total_debt || 0), 0);
    const activeDebtors = ledgers.filter(l => l.status === 'Active').length;

    if (loading) return <div className="p-4">Loading ledgers...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                        <User size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-orange-600">Active Debtors</p>
                        <h3 className="text-2xl font-bold text-orange-700">{activeDebtors}</h3>
                    </div>
                </div>
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-xl text-red-600">
                        <DollarSignCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-red-600">Total Dues</p>
                        <h3 className="text-2xl font-bold text-red-700">₹{totalDues.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Dues & Ledgers</h2>
                    <p className="text-gray-500">Manage customer credits and settlements.</p>
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
                        <input type="text" placeholder="Search person..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Person Name</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Paid / Txn</th>
                                <th className="px-6 py-4 text-right">Total Debt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {ledgers.map((l) => (
                                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                            {(l.person_name || '?').charAt(0)}
                                        </div>
                                        {l.person_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${l.status === 'Settled' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {l.status === 'Settled' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                            {l.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-2">
                                        <Calendar size={14} />
                                        {l.last_transaction_date}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-right text-red-600">
                                        ₹{l.total_debt.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                             {ledgers.length === 0 && (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No dues recorded.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                    {ledgers.map((l) => (
                        <div key={l.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                        {(l.person_name || '?').charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{l.person_name}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar size={12} /> {l.last_transaction_date}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold mb-1 ${l.status === 'Settled' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {l.status}
                                    </span>
                                    <p className="font-black text-lg text-red-600">₹{l.total_debt.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {ledgers.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            No ledger entries found.
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold mb-4">Add Ledger Entry</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Person Name</label>
                                <input type="text" required placeholder="Name" value={formData.personName} onChange={e => setFormData({...formData, personName: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Debt Amount</label>
                                <input type="number" required placeholder="Rs" value={formData.totalDebt} onChange={e => setFormData({...formData, totalDebt: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'Active' | 'Settled'})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="Active">Active (Due)</option>
                                        <option value="Settled">Settled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input type="date" value={formData.lastTransactionDate} onChange={e => setFormData({...formData, lastTransactionDate: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                            
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

// Start Icon Helper
const DollarSignCircle = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
)
