
import React, { useState, useEffect } from 'react';
import { User, Department, RequestStatus, Role, InventoryItem, Requisition, Vendor } from '../types';
import { dataService } from '../services/dataService';
import { generateInventoryInsight } from '../services/geminiService';
import { StatCard } from '../components/DashboardStats';
import { RequisitionTable } from '../components/RequisitionTable';
import { InventoryManager } from '../components/InventoryManager';
import { Package, AlertTriangle, CheckSquare, Activity, Sparkles, HeartPulse, Truck, PackagePlus, Plus, Trash2, Printer, Search, FileText, CheckCircle } from 'lucide-react';

interface Props {
  user: User;
  department: Department;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const InchargePortal: React.FC<Props> = ({ user, department, activeTab, onNavigate }) => {
  const [refresh, setRefresh] = useState(0);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [printReq, setPrintReq] = useState<Requisition | null>(null);

  // States for Store specific modules
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isProcurementModalOpen, setIsProcurementModalOpen] = useState(false);

  const inventory = dataService.getInventory(department);
  const requests = dataService.getRequisitions(department, user.role, user.id);
  const stats = dataService.getStats(department);
  const vendors = dataService.getVendors();
  
  // Specific view logic
  const isStore = department === Department.STORE;

  useEffect(() => {
    // Simulate AI loading
    if (activeTab === 'dashboard') {
        const fetchAi = async () => {
            const txt = await generateInventoryInsight(inventory);
            setAiInsight(txt);
        }
        fetchAi();
    }
  }, [activeTab, inventory]);


  const handleAction = (id: string, action: string) => {
    if (action === 'issue') {
      dataService.updateRequisitionStatus(id, RequestStatus.ISSUED, user.name, user.role);
    } else if (action === 'print') {
       const req = dataService.getRequisitions().find(r => r.id === id);
       if (req) {
         setPrintReq(req);
         setTimeout(() => window.print(), 100);
       }
    }
    setRefresh(prev => prev + 1);
  };

  const handleReceiveStock = (id: string) => {
     if(confirm('Confirm receipt of goods? This will automatically add the quantity to your inventory.')) {
         dataService.updateRequisitionStatus(id, RequestStatus.ISSUED, user.name, user.role);
         setRefresh(prev => prev + 1);
     }
  };

  const handleAddVendor = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      dataService.addVendor({
          id: `v${Date.now()}`,
          name: formData.get('name') as string,
          contactPerson: formData.get('contact') as string,
          mobile: formData.get('mobile') as string,
          category: formData.get('category') as string,
          address: formData.get('address') as string
      });
      setIsVendorModalOpen(false);
      setRefresh(prev => prev + 1);
  };

  const handleDeleteVendor = (id: string) => {
      if(confirm('Delete vendor?')) {
          dataService.deleteVendor(id);
          setRefresh(prev => prev + 1);
      }
  };

  const handleCreateProcurement = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const itemName = formData.get('item') as string;
      const vendor = formData.get('vendor') as string;
      
      dataService.addRequisition({
          requestType: 'Procurement',
          requesterId: user.id,
          requesterStaffId: user.staffId,
          requesterName: user.name,
          departmentTarget: department,
          itemName: itemName,
          description: `Vendor: ${vendor}. Requested for stock replenishment.`,
          quantity: parseInt(formData.get('quantity') as string),
          dateRequested: new Date().toISOString()
      });
      setIsProcurementModalOpen(false);
      alert('Procurement Request Sent to Admin!');
      setRefresh(prev => prev + 1);
  };

  return (
    <>
      <div className="space-y-6 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{department} Manager</h1>
            <p className="text-sm text-gray-500">Pulse Hospital &bull; {user.name}</p>
          </div>
          <div className="mt-2 sm:mt-0 flex space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <button onClick={() => onNavigate('dashboard')} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Dashboard</button>
            <button onClick={() => onNavigate('inventory')} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${activeTab === 'inventory' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Inventory</button>
            <button onClick={() => onNavigate('requests')} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${activeTab === 'requests' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Requests</button>
            
            {/* Store Specific Tabs */}
            {isStore && (
                <>
                    <button onClick={() => onNavigate('suppliers')} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${activeTab === 'suppliers' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Suppliers</button>
                    <button onClick={() => onNavigate('procurement')} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${activeTab === 'procurement' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Procurement</button>
                    <button onClick={() => onNavigate('reports')} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${activeTab === 'reports' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Reports</button>
                </>
            )}
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title="Total Items" value={stats.totalItems} icon={Package} color="blue" />
                  <StatCard title="Low Stock Alerts" value={stats.lowStock} icon={AlertTriangle} color="red" />
                  <StatCard title="Pending Tasks/Issue" value={stats.pendingRequests} icon={CheckSquare} color="yellow" />
                  <StatCard title="Total Value" value={`$${stats.totalValue}`} icon={Activity} color="green" />
              </div>

              {/* AI Insight Card */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl border border-teal-100 shadow-sm relative overflow-hidden">
                  <div className="flex items-start space-x-4 relative z-10">
                      <div className="p-3 bg-white rounded-lg shadow-sm text-teal-600">
                          <Sparkles size={24} />
                      </div>
                      <div>
                          <h3 className="text-lg font-bold text-gray-900">AI Inventory Insights</h3>
                          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                              {aiInsight ? aiInsight : 'Pulse Hospital AI is analyzing stock patterns...'}
                          </p>
                      </div>
                  </div>
              </div>
          </>
        )}

        {activeTab === 'inventory' && (
            <InventoryManager department={department} />
        )}

        {activeTab === 'requests' && (
          <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requests Approved for Issue</h3>
              <RequisitionTable 
                  requisitions={requests.filter(r => r.status === RequestStatus.APPROVED_ADMIN || r.status === RequestStatus.ISSUED).filter(r => r.requestType !== 'Procurement')} 
                  role={user.role} 
                  onAction={(id, action) => handleAction(id, action)} 
              />
          </div>
        )}

        {/* STORE SPECIFIC MODULES */}
        {activeTab === 'suppliers' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Vendor Management</h2>
                    <button onClick={() => setIsVendorModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
                        <Plus size={16} /> <span>Add Vendor</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendors.map(v => (
                        <div key={v.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900">{v.name}</h3>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 mt-1 inline-block">{v.category}</span>
                                </div>
                                <button onClick={() => handleDeleteVendor(v.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                            </div>
                            <div className="mt-4 space-y-1 text-sm text-gray-600">
                                <p><span className="font-medium text-gray-900">Contact:</span> {v.contactPerson}</p>
                                <p><span className="font-medium text-gray-900">Mobile:</span> {v.mobile}</p>
                                <p className="truncate"><span className="font-medium text-gray-900">Address:</span> {v.address || 'N/A'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'procurement' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Procurement Orders</h2>
                    <button onClick={() => setIsProcurementModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
                        <PackagePlus size={16} /> <span>Create PO</span>
                    </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PO ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {requests.filter(r => r.requestType === 'Procurement').length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No active procurement orders.</td></tr>
                            ) : (
                                requests.filter(r => r.requestType === 'Procurement').map(req => (
                                    <tr key={req.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.itemName} <span className="text-xs text-gray-400">({req.quantity})</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{req.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${req.status === RequestStatus.APPROVED_ADMIN ? 'bg-green-100 text-green-800' : (req.status === RequestStatus.ISSUED ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800')}`}>
                                                {req.status === RequestStatus.APPROVED_ADMIN ? 'Approved (Pending Receipt)' : (req.status === RequestStatus.ISSUED ? 'Received / Closed' : req.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {req.status === RequestStatus.APPROVED_ADMIN && (
                                                <button 
                                                    onClick={() => handleReceiveStock(req.id)}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-teal-600 hover:bg-teal-700"
                                                >
                                                    <CheckCircle size={14} className="mr-1" />
                                                    Receive Stock
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'reports' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                     <div className="flex items-center space-x-3 mb-4">
                         <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FileText size={24} /></div>
                         <h3 className="text-lg font-bold">Stock Ledger</h3>
                     </div>
                     <p className="text-sm text-gray-500 mb-4">Complete history of stock in/out movement.</p>
                     <div className="max-h-64 overflow-y-auto">
                         {requests.filter(r => r.status === RequestStatus.ISSUED).map(r => (
                             <div key={r.id} className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                                 <div>
                                     <span className="font-medium text-gray-900">{r.itemName}</span>
                                     <span className="text-gray-500 mx-2">
                                        {r.requestType === 'Procurement' ? '<-' : '->'}
                                     </span>
                                     <span className="text-gray-600">
                                        {r.requestType === 'Procurement' ? `Vendor (Added ${r.quantity})` : r.requesterName}
                                     </span>
                                 </div>
                                 <div className="text-gray-400 text-xs">{new Date(r.dateIssued!).toLocaleDateString()}</div>
                             </div>
                         ))}
                     </div>
                 </div>
                 <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                     <div className="flex items-center space-x-3 mb-4">
                         <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Truck size={24} /></div>
                         <h3 className="text-lg font-bold">Vendor List Report</h3>
                     </div>
                     <p className="text-sm text-gray-500 mb-4">Printable list of all registered suppliers.</p>
                     <div className="max-h-64 overflow-y-auto mb-4">
                         <table className="w-full text-sm">
                             <thead>
                                 <tr className="text-left text-gray-500 border-b">
                                     <th className="pb-2">Vendor</th>
                                     <th className="pb-2">Category</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {vendors.map(v => (
                                     <tr key={v.id}>
                                         <td className="py-2 font-medium">{v.name}</td>
                                         <td className="py-2 text-gray-500">{v.category}</td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                     <button onClick={() => window.print()} className="w-full py-2 border border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50">
                         <Printer size={16} />
                         <span>Print Vendor List</span>
                     </button>
                 </div>
             </div>
        )}
      </div>

      {/* MODALS */}
      {isVendorModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                  <h3 className="text-xl font-bold mb-4">Add New Vendor</h3>
                  <form onSubmit={handleAddVendor} className="space-y-4">
                      <input name="name" required placeholder="Company Name" className="w-full border p-2 rounded" />
                      <input name="contact" required placeholder="Contact Person" className="w-full border p-2 rounded" />
                      <input name="mobile" required placeholder="Mobile Number" className="w-full border p-2 rounded" />
                      <input name="category" placeholder="Category (e.g. Stationery)" className="w-full border p-2 rounded" />
                      <textarea name="address" placeholder="Address" className="w-full border p-2 rounded"></textarea>
                      <div className="flex justify-end space-x-2 pt-2">
                          <button type="button" onClick={() => setIsVendorModalOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded">Add Vendor</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {isProcurementModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                  <h3 className="text-xl font-bold mb-4">Create Procurement Request</h3>
                  <form onSubmit={handleCreateProcurement} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Item Name</label>
                          <input name="item" required className="w-full border p-2 rounded" placeholder="What do you need?" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Quantity</label>
                          <input name="quantity" type="number" required className="w-full border p-2 rounded" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Vendor (Optional)</label>
                          <select name="vendor" className="w-full border p-2 rounded">
                              <option value="Any">Any Available</option>
                              {vendors.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                          </select>
                      </div>
                      <div className="flex justify-end space-x-2 pt-2">
                          <button type="button" onClick={() => setIsProcurementModalOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded">Send to Admin</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* PRINT VIEW (Incharge Version) */}
      {printReq && (
        <div className="print-only p-8 max-w-4xl mx-auto">
           <div className="flex justify-between items-center border-b-2 border-gray-800 pb-4 mb-6">
             <div className="flex items-center space-x-4">
                <HeartPulse size={40} className="text-gray-900" />
                <div>
                   <h1 className="text-3xl font-bold text-gray-900">PULSE HOSPITAL</h1>
                   <p className="text-sm text-gray-600">Jammu, India &bull; {department}</p>
                </div>
             </div>
             <div className="text-right">
                <h2 className="text-xl font-bold uppercase text-gray-800">Issue Slip / Work Order</h2>
                <p className="text-gray-500">Ref: {printReq.id}</p>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-8 mb-8">
             <div>
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Details</h3>
                <p><span className="font-semibold">Type:</span> {printReq.requestType}</p>
                <p><span className="font-semibold">Issued By:</span> {user.name} (Incharge)</p>
                <p><span className="font-semibold">Date Completed:</span> {new Date(printReq.dateIssued || Date.now()).toLocaleDateString()}</p>
             </div>
             <div>
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Requester</h3>
                <p><span className="font-semibold">Name:</span> {printReq.requesterName}</p>
                <p><span className="font-semibold">ID:</span> {printReq.requesterStaffId}</p>
             </div>
           </div>

           <div className="mb-8">
             <table className="w-full border border-gray-300">
               <thead className="bg-gray-100">
                 <tr>
                    <th className="p-3 border border-gray-300 text-left">Item Name / Description</th>
                    <th className="p-3 border border-gray-300 text-center">Qty Issued</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td className="p-3 border border-gray-300">
                      <p className="font-bold">{printReq.itemName}</p>
                      <p className="text-sm text-gray-600">{printReq.description}</p>
                   </td>
                   <td className="p-3 border border-gray-300 text-center font-bold">{printReq.quantity || '-'}</td>
                 </tr>
               </tbody>
             </table>
           </div>

           <div className="grid grid-cols-3 gap-8 mt-16 text-center">
              <div className="flex flex-col items-center">
                 <div className="h-16 flex items-end mb-2">
                    {printReq.staffSignature && <span className="font-cursive text-xl text-blue-600">Signed Digitally</span>}
                 </div>
                 <div className="w-full border-t border-gray-400 pt-2 font-bold text-sm">Receiver</div>
              </div>
              <div className="flex flex-col items-center">
                 <div className="h-16 flex items-end mb-2">
                    {printReq.inchargeSignature && <span className="font-cursive text-xl text-teal-600">Authorized</span>}
                 </div>
                 <div className="w-full border-t border-gray-400 pt-2 font-bold text-sm">Incharge</div>
              </div>
           </div>
        </div>
      )}
    </>
  );
};
