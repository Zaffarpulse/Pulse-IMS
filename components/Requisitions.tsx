
import React, { useState } from 'react';
import { Requisition, RequestStatus, InventoryItem, Department } from '../types';
import { ClipboardList, User, Plus, X } from 'lucide-react';

interface RequisitionsProps {
  requisitions: Requisition[];
  inventory: InventoryItem[];
  isAdmin: boolean;
  onAddRequisition: (req: Requisition) => void;
}

const Requisitions: React.FC<RequisitionsProps> = ({ requisitions, inventory, isAdmin, onAddRequisition }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [selectedItemName, setSelectedItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [priority, setPriority] = useState<'Normal' | 'High'>('Normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReq: Requisition = {
        id: `REQ-${Math.floor(Math.random() * 1000)}`,
        requesterName: 'Current User', // Mocked
        requesterId: 'u1', // Mocked
        requesterStaffId: '1', // Mocked
        requestType: 'Issue',
        departmentTarget: Department.STORE, // Mocked
        itemName: selectedItemName,
        quantity: Number(quantity),
        priority: priority,
        status: RequestStatus.PENDING_ADMIN,
        dateRequested: new Date().toISOString().split('T')[0],
        logs: []
    };

    onAddRequisition(newReq);
    setIsModalOpen(false);
    // Reset
    setSelectedItemName('');
    setQuantity(1);
    setPriority('Normal');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Requisitions</h1>
          <p className="text-slate-500">{isAdmin ? 'Approve and manage staff requests.' : 'Request new supplies for your department.'}</p>
        </div>
        {!isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </button>
        )}
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900">Request Supplies</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                   <X className="w-5 h-5" />
                </button>
             </div>
             
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Select Item</label>
                   <select 
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={selectedItemName}
                      onChange={(e) => setSelectedItemName(e.target.value)}
                   >
                      <option value="">-- Choose Item --</option>
                      {inventory.map(item => (
                          <option key={item.id} value={item.name}>{item.name}</option>
                      ))}
                   </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                        <input 
                            required
                            type="number"
                            min="1"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                        <select 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as 'Normal' | 'High')}
                        >
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                        </select>
                    </div>
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
                     Submit Request
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {requisitions.map((req) => (
          <div key={req.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <User className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-900">{req.id}</h3>
                    <p className="text-sm text-slate-500">{req.requesterName} • {req.departmentTarget}</p>
                 </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                req.status === RequestStatus.APPROVED_ADMIN ? 'bg-emerald-100 text-emerald-700' : 
                req.status === RequestStatus.PENDING_ADMIN ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {req.status}
              </span>
            </div>

            <div className="mb-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Requested Item</h4>
              <div className="space-y-2">
                   <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded border border-slate-100">
                      <span className="text-slate-700 font-medium">{req.itemName}</span>
                      <div className="flex items-center gap-3">
                        {req.priority === 'High' && <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">High Priority</span>}
                        <span className="text-slate-600">Qty: {req.quantity}</span>
                      </div>
                   </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
               <span className="text-xs text-slate-400">Date: {req.dateRequested}</span>
               {isAdmin && req.status === RequestStatus.PENDING_ADMIN && (
                 <div className="flex gap-2">
                   <button className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1">Reject</button>
                   <button className="text-sm text-white bg-emerald-600 hover:bg-emerald-700 font-medium px-4 py-1.5 rounded-lg shadow-sm transition-colors">Approve Request</button>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requisitions;
