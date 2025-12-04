
import React, { useState } from 'react';
import { MOCK_VENDORS } from '../constants';
import { Vendor } from '../types';
import { Building2, Mail, Phone, Search, Plus } from 'lucide-react';

const Vendors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Using Mock Data directly for demo as it's not in App state yet
  const vendors = MOCK_VENDORS; 

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Vendor Management</h2>
          <p className="text-slate-500 text-sm">Manage suppliers and contact details.</p>
        </div>
        <button className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-4 border-b border-slate-100">
           <div className="relative max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
             <input 
               type="text"
               placeholder="Search vendors..."
               className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredVendors.map(vendor => (
              <div key={vendor.id} className="border border-slate-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-slate-50/50">
                 <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                       <Building2 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">{vendor.id}</span>
                 </div>
                 <h3 className="font-bold text-slate-900 text-lg mb-1">{vendor.name}</h3>
                 <p className="text-sm text-slate-500 mb-4">{vendor.contactPerson}</p>
                 
                 <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-600">
                       <Mail className="w-4 h-4 mr-2 text-slate-400" />
                       {vendor.email}
                    </div>
                    <div className="flex items-center text-slate-600">
                       <Phone className="w-4 h-4 mr-2 text-slate-400" />
                       {vendor.phone}
                    </div>
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-slate-200 flex gap-2">
                    <button className="flex-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 py-2 rounded hover:bg-slate-50">View Orders</button>
                    <button className="flex-1 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 py-2 rounded hover:bg-emerald-100">Edit</button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Vendors;
