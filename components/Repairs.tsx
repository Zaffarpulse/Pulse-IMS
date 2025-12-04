
import React, { useState } from 'react';
import { Repair, RepairStatus, InventoryItem } from '../types';
import { Wrench, CheckCircle, Clock, AlertTriangle, Plus, X } from 'lucide-react';

interface RepairsProps {
  repairs: Repair[];
  inventory: InventoryItem[];
  onAddRepair: (repair: Repair) => void;
}

const Repairs: React.FC<RepairsProps> = ({ repairs, inventory, onAddRepair }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [selectedItemId, setSelectedItemId] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [estCost, setEstCost] = useState('');

  const getStatusBadge = (status: RepairStatus) => {
    switch (status) {
      case RepairStatus.IN_PROGRESS:
        return <span className="flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full"><Clock className="w-3 h-3 mr-1"/> In Progress</span>;
      case RepairStatus.COMPLETED:
        return <span className="flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3 mr-1"/> Completed</span>;
      case RepairStatus.SCHEDULED:
        return <span className="flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full"><AlertTriangle className="w-3 h-3 mr-1"/> Scheduled</span>;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedItem = inventory.find(i => i.id === selectedItemId);
    
    const newRepair: Repair = {
        id: `rep-${Math.floor(Math.random() * 10000)}`,
        item_id: selectedItemId,
        item_name: selectedItem ? selectedItem.name : 'Unknown Item',
        issue_desc: issueDesc,
        vendor_name: vendorName,
        cost: parseFloat(estCost) || 0,
        sent_date: new Date().toISOString().split('T')[0],
        status: RepairStatus.SCHEDULED
    };

    onAddRepair(newRepair);
    setIsModalOpen(false);
    // Reset form
    setSelectedItemId('');
    setIssueDesc('');
    setVendorName('');
    setEstCost('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Maintenance & Repairs</h1>
          <p className="text-slate-500">Track asset repairs and maintenance schedules.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log New Repair
        </button>
      </div>

      {/* Log Repair Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900">Log Asset Repair</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                   <X className="w-5 h-5" />
                </button>
             </div>
             
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Select Asset</label>
                   <select 
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                   >
                      <option value="">-- Choose Item --</option>
                      {inventory.map(item => (
                          <option key={item.id} value={item.id}>{item.name} ({item.serialNumber})</option>
                      ))}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Issue Description</label>
                   <textarea 
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      rows={3}
                      value={issueDesc}
                      onChange={(e) => setIssueDesc(e.target.value)}
                      placeholder="e.g. Screen flickering, Battery not charging"
                   ></textarea>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Service Vendor</label>
                   <input 
                      required
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      placeholder="e.g. TechSurgical Inc."
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Cost ($)</label>
                   <input 
                      required
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={estCost}
                      onChange={(e) => setEstCost(e.target.value)}
                   />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                   <button 
                     type="button"
                     onClick={() => setIsModalOpen(false)} 
                     className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit"
                     className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                   >
                     Submit Log
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Issue Description</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Sent Date</th>
                <th className="px-6 py-4">Est. Cost</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {repairs.length > 0 ? (
                repairs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {item.item_name}
                      <span className="block text-xs text-slate-400 font-normal">{item.item_id}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{item.issue_desc}</td>
                    <td className="px-6 py-4">{item.vendor_name}</td>
                    <td className="px-6 py-4">{item.sent_date}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">${item.cost.toFixed(2)}</td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">Update</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No active repair logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Repairs;
