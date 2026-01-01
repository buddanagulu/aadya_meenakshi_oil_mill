
import React from 'react';
import { Transaction } from '../types';
import { Plus, Search, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export const TransactionsPage: React.FC = () => {
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        type: 'INCOME' as 'INCOME' | 'EXPENSE',
        category: 'Sales',
        paymentMethod: 'Cash',
        description: ''
    });

    const fetchTransactions = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const res = await fetch('/api/admin/transactions', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (res.ok) {
                const json = await res.json();
                setTransactions(json.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newTransaction = {
            date: formData.date,
            amount: Number(formData.amount),
            type: formData.type,
            category: formData.category,
            payment_method: formData.paymentMethod, 
            description: formData.description
        };

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const res = await fetch('/api/admin/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(newTransaction),
            });

            if (res.ok) {
                await fetchTransactions();
                setIsModalOpen(false);
                setFormData({
                    date: new Date().toISOString().split('T')[0],
                    amount: '',
                    type: 'INCOME',
                    category: 'Sales',
                    paymentMethod: 'Cash',
                    description: ''
                });
            } else {
                alert('Failed to save transaction');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving transaction');
        }
    };

    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

    if (loading) return <div className="p-4">Loading transactions...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-emerald-600">Total Income</p>
                        <h3 className="text-2xl font-bold text-emerald-700">₹{totalIncome.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center gap-4">
                    <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-rose-600">Total Expenses</p>
                        <h3 className="text-2xl font-bold text-rose-700">₹{totalExpense.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Transactions</h2>
                    <p className="text-gray-500">Track all financial movements.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                    <Plus size={20} />
                    Add Transaction
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 {/* Table or Filter Header */}
                 <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search transactions..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                    </div>
                 </div>

                 {/* Desktop Table View */}
                 <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Method</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{t.date}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.description || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 border border-gray-200">{t.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{t.payment_method}</td>
                                    <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {t.type === 'INCOME' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400">No transactions recorded yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                 </div>

                 {/* Mobile Card View */}
                 <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                    {transactions.map((t) => (
                        <div key={t.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-900">{t.date}</span>
                                <span className={`text-sm font-black ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {t.type === 'INCOME' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-gray-50 rounded text-xs text-gray-600 border border-gray-200 font-medium">{t.category}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{t.payment_method}</span>
                            </div>
                            {t.description && (
                                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">{t.description}</p>
                            )}
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            No transactions found.
                        </div>
                    )}
                 </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({...formData, type: 'INCOME'})}
                                            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${formData.type === 'INCOME' ? 'bg-white shadow text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Income
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({...formData, type: 'EXPENSE'})}
                                            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${formData.type === 'EXPENSE' ? 'bg-white shadow text-rose-600' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Expense
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input type="number" required placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="Sales">Sales</option>
                                        <option value="Purchase">Purchase</option>
                                        <option value="Salary">Salary</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Utility">Utility</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                                    <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="Cash">Cash</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Cheque">Cheque</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea rows={2} placeholder="Optional details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                            </div>

                            <div className="flex gap-3 pt-2">
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
