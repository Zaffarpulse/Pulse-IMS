
import React, { useState } from 'react';
import { PurchaseOrder, POStatus, InventoryItem, ItemStatus } from '../types';
import { FileText, Clock, CheckCircle, Truck, Plus, X, AlertCircle } from 'lucide-react';

interface ProcurementProps {
  orders: PurchaseOrder[];
  inventory: InventoryItem[];
  onCreateOrder: (po: PurchaseOrder) => void;
}

const Procurement: React.FC<ProcurementProps> = ({ orders, inventory, onCreateOrder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{id: string, qty: number}[]>([]);

  // Identify Low Stock Items for Automation
  const lowStockItems = inventory.filter(
    item => item.status === ItemStatus.LOW_STOCK || item.status === ItemStatus.OUT_OF_STOCK
  );

  const getStatusColor = (status: POStatus) => {
    switch (status) {
      case POStatus.PENDING_APPROVAL: return 'bg-amber-100 text-amber-700 border-amber-200';
      case POStatus.SENT_TO_VENDOR: return 'bg-blue-100 text-blue-700 border-blue-200';
      case POStatus.COMPLETED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: POStatus) => {
    switch (status) {
      case POStatus.PENDING_APPROVAL: return <Clock className="w-4 h-4 mr-1"/>;
      case POStatus.SENT_TO_VENDOR: return <Truck className="w-4 h-4 mr-1"/>;
      case POStatus.COMPLETED: return <CheckCircle className="w-4 h-4 mr-1"/>;
      default: return <FileText className="w-4 h-4 mr-1"/>;
    }
  };

  const toggleItemSelection = (id: string, defaultQty: number) => {
    if (selectedItems.find(i => i.id === id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== id));
    } else {
      setSelectedItems([...selectedItems, { id, qty: defaultQty * 2 }]); // Default to 2x minStock for safety
    }
  };

  const handleCreate = () => {
    if (selectedItems.length === 0) return;

    const newItems = selectedItems.map(selection => {
        const invItem = inventory.find(i => i.id === selection.id)!;
        return {
            item_id: invItem.id,
            item_name: invItem.name,
            quantity: selection.qty,
            unit_price: invItem.purchasePrice || 0
        };
    });

    const totalAmount = newItems.reduce((acc, curr) => acc + (curr.quantity * curr.unit_price), 0);

    const newPO: PurchaseOrder = {
        po_number: `PO-2023-${Math.floor(Math.random() * 1000)}`,
        vendor_id: 'v1', // Mock default
        vendor_name: 'MedSupply Corp', // Mock default
        items: newItems,
        total_amount: totalAmount,
        status: POStatus.PENDING_APPROVAL,
        created_date: new Date().toISOString().split('T')[0],
        expected_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    onCreateOrder(newPO);
    setIsModalOpen(false);
    setSelectedItems([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Procurement</h1>
          <p className="text-slate-500">Manage purchase orders and vendor deliveries.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Purchase Order
        </button>
      </div>

      {/* Create PO Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="text-lg font-bold text-slate-900">New Purchase Order</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                 <div className="flex items-center p-3 mb-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <strong>Auto-Detection:</strong> Found {lowStockItems.length} items below minimum stock level.
                 </div>

                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600">
                       <tr>
                          <th className="p-3 rounded-tl-lg">Select</th>
                          <th className="p-3">Item</th>
                          <th className="p-3">Current Qty</th>
                          <th className="p-3">Min Stock</th>
                          <th className="p-3 rounded-tr-lg">Order Qty</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {lowStockItems.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50">
                             <td className="p-3">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                  checked={!!selectedItems.find(i => i.id === item.id)}
                                  onChange={() => toggleItemSelection(item.id, item.minStock)}
                                />
                             </td>
                             <td className="p-3 font-medium text-slate-800">{item.name}</td>
                             <td className="p-3 text-red-600 font-bold">{item.quantity}</td>
                             <td className="p-3 text-slate-500">{item.minStock}</td>
                             <td className="p-3">
                                <input 
                                   type="number" 
                                   className="w-20 p-1 border border-slate-300 rounded text-center"
                                   defaultValue={item.minStock * 2}
                                   disabled={!selectedItems.find(i => i.id === item.id)}
                                   onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      setSelectedItems(prev => prev.map(p => p.id === item.id ? {...p, qty: val} : p));
                                   }}
                                />
                             </td>
                          </tr>
                       ))}
                       {lowStockItems.length === 0 && (
                          <tr><td colSpan={5} className="p-4 text-center text-slate-500">No low stock items found.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                 <button 
                   onClick={() => setIsModalOpen(false)} 
                   className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleCreate}
                   disabled={selectedItems.length === 0}
                   className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   Generate PO ({selectedItems.length} items)
                 </button>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {orders.map((po) => (
          <div key={po.po_number} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <FileText className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{po.po_number}</h3>
                  <p className="text-sm text-slate-500">{po.vendor_name}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center ${getStatusColor(po.status)}`}>
                  {getStatusIcon(po.status)}
                  {po.status}
                </span>
                <span className="text-xs text-slate-400 mt-1">Due: {po.expected_delivery_date}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="pb-2 font-medium">Item</th>
                    <th className="pb-2 font-medium text-right">Qty</th>
                    <th className="pb-2 font-medium text-right">Unit Price</th>
                    <th className="pb-2 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {po.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0">
                      <td className="py-2 text-slate-700">{item.item_name}</td>
                      <td className="py-2 text-right text-slate-600">{item.quantity}</td>
                      <td className="py-2 text-right text-slate-600">${item.unit_price.toFixed(2)}</td>
                      <td className="py-2 text-right font-medium text-slate-900">${(item.quantity * item.unit_price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center">
               <div className="text-sm text-slate-500">
                  Created: {po.created_date}
               </div>
               <div className="flex items-center gap-4">
                 <span className="text-lg font-bold text-slate-900">Total: ${po.total_amount.toFixed(2)}</span>
                 {po.status === POStatus.PENDING_APPROVAL && (
                   <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Reject</button>
                      <button className="px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">Approve</button>
                   </div>
                 )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Procurement;
