
import React, { useState } from 'react';
import { User, Department, InventoryItem, RequestStatus } from '../types';
import { dataService } from '../services/dataService';
import { ShoppingBag, PenTool, Home, Wrench, Plus, CheckCircle, Search, ClipboardPen, User as UserIcon, LayoutDashboard, Clock } from 'lucide-react';
import { StatCard } from '../components/DashboardStats';

interface Props {
  user: User;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const StaffPortal: React.FC<Props> = ({ user, activeTab, onNavigate }) => {
  const [activeDept, setActiveDept] = useState<Department>(Department.STORE);
  const [searchQuery, setSearchQuery] = useState('');
  const [refresh, setRefresh] = useState(0);

  // Shop Data
  const inventory = dataService.getInventory(activeDept).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // User Requests
  const myRequests = dataService.getRequisitions(undefined, user.role, user.id);
  const pendingCount = myRequests.filter(r => r.status === RequestStatus.PENDING_ADMIN).length;
  const approvedCount = myRequests.filter(r => r.status === RequestStatus.APPROVED_ADMIN).length;

  const handleRequest = (item: InventoryItem) => {
    dataService.addRequisition({
      requestType: 'Issue',
      requesterId: user.id,
      requesterStaffId: user.staffId,
      requesterName: user.name,
      departmentTarget: activeDept,
      itemId: item.id,
      itemName: item.name,
      quantity: 1,
      dateRequested: new Date().toISOString()
    });
    setRefresh(prev => prev + 1);
    alert(`Requisition for ${item.name} submitted to Admin!`);
  };

  const handleCustomRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    dataService.addRequisition({
      requestType: activeDept === Department.ALLIED ? 'Repair' : (activeDept === Department.HOUSEKEEPING ? 'Cleaning' : 'Procurement'),
      requesterId: user.id,
      requesterStaffId: user.staffId,
      requesterName: user.name,
      departmentTarget: activeDept,
      itemName: formData.get('description') as string,
      description: formData.get('details') as string,
      dateRequested: new Date().toISOString()
    });
    setRefresh(prev => prev + 1);
    (e.target as HTMLFormElement).reset();
    alert('Request submitted with your digital signature!');
  };

  const deptConfig = {
    [Department.STORE]: { icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50', label: 'General Store' },
    [Department.MEDICAL]: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Medical Store' },
    [Department.HOUSEKEEPING]: { icon: Home, color: 'text-green-600', bg: 'bg-green-50', label: 'Housekeeping' },
    [Department.ALLIED]: { icon: Wrench, color: 'text-slate-600', bg: 'bg-slate-50', label: 'Allied Services' }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
         <div>
            <h1 className="text-xl font-bold text-gray-900">Staff Portal</h1>
            <p className="text-sm text-gray-500">Welcome, {user.name} ({user.staffId})</p>
         </div>
         <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
             <ClipboardPen size={16} />
             <span>Digital Signature Active</span>
         </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Requests" value={myRequests.length} icon={LayoutDashboard} color="blue" />
            <StatCard title="Pending" value={pendingCount} icon={Clock} color="yellow" />
            <StatCard title="Approved" value={approvedCount} icon={CheckCircle} color="green" />
            
            <div className="md:col-span-3">
               <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => onNavigate('shop')} className="p-6 bg-teal-600 text-white rounded-xl shadow-md hover:bg-teal-700 transition-colors flex items-center justify-center space-x-3">
                     <Plus size={24} />
                     <span className="font-bold text-lg">New Requisition</span>
                  </button>
                  <button onClick={() => onNavigate('my-requests')} className="p-6 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3">
                     <Clock size={24} />
                     <span className="font-bold text-lg">View History</span>
                  </button>
               </div>
            </div>
        </div>
      )}

      {(activeTab === 'shop' || activeTab === 'dashboard') && activeTab !== 'dashboard' && (
        <>
            {/* Department Switcher */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.values(Department).map((dept) => {
                const Config = deptConfig[dept];
                return (
                    <button
                    key={dept}
                    onClick={() => setActiveDept(dept)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                        activeDept === dept 
                        ? 'border-teal-500 bg-teal-50 shadow-md transform scale-105' 
                        : 'border-gray-200 bg-white hover:border-teal-300'
                    }`}
                    >
                    <div className={`p-2 rounded-full ${Config.bg}`}>
                        <Config.icon className={`w-6 h-6 ${Config.color}`} />
                    </div>
                    <span className="font-medium text-sm text-gray-700">{Config.label}</span>
                    </button>
                );
                })}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px]">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex space-x-6">
                    <button 
                    className={`pb-4 -mb-4 border-b-2 font-medium text-sm transition-colors border-teal-600 text-teal-600`}
                    >
                    {activeDept === Department.ALLIED ? 'Report Fault / Maintenance' : (activeDept === Department.HOUSEKEEPING ? 'Request Cleaning' : 'Browse Inventory')}
                    </button>
                </div>
                {activeDept !== Department.ALLIED && activeDept !== Department.HOUSEKEEPING && (
                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search items..." 
                        className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    </div>
                )}
                </div>

                <div className="p-6">
                    {(activeDept === Department.STORE || activeDept === Department.MEDICAL) ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {inventory.map(item => (
                            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col justify-between group">
                                <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">{item.unit}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                <div className={`mt-2 text-xs font-medium inline-flex items-center ${item.quantity > item.minStock ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.quantity > item.minStock ? 'In Stock' : 'Low Stock'}
                                </div>
                                </div>
                                <button 
                                onClick={() => handleRequest(item)}
                                className="mt-4 w-full bg-white border border-teal-600 text-teal-600 group-hover:bg-teal-600 group-hover:text-white py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
                                >
                                <Plus size={16} />
                                <span>Add Requisition</span>
                                </button>
                            </div>
                        ))}
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Submitting this request will automatically attach your digital signature and forward it to the Admin for approval.
                                </p>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={handleCustomRequest} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Service / Fault Title</label>
                                <input name="description" required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2" placeholder={activeDept === Department.ALLIED ? "e.g., AC Leaking in Room 101" : "e.g., Deep clean required for OR 2"} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
                                <textarea name="details" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-2" placeholder="Please describe the issue or requirement in detail..."></textarea>
                            </div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                Submit Signed Request
                            </button>
                        </form>
                        </div>
                    )}
                </div>
            </div>
        </>
      )}

      {activeTab === 'my-requests' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">My Request History</h2>
            </div>
            <div className="p-6 space-y-4">
              {myRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No requests found.</p>
              ) : (
                myRequests.map(req => (
                    <div key={req.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div>
                        <h4 className="font-medium text-gray-900">{req.itemName}</h4>
                        <p className="text-sm text-gray-500">{req.departmentTarget} &bull; {new Date(req.dateRequested).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        req.status === RequestStatus.APPROVED_ADMIN ? 'bg-green-100 text-green-800' :
                        req.status === RequestStatus.ISSUED ? 'bg-blue-100 text-blue-800' :
                        req.status === RequestStatus.REJECTED ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                        }`}>
                        {req.status}
                        </span>
                    </div>
                    </div>
                ))
              )}
            </div>
        </div>
      )}
    </div>
  );
};
