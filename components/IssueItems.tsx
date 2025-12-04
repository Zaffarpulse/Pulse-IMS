
import React, { useState, useMemo } from 'react';
import { Issuance, InventoryItem, StaffEntity } from '../types';
import { 
  Plus, Search, User, Calendar, CheckCircle, 
  Clock, AlertCircle, X, FileText, Download, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, Wrench, RotateCcw, Box
} from 'lucide-react';

interface IssueItemsProps {
  issuances: Issuance[];
  inventory: InventoryItem[];
  staff: StaffEntity[];
  onIssueItem: (issuance: Issuance) => void;
}

// --- Helper: Robust PDF Printing via Script Injection ---
const printViaIframe = (content: string) => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.left = '-10000px';
  iframe.style.top = '0';
  iframe.style.width = '1000px';
  iframe.style.height = '1000px';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(content);
    
    const script = doc.createElement('script');
    script.textContent = `
      window.onload = function() {
        setTimeout(function() {
          window.print();
        }, 800);
      };
    `;
    doc.body.appendChild(script);
    doc.close();
  }

  setTimeout(() => {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }, 60000);
};

const IssueItems: React.FC<IssueItemsProps> = ({ issuances, inventory, staff, onIssueItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reqSearchTerm, setReqSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Issuance | 'serial_number'; direction: 'asc' | 'desc' } | null>(null);

  // Form State
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedStaffName, setSelectedStaffName] = useState('');
  const [department, setDepartment] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);

  // --- Sorting Logic ---
  const handleSort = (key: keyof Issuance | 'serial_number') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // --- Filtering & Sorting ---
  const filteredIssuances = useMemo(() => {
    let filtered = issuances.filter(i => {
      const matchesGeneral = 
        i.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.issued_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Mocking Requisition ID check as it's not in the base type yet, checking against ID for now
      const matchesReq = reqSearchTerm ? i.id.toLowerCase().includes(reqSearchTerm.toLowerCase()) : true;

      return matchesGeneral && matchesReq;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        // @ts-ignore - handling dynamic key access
        const valA = a[sortConfig.key] || '';
        // @ts-ignore
        const valB = b[sortConfig.key] || '';

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [issuances, searchTerm, reqSearchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredIssuances.length / rowsPerPage);
  const paginatedIssuances = filteredIssuances.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleOpenModal = () => {
     setSelectedItemId('');
     setSelectedStaffName('');
     setDepartment('');
     setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.id === selectedItemId);
    
    const newIssuance: Issuance = {
      id: `iss-${Math.floor(Math.random() * 10000)}`,
      item_id: selectedItemId,
      item_name: item ? item.name : 'Unknown Item',
      issued_to: selectedStaffName,
      department: department,
      issue_date: issueDate,
      status: 'Active'
    };

    onIssueItem(newIssuance);
    setIsModalOpen(false);
  };

  const handlePrintSlip = (iss: Issuance) => {
     const logoUrl = "https://pulsehospitaljammu.com/webassets/images/logo.png";
     const dateStr = new Date().toLocaleString();
     
     const htmlContent = `
      <!DOCTYPE html><html><head><title>Issuance Slip</title>
      <style>
        @page{size:A4 portrait;margin:10mm;}body{font-family:'Segoe UI',sans-serif;color:#333;}
        .header{text-align:center;border-bottom:2px solid #6366f1;padding-bottom:20px;margin-bottom:30px;}
        .logo{height:60px;margin-bottom:10px;}
        .title{font-size:24px;font-weight:800;color:#1e293b;text-transform:uppercase;}
        .subtitle{font-size:14px;color:#64748b;font-weight:bold;letter-spacing:1px;margin-top:5px;}
        .box{border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:20px;}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
        .label{font-size:11px;color:#64748b;text-transform:uppercase;font-weight:bold;margin-bottom:4px;}
        .value{font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;padding-bottom:4px;}
        .footer{margin-top:50px;display:flex;justify-content:space-between;align-items:flex-end;}
        .sign-area{text-align:center;width:200px;}
        .sign-line{border-top:1px solid #94a3b8;margin-top:40px;}
      </style>
      </head><body>
        <div class="header">
           <img src="${logoUrl}" class="logo" crossorigin="anonymous"/>
           <div class="title">PULSE HOSPITAL</div>
           <div class="subtitle">STORE ISSUANCE SLIP</div>
        </div>
        <div class="box">
           <div style="background:#f8fafc;padding:10px;font-weight:bold;border-bottom:1px solid #e2e8f0;margin:-20px -20px 20px -20px;border-radius:8px 8px 0 0;">TRANSACTION DETAILS</div>
           <div class="grid">
              <div><div class="label">Issuance ID</div><div class="value">${iss.id}</div></div>
              <div><div class="label">Date</div><div class="value">${iss.issue_date}</div></div>
              <div><div class="label">Issued To</div><div class="value">${iss.issued_to}</div></div>
              <div><div class="label">Department</div><div class="value">${iss.department}</div></div>
           </div>
        </div>
        <div class="box">
           <div style="background:#f8fafc;padding:10px;font-weight:bold;border-bottom:1px solid #e2e8f0;margin:-20px -20px 20px -20px;border-radius:8px 8px 0 0;">ITEM DETAILS</div>
           <div class="grid">
              <div style="grid-column:span 2;"><div class="label">Item Name</div><div class="value">${iss.item_name}</div></div>
              <div><div class="label">Inventory ID</div><div class="value">${iss.item_id}</div></div>
              <div><div class="label">Status</div><div class="value">${iss.status}</div></div>
           </div>
        </div>
        <div class="footer">
           <div class="sign-area">
              <div class="sign-line"></div>
              <div style="font-size:10px;font-weight:bold;color:#64748b;">RECEIVER'S SIGNATURE</div>
           </div>
           <div class="sign-area">
              <div class="sign-line"></div>
              <div style="font-size:10px;font-weight:bold;color:#64748b;">AUTHORIZED SIGNATORY</div>
           </div>
        </div>
      </body></html>
     `;
     printViaIframe(htmlContent);
  };

  const handleExport = () => {
    const headers = ['Item Name', 'Issued To', 'Department', 'Issue Date', 'Status'];
    const rows = filteredIssuances.map(i => [i.item_name, i.issued_to, i.department, i.issue_date, i.status].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'issuances.csv';
    link.click();
  };

  const renderSortHeader = (label: string, key: keyof Issuance | 'serial_number') => (
    <th 
      className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-50 transition-colors"
      onClick={() => handleSort(key)}
    >
      <div className="flex items-center">
        {label}
        <span className="ml-2 text-slate-400 group-hover:text-indigo-600">
          {sortConfig?.key === key ? (
             sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
          ) : (
             <div className="flex flex-col opacity-30"><ArrowUp className="w-2 h-2" /><ArrowDown className="w-2 h-2" /></div>
          )}
        </span>
      </div>
    </th>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Item Issuances</h2>
          <p className="text-slate-500 text-sm mt-1">Track items issued to staff members</p>
        </div>
        <div className="flex gap-3">
           <button onClick={handleExport} className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
             <Download className="w-4 h-4 mr-2" /> Export Excel
           </button>
           <button onClick={handleOpenModal} className="flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 text-sm font-bold shadow-md shadow-indigo-200 transition-all transform hover:-translate-y-0.5">
             <Plus className="w-4 h-4 mr-2" /> Issue New Item
           </button>
        </div>
      </div>

      {/* Dual Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1">
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
              placeholder="Search by item name, serial number, staff name, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
         </div>
         <div className="relative flex-1 bg-blue-50/50 rounded-xl">
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-3 border border-blue-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent placeholder-blue-400 text-blue-900"
              placeholder="Search by Requisition Number (e.g., REQ-1234567890)"
              value={reqSearchTerm}
              onChange={(e) => setReqSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                {renderSortHeader('Item Name', 'item_name')}
                {renderSortHeader('Serial #', 'serial_number')}
                {renderSortHeader('Staff', 'issued_to')}
                {renderSortHeader('Department', 'department')}
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
                {renderSortHeader('Issue Date', 'issue_date')}
                {renderSortHeader('Status', 'status')}
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedIssuances.map(iss => {
                 // Find inventory item to get serial number mock
                 const invItem = inventory.find(i => i.name === iss.item_name) || { serialNumber: 'A000498' };
                 return (
                  <tr key={iss.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                         <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mt-0.5"><Box className="w-4 h-4" /></div>
                         <div>
                            <span className="font-bold text-slate-900 text-sm block">{iss.item_name}</span>
                            <span className="text-xs text-slate-400">ID: {iss.id}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{invItem.serialNumber || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                            <User className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{iss.issued_to}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{iss.department.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                        {iss.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">1</td>
                    <td className="px-6 py-4 text-sm text-slate-600 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-2 text-slate-400" />
                      {iss.issue_date}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        iss.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        Issued
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col gap-2 items-end">
                          <button 
                              onClick={() => handlePrintSlip(iss)}
                              className="flex items-center justify-center w-24 px-2 py-1.5 text-xs font-bold text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                          >
                              <FileText className="w-3 h-3 mr-1.5" /> PDF
                          </button>
                          <button className="flex items-center justify-center w-24 px-2 py-1.5 text-xs font-bold text-amber-700 border border-amber-200 bg-amber-50 rounded hover:bg-amber-100 transition-colors">
                              <Wrench className="w-3 h-3 mr-1.5" /> Repair
                          </button>
                          <button className="flex items-center justify-center w-24 px-2 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded hover:bg-emerald-700 transition-colors shadow-sm">
                              <RotateCcw className="w-3 h-3 mr-1.5" /> Return
                          </button>
                      </div>
                    </td>
                  </tr>
                 );
              })}
              {paginatedIssuances.length === 0 && <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">No issuance records found.</td></tr>}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center">
           <p className="text-xs text-slate-500">Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filteredIssuances.length)} - {Math.min(currentPage * rowsPerPage, filteredIssuances.length)} of {filteredIssuances.length} entries</p>
           <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1.5 text-xs border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 flex items-center font-medium text-slate-600"><ChevronLeft className="w-3 h-3 mr-1"/> Previous</button>
              <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1.5 text-xs border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 flex items-center font-medium text-slate-600">Next <ChevronRight className="w-3 h-3 ml-1"/></button>
           </div>
        </div>
      </div>

      {/* Issue Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-extrabold text-slate-900">Issue New Asset</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
               </div>
               <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Select Item</label>
                     <select 
                        required 
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                        value={selectedItemId} 
                        onChange={(e) => setSelectedItemId(e.target.value)}
                     >
                        <option value="">-- Choose from Inventory --</option>
                        {inventory.filter(i => i.quantity > 0).map(item => (
                           <option key={item.id} value={item.id}>{item.name} (Qty: {item.quantity})</option>
                        ))}
                     </select>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Staff Name</label>
                     <input 
                        required type="text" 
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="e.g. Dr. Smith"
                        value={selectedStaffName}
                        onChange={(e) => setSelectedStaffName(e.target.value)}
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Department</label>
                        <input required type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. ICU" value={department} onChange={(e) => setDepartment(e.target.value)} />
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Date</label>
                        <input required type="date" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                     </div>
                  </div>
                  <div className="pt-4">
                     <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                        Confirm Issuance
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default IssueItems;
