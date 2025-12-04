
import React, { useState, useMemo } from 'react';
import { User, Role, Department } from '../types';
import { 
  Search, Plus, X, Edit2, Trash2, Mail, Phone, 
  Upload, CheckCircle, ChevronLeft, ChevronRight
} from 'lucide-react';

interface StaffDirectoryProps {
  staffMembers: User[];
  onAddStaff: (staff: User) => void;
  onUpdateStaff: (staff: User) => void;
  onDeleteStaff: (id: string) => void;
}

const StaffDirectory: React.FC<StaffDirectoryProps> = ({ 
  staffMembers, 
  onAddStaff, 
  onUpdateStaff, 
  onDeleteStaff
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<User>>({});

  const filteredStaff = useMemo(() => {
    return staffMembers.filter(staff => 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.workDepartment && staff.workDepartment.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [staffMembers, searchTerm]);

  const totalPages = Math.ceil(filteredStaff.length / rowsPerPage);
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData({
      role: Role.STAFF,
      department: undefined
    });
    setIsModalOpen(true);
  };

  const handleEdit = (staff: User) => {
    setEditingStaff(staff);
    setFormData({ ...staff });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      onDeleteStaff(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalStaff: User = {
      id: editingStaff ? editingStaff.id : `u${Date.now()}`,
      name: formData.name || '',
      staffId: formData.staffId || '',
      designation: formData.designation || '',
      workDepartment: formData.workDepartment || '',
      department: formData.department,
      email: formData.email || '',
      mobile: formData.mobile || '',
      role: formData.role || Role.STAFF,
      password: formData.password || '123',
      avatar: formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}`
    };

    if (editingStaff) {
      onUpdateStaff(finalStaff);
    } else {
      onAddStaff(finalStaff);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Staff Directory</h2>
          <p className="text-slate-500 text-sm mt-1">Manage staff members and their information</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
             <Upload className="w-4 h-4 mr-2" /> Import CSV
           </button>
           <button onClick={handleOpenAdd} className="flex items-center bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 text-sm font-bold shadow-md shadow-emerald-200 transition-all transform hover:-translate-y-0.5">
             <Plus className="w-4 h-4 mr-2" /> Add Staff Member
           </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center">
         <div className="relative w-full">
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Search by name, designation, department, or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-sm uppercase">{staff.name}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{staff.designation || '-'}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{staff.workDepartment || '-'}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm font-mono">{staff.staffId}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                       {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col space-y-1">
                        <span className="text-xs text-slate-600 flex items-center"><Mail className="w-3 h-3 mr-1 text-slate-400"/> {staff.email || '-'}</span>
                        <span className="text-xs text-slate-600 flex items-center"><Phone className="w-3 h-3 mr-1 text-slate-400"/> {staff.mobile || '-'}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(staff)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(staff.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center">
           <p className="text-xs text-slate-500">Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filteredStaff.length)} - {Math.min(currentPage * rowsPerPage, filteredStaff.length)} of {filteredStaff.length}</p>
           <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1.5 text-xs border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 flex items-center"><ChevronLeft className="w-3 h-3 mr-1"/> Previous</button>
              <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1.5 text-xs border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 flex items-center">Next <ChevronRight className="w-3 h-3 ml-1"/></button>
           </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="text-xl font-bold text-slate-900">{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
             </div>
             
             <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Full Name</label><input required className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                   <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Employee ID</label><input required className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.staffId || ''} onChange={e => setFormData({...formData, staffId: e.target.value})} /></div>
                   <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Designation</label><input required className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.designation || ''} onChange={e => setFormData({...formData, designation: e.target.value})} /></div>
                   <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Department</label><input required className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.workDepartment || ''} onChange={e => setFormData({...formData, workDepartment: e.target.value})} /></div>
                   <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Email</label><input type="email" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                   <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Phone</label><input className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.mobile || ''} onChange={e => setFormData({...formData, mobile: e.target.value})} /></div>
                   <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">System Role</label><select className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as Role})}>{Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                   <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Password</label><input className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
                </div>
                
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border rounded-lg text-slate-600 hover:bg-slate-50 font-medium">Cancel</button>
                   <button type="submit" className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-100">{editingStaff ? 'Update Member' : 'Add Member'}</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDirectory;
