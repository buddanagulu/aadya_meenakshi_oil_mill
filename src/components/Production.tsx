import React from 'react';
import { ProductionLog } from '../types';
import { Plus, Search, Filter } from 'lucide-react';

interface ProductionProps {
  logs: ProductionLog[];
  onAddLog: (log: Omit<ProductionLog, 'id'>) => void;
}

export const Production: React.FC<ProductionProps> = ({ logs, onAddLog }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    date: new Date().toISOString().split('T')[0],
    rawMaterialKg: '',
    workingFeeRs: '',
    pindiProducedKg: '',
    pindiSoldKg: '',
    pindiRateRs: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const workingFee = Number(formData.workingFeeRs);
    const pindiTotal = Number(formData.pindiSoldKg) * Number(formData.pindiRateRs);
    
    onAddLog({
      date: formData.date,
      rawMaterialKg: Number(formData.rawMaterialKg),
      workingFeeRs: workingFee,
      pindiProducedKg: Number(formData.pindiProducedKg),
      pindiSoldKg: Number(formData.pindiSoldKg),
      pindiRateRs: Number(formData.pindiRateRs),
      totalDailyRevenue: workingFee + pindiTotal
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mill Operations (Ganuga)</h2>
          <p className="text-gray-500">Track raw material processing and pindi output.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          New Entry
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search logs by date or product..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Palli Work (Kg)</th>
                <th className="px-6 py-4">Working Fee</th>
                <th className="px-6 py-4">Pindi Sold</th>
                <th className="px-6 py-4">Rate</th>
                <th className="px-6 py-4">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{log.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.rawMaterialKg} kg</td>
                  <td className="px-6 py-4 text-sm text-gray-600">₹{log.workingFeeRs}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.pindiSoldKg} kg</td>
                  <td className="px-6 py-4 text-sm text-gray-600">₹{log.pindiRateRs}/kg</td>
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">₹{log.totalDailyRevenue}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No production logs found. Add your first entry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Add Daily Log</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" required value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Palli Work (Kg)</label>
                  <input 
                    type="number" required placeholder="Raw Weight" 
                    value={formData.rawMaterialKg} 
                    onChange={e => setFormData({...formData, rawMaterialKg: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Working Fee (Rs)</label>
                  <input 
                    type="number" required placeholder="Revenue" 
                    value={formData.workingFeeRs} 
                    onChange={e => setFormData({...formData, workingFeeRs: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pindi Produced (Kg)</label>
                  <input 
                    type="number" required placeholder="Total Pindi" 
                    value={formData.pindiProducedKg} 
                    onChange={e => setFormData({...formData, pindiProducedKg: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pindi Sold (Kg)</label>
                  <input 
                    type="number" required placeholder="Sold today" 
                    value={formData.pindiSoldKg} 
                    onChange={e => setFormData({...formData, pindiSoldKg: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pindi Rate (Rs/Kg)</label>
                <input 
                  type="number" required placeholder="e.g. 34" 
                  value={formData.pindiRateRs} 
                  onChange={e => setFormData({...formData, pindiRateRs: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
