
import React, { useState } from 'react';
import { User, RequestStatus, Role, Requisition, Department } from '../types';
import { StatCard } from '../components/DashboardStats';
import { RequisitionTable } from '../components/RequisitionTable';
import { InventoryManager } from '../components/InventoryManager';
import { dataService } from '../services/dataService';
import { Users, ClipboardList, Box, AlertOctagon, HeartPulse, Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, PenTool, Upload, X, Plus, FileBarChart, Calendar, Printer, Filter } from 'lucide-react';

interface Props {
  user: User;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const AdminPortal: React.FC<Props> = ({ user, activeTab, onNavigate }) => {
  const [refresh, setRefresh] = useState(0); 
  const [printReq, setPrintReq] = useState<Requisition | null>(null);

  // Staff Directory State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [itemsPerPage] = useState(10);
  const [editingSignatureUser, setEditingSignatureUser] = useState<User | null>(null);
  const [newSignature, setNewSignature] = useState<string | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const stats = dataService.getAdminStats();
  const pendingRequests = dataService.getRequisitions().filter(r => r.status === RequestStatus.PENDING_ADMIN);
  const recentHistory = dataService.getRequisitions().filter(r => r.status !== RequestStatus.PENDING_ADMIN).slice(0, 10);

  const handleAction = (id: string, action: string) => {
    if (action === 'approve') {
      dataService.updateRequisitionStatus(id, RequestStatus.APPROVED_ADMIN, user.name, user.role);
    } else if (action === 'reject') {
      dataService.updateRequisitionStatus(id, RequestStatus.REJECTED, user.name, user.role);
    } else if (action === 'print') {
       const req = dataService.getRequisitions().find(r => r.id === id);
       if (req) {
         setPrintReq(req);
         setTimeout(() => window.print(), 100);
       }
    }
    setRefresh(prev => prev + 1);
  };

  // --- STAFF DIRECTORY LOGIC ---
  const users = dataService.getUsers();
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.workDepartment && user.workDepartment.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesDept = deptFilter === 'All' || (user.workDepartment && user.workDepartment === deptFilter);

    return matchesSearch && matchesRole && matchesDept;
  });

  // Get unique departments for filter
  const uniqueDepartments = Array.from(new Set(users.map(u => u.workDepartment).filter(Boolean))).sort();

  const sortedUsers = React.useMemo(() => {
    let sortableItems = [...filteredUsers];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any = '';
        let bValue: any = '';

        switch (sortConfig.key) {
          case 'name': aValue = a.name; bValue = b.name; break;
          case 'staffId': 
             // Try numeric sort for ID, fallback to string
             const aNum = parseInt(a.staffId);
             const bNum = parseInt(b.staffId);
             aValue = isNaN(aNum) ? a.staffId : aNum; 
             bValue = isNaN(bNum) ? b.staffId : bNum;
             break;
          case 'designation': aValue = a.designation || ''; bValue = b.designation || ''; break;
          case 'role': aValue = a.role; bValue = b.role; break;
          default: return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredUsers, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSignature(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSignature = () => {
    if (editingSignatureUser && newSignature) {
      const updatedUser = { ...editingSignatureUser, signatureUrl: newSignature };
      dataService.updateUser(updatedUser);
      setEditingSignatureUser(null);
      setNewSignature(null);
      setRefresh(prev => prev + 1);
    }
  };

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser: User = {
        id: `u${Date.now()}`,
        staffId: formData.get('staffId') as string,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        mobile: formData.get('mobile') as string,
        role: formData.get('role') as Role,
        department: (formData.get('department') as Department) || undefined,
        workDepartment: formData.get('workDepartment') as string,
        designation: formData.get('designation') as string,
        password: '123', // Default password
        avatar: `https://ui-avatars.com/api/?name=${formData.get('name')}`
    };
    dataService.addUser(newUser);
    setIsAddUserModalOpen(false);
    setRefresh(prev => prev + 1);
  };
  
  const handleDeleteUser = (id: string) => {
      if(confirm("Are you sure you want to remove this user? This cannot be undone.")) {
          dataService.deleteUser(id);
          setRefresh(prev => prev + 1);
      }
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return <div className="w-4 h-4 ml-1"></div>;
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />;
  };

  return (
    <>
      <div className="space-y-6 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
          <div className="mt-2 sm:mt-0 flex space-x-2 overflow-x-auto pb-1 sm:pb-0">
            {['dashboard', 'requisitions', 'inventory', 'users', 'reports'].map((tab) => (
                <button 
                key={tab}
                onClick={() => onNavigate(tab)} 
                className={`px-4 py-2 text-sm font-medium rounded-lg capitalize whitespace-nowrap ${activeTab === tab ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                {tab === 'requisitions' ? `Approvals (${pendingRequests.length})` : tab}
                </button>
            ))}
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Staff" value={stats.totalUsers} icon={Users} color="blue" />
              <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={ClipboardList} color="red" trend="Requires attention" />
              <StatCard title="Active Departments" value={stats.departments} icon={Box} color="green" />
              <StatCard title="Total Inventory Items" value={stats.totalInventory} icon={AlertOctagon} color="purple" />
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
              <div className="space-y-4">
                {dataService.getRequisitions().slice(0, 5).map(req => (
                  <div key={req.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                    <div className={`w-2 h-2 mt-2 rounded-full mr-3 ${req.status === RequestStatus.PENDING_ADMIN ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{req.requesterName} requested {req.itemName}</p>
                      <p className="text-xs text-gray-500">{new Date(req.dateRequested).toLocaleString()} &bull; {req.departmentTarget}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">History & Reports</h3>
              <RequisitionTable requisitions={recentHistory} role={Role.ADMIN} onAction={(id, action) => handleAction(id, action as any)} />
            </div>
          </>
        )}

        {activeTab === 'requisitions' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Pending Requisitions</h2>
            <RequisitionTable 
              requisitions={pendingRequests} 
              role={Role.ADMIN} 
              onAction={(id, action) => handleAction(id, action as any)} 
            />
          </div>
        )}

        {activeTab === 'inventory' && (
            <InventoryManager />
        )}
        
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                 <h2 className="text-lg font-semibold text-gray-900">Pulse Hospital Staff Directory</h2>
                 <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                    
                    {/* Filters */}
                    <div className="flex gap-2">
                       <select 
                         value={roleFilter} 
                         onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                         className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-teal-500"
                       >
                         <option value="All">All Roles</option>
                         {Object.values(Role).map(role => <option key={role} value={role}>{role}</option>)}
                       </select>

                       <select 
                         value={deptFilter} 
                         onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
                         className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-teal-500 max-w-[150px]"
                       >
                         <option value="All">All Depts</option>
                         {uniqueDepartments.map(dept => <option key={dept as string} value={dept as string}>{dept}</option>)}
                       </select>
                    </div>

                    <div className="relative flex-grow sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                        type="text" 
                        placeholder="Search Name, ID..." 
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none w-full"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    
                    <button 
                        onClick={() => setIsAddUserModalOpen(true)}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 whitespace-nowrap shadow-sm"
                    >
                        <Plus size={16} />
                        <span>Add Staff</span>
                    </button>
                 </div>
              </div>
              
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                          <tr>
                              <th 
                                onClick={() => requestSort('name')}
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none group transition-colors"
                              >
                                <div className="flex items-center">
                                  Employee {getSortIcon('name')}
                                </div>
                              </th>
                              <th 
                                onClick={() => requestSort('staffId')}
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none group transition-colors"
                              >
                                <div className="flex items-center">ID {getSortIcon('staffId')}</div>
                              </th>
                              <th 
                                onClick={() => requestSort('designation')}
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none group transition-colors"
                              >
                                <div className="flex items-center">Designation / Dept {getSortIcon('designation')}</div>
                              </th>
                              <th 
                                onClick={() => requestSort('role')}
                                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none group transition-colors"
                              >
                                <div className="flex items-center">Role {getSortIcon('role')}</div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                          {currentUsers.map(u => (
                              <tr key={u.id} className="hover:bg-teal-50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="h-9 w-9 flex-shrink-0">
                                            <img className="h-9 w-9 rounded-full border border-gray-200 object-cover" src={u.avatar} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                        </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono bg-gray-50/50">{u.staffId}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <div className="text-gray-900 font-medium">{u.designation || '-'}</div>
                                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{u.workDepartment || '-'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${u.role === Role.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                      {u.role}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                     <div className="flex flex-col">
                                        <span>{u.email || '-'}</span>
                                        <span className="text-xs text-gray-400">{u.mobile || '-'}</span>
                                     </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                     <div className="flex justify-end space-x-2">
                                        <button 
                                            onClick={() => { setEditingSignatureUser(u); setNewSignature(u.signatureUrl || null); }}
                                            className="text-teal-600 hover:text-teal-900 p-1.5 hover:bg-teal-50 rounded-md transition-colors"
                                            title="Update Digital Signature"
                                        >
                                            <PenTool size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete User"
                                        >
                                            <X size={16} />
                                        </button>
                                     </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>

              {/* Enhanced Pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium text-teal-700">{indexOfFirstItem + 1}</span> to <span className="font-medium text-teal-700">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of <span className="font-medium text-teal-700">{filteredUsers.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        {/* Simple Page Indicator */}
                        <div className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 bg-white">
                           Page {currentPage} of {totalPages}
                        </div>

                        <button
                          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
               </div>
          </div>
        )}

        {activeTab === 'reports' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-red-50 rounded-lg text-red-600"><AlertOctagon size={24} /></div>
                            <h3 className="text-lg font-bold">Low Stock Report</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Items that have fallen below minimum stock level across all departments.</p>
                        <div className="max-h-60 overflow-y-auto mb-4">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="p-2">Item</th>
                                        <th className="p-2">Dept</th>
                                        <th className="p-2">Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataService.getInventory().filter(i => i.quantity <= i.minStock).map(i => (
                                        <tr key={i.id} className="border-b">
                                            <td className="p-2 font-medium">{i.name}</td>
                                            <td className="p-2 text-gray-500">{i.department}</td>
                                            <td className="p-2 text-red-600 font-bold">{i.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={() => window.print()} className="w-full py-2 border border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50">
                            <Printer size={16} />
                            <span>Print Report</span>
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FileBarChart size={24} /></div>
                            <h3 className="text-lg font-bold">Daily Issue Log</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Items issued today across all departments.</p>
                        <div className="max-h-60 overflow-y-auto mb-4">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="p-2">Time</th>
                                        <th className="p-2">Item</th>
                                        <th className="p-2">To</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataService.getRequisitions().filter(r => r.status === RequestStatus.ISSUED).slice(0, 10).map(r => (
                                        <tr key={r.id} className="border-b">
                                            <td className="p-2 text-gray-500">{new Date(r.dateIssued!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                            <td className="p-2 font-medium">{r.itemName}</td>
                                            <td className="p-2 text-gray-500 truncate max-w-[100px]">{r.requesterName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={() => window.print()} className="w-full py-2 border border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50">
                            <Printer size={16} />
                            <span>Print Log</span>
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Signature Modal */}
      {editingSignatureUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-gray-900">Digital Signature Manager</h3>
               <button onClick={() => setEditingSignatureUser(null)} className="text-gray-400 hover:text-gray-600">
                 <X size={24} />
               </button>
             </div>
             
             <div className="mb-6">
               <div className="bg-blue-50 p-3 rounded-lg mb-4">
                   <p className="text-sm text-blue-800"><span className="font-semibold">Staff Member:</span> {editingSignatureUser.name}</p>
                   <p className="text-xs text-blue-600">ID: {editingSignatureUser.staffId}</p>
               </div>
               
               <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center text-center bg-gray-50 mb-4 overflow-hidden relative group">
                  {newSignature ? (
                    <img src={newSignature} alt="Signature Preview" className="max-h-full max-w-full object-contain p-2" />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                        <PenTool size={32} className="mb-2 opacity-50" />
                        <p className="italic text-sm">No signature uploaded</p>
                    </div>
                  )}
               </div>

               <label className="block w-full">
                 <span className="sr-only">Choose signature file</span>
                 <div className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                    <Upload size={18} className="mr-2" />
                    Select Image File
                 </div>
                 <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
               </label>
               <p className="text-xs text-gray-500 mt-2 text-center">Use PNG/JPG with transparent background for best results.</p>
             </div>

             <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100">
               <button 
                 onClick={() => setEditingSignatureUser(null)}
                 className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
               >
                 Cancel
               </button>
               <button 
                 onClick={saveSignature}
                 disabled={!newSignature}
                 className="px-5 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
               >
                 Save Changes
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Add New Staff Member</h3>
                    <button onClick={() => setIsAddUserModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" size={24} /></button>
                </div>
                <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Staff ID</label>
                            <input name="staffId" required className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500" placeholder="Unique ID" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">System Role</label>
                            <select name="role" className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm bg-white focus:ring-teal-500 focus:border-teal-500">
                                {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input name="name" required className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500" placeholder="John Doe" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Designation</label>
                            <input name="designation" className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500" placeholder="Nurse" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Work Dept (e.g. ICU)</label>
                            <input name="workDepartment" className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500" placeholder="ICU" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Managed Department (For Incharges)</label>
                        <select name="department" className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm bg-white focus:ring-teal-500 focus:border-teal-500">
                            <option value="">None (Staff)</option>
                            {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Mobile</label>
                             <input name="mobile" className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Email</label>
                             <input name="email" type="email" className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                    </div>
                    <div className="pt-6 flex justify-end">
                        <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
                        <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 shadow-sm">Create Account</button>
                    </div>
                </form>
            </div>
          </div>
      )}

      {/* PRINT VIEW */}
      {printReq && (
        <div className="print-only p-8 max-w-4xl mx-auto">
           <div className="flex justify-between items-center border-b-2 border-gray-800 pb-4 mb-6">
             <div className="flex items-center space-x-4">
                <HeartPulse size={40} className="text-gray-900" />
                <div>
                   <h1 className="text-3xl font-bold text-gray-900">PULSE HOSPITAL</h1>
                   <p className="text-sm text-gray-600">Jammu, India &bull; Inventory Management System</p>
                </div>
             </div>
             <div className="text-right">
                <h2 className="text-xl font-bold uppercase text-gray-800">Requisition Report</h2>
                <p className="text-gray-500">Ref: {printReq.id}</p>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-8 mb-8">
             <div>
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Request Details</h3>
                <p><span className="font-semibold">Type:</span> {printReq.requestType}</p>
                <p><span className="font-semibold">Department:</span> {printReq.departmentTarget}</p>
                <p><span className="font-semibold">Date Requested:</span> {new Date(printReq.dateRequested).toLocaleDateString()}</p>
                <p><span className="font-semibold">Date Completed:</span> {new Date(printReq.dateIssued || Date.now()).toLocaleDateString()}</p>
             </div>
             <div>
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Requester Info</h3>
                <p><span className="font-semibold">Name:</span> {printReq.requesterName}</p>
                <p><span className="font-semibold">Staff ID:</span> {printReq.requesterStaffId}</p>
             </div>
           </div>

           <div className="mb-8">
             <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Item Specifications</h3>
             <table className="w-full border border-gray-300">
               <thead className="bg-gray-100">
                 <tr>
                    <th className="p-3 border border-gray-300 text-left">Item Name / Description</th>
                    <th className="p-3 border border-gray-300 text-center">Quantity</th>
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

           <div className="mb-12">
              <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Digital Audit Trail</h3>
              <div className="bg-gray-50 p-4 rounded text-xs text-gray-600 font-mono border border-gray-200">
                 {printReq.logs.map((log, i) => <div key={i}>{log}</div>)}
              </div>
           </div>

           <div className="grid grid-cols-3 gap-8 mt-16 text-center">
              <div className="flex flex-col items-center">
                 <div className="h-16 flex items-end mb-2">
                    {/* Retrieve dynamic signature if available, else standard text */}
                    {printReq.staffSignature && (
                      <div className="flex flex-col items-center">
                         {users.find(u => u.staffId === printReq.requesterStaffId)?.signatureUrl ? (
                            <img src={users.find(u => u.staffId === printReq.requesterStaffId)?.signatureUrl} alt="Staff Sig" className="max-h-12" />
                         ) : (
                            <span className="font-cursive text-xl text-blue-600">Signed Digitally</span>
                         )}
                      </div>
                    )}
                 </div>
                 <div className="w-full border-t border-gray-400 pt-2 font-bold text-sm">Staff Signature</div>
              </div>
              <div className="flex flex-col items-center">
                 <div className="h-16 flex items-end mb-2">
                    {printReq.adminSignature && <span className="font-cursive text-xl text-green-600">Approved</span>}
                 </div>
                 <div className="w-full border-t border-gray-400 pt-2 font-bold text-sm">Admin Signature</div>
              </div>
              <div className="flex flex-col items-center">
                 <div className="h-16 flex items-end mb-2">
                    {printReq.inchargeSignature && <span className="font-cursive text-xl text-teal-600">Issued</span>}
                 </div>
                 <div className="w-full border-t border-gray-400 pt-2 font-bold text-sm">Incharge Signature</div>
              </div>
           </div>

           <div className="mt-12 text-center text-xs text-gray-400 border-t pt-4">
              This document is electronically generated by Pulse Hospital IMS.
           </div>
        </div>
      )}
    </>
  );
};
