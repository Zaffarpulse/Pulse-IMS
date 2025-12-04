
import React from 'react';
import { InventoryItem, PurchaseOrder, Requisition, Repair, Contract, Issuance, POStatus, RequestStatus, ItemStatus } from '../types';
import { 
  Package, 
  AlertCircle, 
  ClipboardList, 
  Wrench, 
  AlertTriangle, 
  Calendar,
  ShoppingCart,
  Clock,
  ArrowRight
} from 'lucide-react';

interface StoreDashboardProps {
  inventory: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
  requisitions: Requisition[];
  repairs: Repair[];
  contracts: Contract[];
  issuances: Issuance[];
}

const StoreDashboard: React.FC<StoreDashboardProps> = ({ 
  inventory, 
  purchaseOrders, 
  requisitions, 
  repairs,
  contracts,
  issuances
}) => {
  // Stats
  const totalItems = inventory.reduce((acc, item) => acc + item.quantity, 0);
  const lowStockCount = inventory.filter(i => i.status === ItemStatus.LOW_STOCK || i.status === ItemStatus.OUT_OF_STOCK).length;
  const activeIssuancesCount = issuances.filter(i => i.status === 'Active').length;
  const underRepairCount = repairs.filter(r => r.status === 'In Progress').length;
  
  // Pending Actions
  const pendingRequisitions = requisitions.filter(r => r.status === RequestStatus.PENDING_ADMIN);
  
  // PO Logic
  // Assuming "Arriving Soon" means pending/sent and not overdue. 
  // "Overdue" needs logic comparing expected date to today.
  const today = new Date().toISOString().split('T')[0];
  const overduePOs = purchaseOrders.filter(po => 
    po.status !== POStatus.COMPLETED && 
    po.status !== POStatus.DRAFT &&
    po.expected_delivery_date < today
  );
  
  const arrivingSoonPOs = purchaseOrders.filter(po => 
    po.status !== POStatus.COMPLETED && 
    po.status !== POStatus.DRAFT &&
    po.expected_delivery_date >= today
  );

  // Lists
  const lowStockList = inventory.filter(i => i.status === ItemStatus.LOW_STOCK || i.status === ItemStatus.OUT_OF_STOCK).slice(0, 5);
  const expiringContracts = contracts.filter(c => c.status === 'Expiring Soon');

  return (
    <div className="space-y-6">
      <div className="mb-2">
         <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
         <p className="text-slate-500">Overview of your inventory system</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Items */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
           <div className="flex justify-between items-start">
             <div>
                <p className="text-sm font-medium text-slate-500">Total Items</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-1">{totalItems.toLocaleString()}</h2>
                <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center">
                   <span className="text-emerald-500 mr-1">↗</span> +12% from last month
                </p>
             </div>
             <div className="p-3 bg-blue-500 rounded-lg text-white shadow-md shadow-blue-200">
                <Package className="w-6 h-6" />
             </div>
           </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
           <div className="flex justify-between items-start">
             <div>
                <p className="text-sm font-medium text-slate-500">Low Stock Alerts</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-1">{lowStockCount}</h2>
             </div>
             <div className="p-3 bg-red-500 rounded-lg text-white shadow-md shadow-red-200">
                <AlertCircle className="w-6 h-6" />
             </div>
           </div>
        </div>

        {/* Active Issuances */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
           <div className="flex justify-between items-start">
             <div>
                <p className="text-sm font-medium text-slate-500">Active Issuances</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-1">{activeIssuancesCount}</h2>
             </div>
             <div className="p-3 bg-violet-500 rounded-lg text-white shadow-md shadow-violet-200">
                <ClipboardList className="w-6 h-6" />
             </div>
           </div>
        </div>

        {/* Under Repair */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
           <div className="flex justify-between items-start">
             <div>
                <p className="text-sm font-medium text-slate-500">Under Repair</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-1">{underRepairCount}</h2>
             </div>
             <div className="p-3 bg-amber-500 rounded-lg text-white shadow-md shadow-amber-200">
                <Wrench className="w-6 h-6" />
             </div>
           </div>
        </div>
      </div>

      {/* Alert Banner */}
      {pendingRequisitions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-400 rounded-full text-white shadow-sm">
                 <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="text-slate-900 font-bold">{pendingRequisitions.length} Requisition Awaiting Approval</h3>
                 <p className="text-sm text-slate-600">These requisitions need your immediate attention</p>
              </div>
           </div>
           <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors w-full sm:w-auto">
              Review Now
           </button>
        </div>
      )}

      {/* PO Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* PO Arriving Soon */}
         <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 relative">
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500 rounded-full text-white">
                     <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-900 text-lg">{arrivingSoonPOs.length} PO Arriving Soon</h3>
                     <p className="text-sm text-slate-500">Expected within 3 days</p>
                  </div>
               </div>
               <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                  Review
               </button>
            </div>
            <div className="space-y-3">
               {arrivingSoonPOs.map(po => (
                  <div key={po.po_number} className="text-sm text-slate-800 bg-white/60 p-2 rounded-lg">
                     <span className="font-bold">{po.po_number}</span> - {po.vendor_name} <span className="text-slate-500">(0 days)</span>
                  </div>
               ))}
               {arrivingSoonPOs.length === 0 && <p className="text-sm text-slate-500 italic">No incoming shipments.</p>}
            </div>
         </div>

         {/* Overdue PO */}
         <div className="bg-red-50 border border-red-100 rounded-xl p-6 relative">
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-500 rounded-full text-white">
                     <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-900 text-lg">{overduePOs.length} Overdue PO</h3>
                     <p className="text-sm text-slate-500">Past expected delivery date</p>
                  </div>
               </div>
               <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                  Review
               </button>
            </div>
            <div className="space-y-3">
               {overduePOs.map(po => (
                  <div key={po.po_number} className="text-sm text-slate-800 bg-white/60 p-2 rounded-lg">
                     <span className="font-bold">{po.po_number}</span> - {po.vendor_name} <span className="text-red-600 font-medium">(0 days overdue)</span>
                  </div>
               ))}
               {overduePOs.length === 0 && <p className="text-sm text-slate-500 italic">No overdue orders.</p>}
            </div>
         </div>
      </div>

      {/* Bottom Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Low Stock List */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
               <span className="text-orange-500"><AlertCircle className="w-5 h-5"/></span>
               Low Stock Alerts
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
               {lowStockList.map(item => (
                  <div key={item.id} className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                     <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Low Stock</span>
                     </div>
                     <p className="text-xs text-slate-600 mb-2">
                        Current: <span className="font-bold text-red-600">{item.quantity}</span> | Min: {item.minStock}
                     </p>
                     <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Serial: {item.serialNumber}</span>
                        <button className="text-xs flex items-center gap-1 border border-red-200 bg-white text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors">
                           <ShoppingCart className="w-3 h-3" /> Restock
                        </button>
                     </div>
                  </div>
               ))}
               {lowStockList.length === 0 && <p className="text-sm text-slate-500">Inventory levels are healthy.</p>}
            </div>
         </div>

         {/* Contract Expiring List */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
               <span className="text-orange-500"><AlertCircle className="w-5 h-5"/></span>
               Contract Expiring Soon
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
               {expiringContracts.map(contract => (
                  <div key={contract.id} className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                     <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-800 text-sm">{contract.name}</h4>
                        <span className="bg-orange-200 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{contract.type}</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Expires: {contract.end_date} (0 days)</span>
                     </div>
                     <div className="text-xs text-slate-400 mt-1">Vendor: {contract.vendor_name || 'N/A'}</div>
                  </div>
               ))}
               {expiringContracts.length === 0 && <p className="text-sm text-slate-500">No expiring contracts.</p>}
            </div>
         </div>

      </div>

    </div>
  );
};

export default StoreDashboard;
