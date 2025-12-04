
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { InventoryItem, ItemStatus, Category, Department } from '../types';
import { dataService } from '../services/dataService';
import { 
  Search, Plus, X, Eye, Edit2, Trash2, Upload, 
  ArrowUp, ArrowDown, Briefcase, Info, Image as ImageIcon, 
  Package, FileText, Printer, CheckCircle, AlertTriangle, Download,
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface InventoryListProps {
  items: InventoryItem[];
  categories?: Category[];
  onAddItem: (item: InventoryItem) => void;
  onUpdateItem?: (item: InventoryItem) => void; 
  onDeleteItem?: (id: string) => void;
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

// --- Sub-Component: Optimized Table Row ---
const InventoryRow = React.memo(({ item, onView, onEdit, onDelete }: { 
  item: InventoryItem, 
  onView: (i: InventoryItem) => void, 
  onEdit?: (i: InventoryItem) => void, 
  onDelete?: (id: string) => void 
}) => {
  return (
    <tr className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors group">
      <td className="px-6 py-4 font-bold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors">{item.name}</td>
      <td className="px-6 py-4 text-slate-600 text-sm font-mono">
        <span className="bg-slate-50 px-2 py-1 rounded text-xs border border-slate-200">{item.serialNumber || '-'}</span>
      </td>
      <td className="px-6 py-4 text-slate-500 text-xs">{item.modelNumber || '-'}</td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          {item.category}
        </span>
      </td>
      <td className={`px-6 py-4 font-bold text-sm ${item.quantity === 0 ? 'text-red-600' : 'text-slate-700'}`}>
        {item.quantity}
      </td>
      <td className="px-6 py-4">
          {item.status === ItemStatus.IN_STOCK ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle className="w-3 h-3" /> Available
            </span>
          ) : item.status === ItemStatus.OUT_OF_STOCK ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white border border-red-200 text-red-600">
              <AlertTriangle className="w-3 h-3" /> Out of Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              <AlertTriangle className="w-3 h-3" /> Low Stock
            </span>
          )}
      </td>
      <td className="px-6 py-4 text-xs">
        {(item.amcCmc && item.amcCmc !== 'None') ? (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-[10px] font-bold uppercase border border-purple-200">
            {item.amcCmc}
          </span>
        ) : (
          <span className="text-slate-300">-</span>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onView(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Details">
            <Eye className="w-4 h-4" />
          </button>
          {onEdit && (
            <button onClick={() => onEdit(item)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Edit">
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
});

// --- Main Component ---
const InventoryList: React.FC<InventoryListProps> = ({ items, categories, onAddItem, onUpdateItem, onDeleteItem }) => {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  
  // Sorting & Pagination
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState<InventoryItem | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form State
  const [activeTab, setActiveTab] = useState<'basic' | 'vendor' | 'amc' | 'notes'>('basic');
  const [formData, setFormData] = useState<Partial<InventoryItem>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [vendorSearch, setVendorSearch] = useState('');

  // Get vendors from service
  const vendors = dataService.getVendors();

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSort = (key: keyof InventoryItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (item.serialNumber && item.serialNumber.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
        (item.modelNumber && item.modelNumber.toLowerCase().includes(debouncedSearch.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
      
      let matchesStatus = true;
      if (selectedStatus === 'Available') matchesStatus = item.status === ItemStatus.IN_STOCK;
      if (selectedStatus === 'Low Stock') matchesStatus = item.status === ItemStatus.LOW_STOCK;
      if (selectedStatus === 'Out of Stock') matchesStatus = item.status === ItemStatus.OUT_OF_STOCK;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key] ?? '';
        const valB = b[sortConfig.key] ?? '';
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [items, debouncedSearch, selectedCategory, selectedStatus, sortConfig]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reset pagination when filters change
  }, [debouncedSearch, selectedCategory, selectedStatus, rowsPerPage]);

  // --- Handlers ---

  const handleOpenAdd = useCallback(() => {
    setEditingItem(null);
    setFormData({
      quantity: 0,
      minStock: 5,
      purchasePrice: 0,
      status: ItemStatus.IN_STOCK,
      category: categories && categories.length > 0 ? categories[0].name : 'Other',
      amcCmc: 'None'
    });
    setImagePreviews([]);
    setVendorSearch('');
    setActiveTab('basic');
    setIsAddModalOpen(true);
  }, [categories]);

  const handleEdit = useCallback((item: InventoryItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setImagePreviews(item.images || []);
    setVendorSearch('');
    setActiveTab('basic');
    setIsAddModalOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (onDeleteItem && confirm('Are you sure you want to delete this item? This cannot be undone.')) {
      onDeleteItem(id);
    }
  }, [onDeleteItem]);

  const handleView = useCallback((item: InventoryItem) => {
    setViewItem(item);
    setIsViewModalOpen(true);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
      if (validFiles.length !== files.length) {
         alert("Some files were ignored because they exceed 5MB.");
      }

      setImageFiles(prev => [...prev, ...validFiles]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate status based on quantity
    const qty = Number(formData.quantity) || 0;
    const min = Number(formData.minStock) || 0;
    let status = ItemStatus.IN_STOCK;
    if (qty <= 0) status = ItemStatus.OUT_OF_STOCK;
    else if (qty <= min) status = ItemStatus.LOW_STOCK;

    const finalItem: InventoryItem = {
      // Default department if not present (will be overridden by manager)
      department: formData.department || Department.STORE,
      unit: formData.unit || 'Pcs',
      id: editingItem ? editingItem.id : `inv-${Math.floor(Math.random() * 100000)}`,
      name: formData.name || 'New Item',
      serialNumber: formData.serialNumber || '000',
      modelNumber: formData.modelNumber || '',
      category: formData.category || 'Other',
      quantity: qty,
      minStock: min,
      location: formData.location || '',
      vendorId: formData.vendorId || '',
      status: status,
      purchasePrice: Number(formData.purchasePrice) || 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      amcCmc: formData.amcCmc,
      contractStartDate: formData.contractStartDate,
      contractEndDate: formData.contractEndDate,
      images: imagePreviews
    };

    if (editingItem && onUpdateItem) {
      onUpdateItem(finalItem);
    } else {
      onAddItem(finalItem);
    }
    setIsAddModalOpen(false);
  };

  const handlePrintAll = () => {
    const signature = localStorage.getItem('admin_signature') || '';
    const logoUrl = "https://pulsehospitaljammu.com/webassets/images/logo.png";
    const rows = filteredItems.map(item => `
      <tr style="border-bottom:1px solid #eee;">
        <td style="padding:8px;">${item.name}</td>
        <td style="padding:8px;">${item.serialNumber || ''}</td>
        <td style="padding:8px;">${item.category}</td>
        <td style="padding:8px; text-align: center;">${item.quantity}</td>
        <td style="padding:8px;">${item.status}</td>
        <td style="padding:8px;">${item.location || '-'}</td>
        <td style="padding:8px;">${item.lastUpdated || '-'}</td>
        <td style="padding:8px;">₹${(item.purchasePrice || 0).toFixed(2)}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Inventory Report</title>
        <style>@page{size:A4 landscape;margin:10mm;}body{font-family:sans-serif;color:#333;}table{width:100%;border-collapse:collapse;font-size:10px;}th{background:#f8f9fa;text-align:left;padding:8px;border-bottom:2px solid #ddd;}.header{display:flex;justify-content:space-between;margin-bottom:20px;background:#6366f1;color:white;padding:20px;border-radius:4px;}</style>
      </head>
      <body>
        <div class="header">
          <div><h1 style="margin:0;font-size:22px;">PULSE HOSPITAL</h1><p style="margin:0;font-size:12px;">Inventory Level Report</p></div>
          <img src="${logoUrl}" style="height:40px;background:white;padding:5px;border-radius:4px;" crossorigin="anonymous"/>
        </div>
        <div style="margin-bottom:15px;font-size:12px;color:#666;"><strong>Filters:</strong> Category: ${selectedCategory} | Status: ${selectedStatus} | Count: ${filteredItems.length}</div>
        <table><thead><tr><th>Item Name</th><th>Serial</th><th>Category</th><th>Qty</th><th>Status</th><th>Location</th><th>Date</th><th>Price</th></tr></thead><tbody>${rows}</tbody></table>
        <div style="margin-top:40px;text-align:center;">${signature ? `<img src="${signature}" style="height:50px;display:block;margin:0 auto;" />` : ''}<div style="border-top:1px solid #ccc;width:200px;margin:5px auto;"></div><strong>ADMINISTRATOR</strong></div>
      </body>
      </html>
    `;
    printViaIframe(htmlContent);
  };

  const handleGenerateItemReport = () => {
    if (!viewItem) return;
    const dateStr = new Date().toLocaleString();
    const vendor = vendors.find(v => v.id === viewItem.vendorId);
    const logoUrl = "https://pulsehospitaljammu.com/webassets/images/logo.png";

    const imagesHtml = (viewItem.images && viewItem.images.length > 0) 
      ? viewItem.images.map(img => `<img src="${img}" style="width:45%; height:auto; border:1px solid #eee; border-radius:4px; object-fit:cover;" />`).join('') 
      : '<div style="padding: 20px; text-align: center; color: #999; border: 1px dashed #ccc;">No images available</div>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${viewItem.name} - Report</title>
        <style>
          @page { size: A4 portrait; margin: 10mm; }
          body { font-family: 'Segoe UI', sans-serif; color: #333; }
          .header { background: #6366f1; color: white; padding: 25px; display: flex; justify-content: space-between; align-items: center; -webkit-print-color-adjust: exact; border-radius: 4px; }
          .logo-bg { background: white; padding: 8px; border-radius: 4px; }
          .logo-bg img { height: 45px; }
          .section-title { background: #115e59; color: white; padding: 8px 15px; font-weight: bold; font-size: 14px; margin-top: 25px; border-radius: 4px; -webkit-print-color-adjust: exact; }
          .section-title.red { background: #991b1b; }
          .section-title.gray { background: #1f2937; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 10px; }
          .label { font-size: 11px; color: #666; font-weight: bold; text-transform: uppercase; }
          .val { font-size: 14px; font-weight: 500; border-bottom: 1px solid #eee; padding-bottom: 3px; }
          .footer { text-align: center; margin-top: 50px; font-size: 10px; color: #888; border-top: 1px solid #eee; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div><h1 style="margin:0; font-size:24px;">PULSE HOSPITAL</h1><p style="margin:0; font-size:12px;">INVENTORY ITEM REPORT</p></div>
          <div class="logo-bg"><img src="${logoUrl}" alt="Logo" crossorigin="anonymous" /></div>
        </div>

        <div class="section-title">Basic Information</div>
        <div class="grid">
          <div><div class="label">Item Name</div><div class="val">${viewItem.name}</div></div>
          <div><div class="label">Serial Number</div><div class="val">${viewItem.serialNumber || 'N/A'}</div></div>
          <div><div class="label">Model Number</div><div class="val">${viewItem.modelNumber || 'N/A'}</div></div>
          <div><div class="label">Category</div><div class="val">${viewItem.category}</div></div>
          <div><div class="label">Current Quantity</div><div class="val">${viewItem.quantity}</div></div>
          <div><div class="label">Minimum Stock Level</div><div class="val">${viewItem.minStock}</div></div>
          <div><div class="label">Location</div><div class="val">${viewItem.location || 'N/A'}</div></div>
          <div><div class="label">Current Status</div><div class="val">${viewItem.status}</div></div>
        </div>

        <div class="section-title">Item Photographs</div>
        <div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;">${imagesHtml}</div>

        <div class="section-title red">Purchase Details</div>
        <div class="grid">
          <div><div class="label">Purchase Date</div><div class="val">${viewItem.lastUpdated || 'N/A'}</div></div>
          <div><div class="label">Purchase Price</div><div class="val">₹${(viewItem.purchasePrice || 0).toFixed(2)}</div></div>
        </div>

        <div class="section-title gray">Vendor Information</div>
        <div class="grid">
          <div><div class="label">Vendor Name</div><div class="val">${vendor?.name || 'N/A'}</div></div>
          <div><div class="label">Contact Number</div><div class="val">${vendor?.mobile || 'N/A'}</div></div>
          <div style="grid-column: span 2;"><div class="label">GST Number</div><div class="val">${vendor?.gstNumber || 'N/A'}</div></div>
        </div>

        <div class="footer">
           <div style="font-weight:bold; margin-bottom:5px;">PULSE HOSPITAL AND RESEARCH CENTRE</div>
           Inventory Management System | Generated: ${dateStr}
        </div>
      </body>
      </html>
    `;
    printViaIframe(htmlContent);
  };

  const handleExport = () => {
    const headers = ['Item Name', 'Serial #', 'Category', 'Quantity', 'Status', 'Location', 'Price'];
    const rows = filteredItems.map(i => [i.name, i.serialNumber, i.category, i.quantity, i.status, i.location, i.purchasePrice].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory.csv';
    link.click();
  };

  const renderSortableHeader = (label: string, key: keyof InventoryItem) => (
    <th 
      onClick={() => handleSort(key)} 
      className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-center">
        {label}
        <span className="ml-2 text-slate-400 group-hover:text-blue-600">
          {sortConfig?.key === key ? (
            sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
          ) : (
            <div className="flex flex-col opacity-50"><ArrowUp className="w-2 h-2" /><ArrowDown className="w-2 h-2" /></div>
          )}
        </span>
      </div>
    </th>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage all your inventory items</p>
        </div>
        <div className="flex gap-3">
           <button onClick={handleExport} className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all">
             <Download className="w-4 h-4 mr-2" /> Export Excel
           </button>
           <button onClick={handleOpenAdd} className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-bold shadow-md shadow-blue-200 transition-all transform hover:-translate-y-0.5">
             <Plus className="w-4 h-4 mr-2" /> Add New Item
           </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
         <div className="relative flex-1 w-full">
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Search by name, serial, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
         </div>
         <select 
           className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-48 bg-white cursor-pointer"
           value={selectedCategory}
           onChange={(e) => setSelectedCategory(e.target.value)}
         >
            <option value="All Categories">All Categories</option>
            {categories?.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
         </select>
         <select 
           className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-40 bg-white cursor-pointer"
           value={selectedStatus}
           onChange={(e) => setSelectedStatus(e.target.value)}
         >
            <option value="All Status">All Status</option>
            <option value="Available">Available</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
         </select>
         <button 
           onClick={handlePrintAll} 
           className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 text-sm font-semibold flex items-center transition-colors"
         >
             <Printer className="w-4 h-4 mr-2" /> Print All
         </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                {renderSortableHeader('Item Name', 'name')}
                {renderSortableHeader('Serial #', 'serialNumber')}
                {renderSortableHeader('Model #', 'modelNumber')}
                {renderSortableHeader('Category', 'category')}
                {renderSortableHeader('Quantity', 'quantity')}
                {renderSortableHeader('Status', 'status')}
                {renderSortableHeader('AMC/CMC', 'amcCmc')}
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedItems.map(item => (
                <InventoryRow 
                  key={item.id} 
                  item={item} 
                  onView={handleView} 
                  onEdit={onUpdateItem ? handleEdit : undefined} 
                  onDelete={onDeleteItem ? handleDelete : undefined} 
                />
              ))}
              {paginatedItems.length === 0 && (
                 <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">No inventory items found matching your criteria.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Rows per page:</span>
              <select 
                 className="border border-slate-300 rounded-lg text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={rowsPerPage}
                 onChange={(e) => setRowsPerPage(Number(e.target.value))}
              >
                 <option value={10}>10</option>
                 <option value={25}>25</option>
                 <option value={50}>50</option>
                 <option value={100}>100</option>
              </select>
              <span className="text-sm text-slate-500 ml-2">
                 Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filteredItems.length)} - {Math.min(currentPage * rowsPerPage, filteredItems.length)} of {filteredItems.length}
              </span>
           </div>
           <div className="flex gap-2">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
                className="px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                 <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </button>
              <button 
                disabled={currentPage === totalPages || totalPages === 0} 
                onClick={() => setCurrentPage(p => p + 1)} 
                className="px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                 Next <ChevronRight className="w-4 h-4 ml-1" />
              </button>
           </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h3 className="text-xl font-extrabold text-slate-900">{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            
            {/* Tabs */}
            <div className="bg-slate-50 px-6 pt-2 flex gap-2 border-b border-slate-200">
               {['basic', 'vendor', 'amc', 'notes'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setActiveTab(t as any)} 
                    className={`px-6 py-3 text-sm font-bold rounded-t-lg transition-all ${activeTab === t ? 'bg-white text-blue-600 shadow-sm border-t-2 border-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                  >
                    {t === 'basic' ? 'Basic Info' : t === 'vendor' ? 'Vendor' : t === 'amc' ? 'AMC/CMC' : 'Notes'}
                  </button>
               ))}
            </div>

            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 bg-white">
               {activeTab === 'basic' && (
                  <div className="space-y-8">
                     <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-blue-400 cursor-pointer relative transition-colors group">
                        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                        <div className="flex flex-col items-center">
                           <div className="p-4 bg-blue-50 rounded-full text-blue-500 mb-3 group-hover:scale-110 transition-transform"><Upload className="w-8 h-8" /></div>
                           <p className="text-sm font-bold text-slate-700">Click to upload item images</p>
                           <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 5MB</p>
                        </div>
                        {imagePreviews.length > 0 && <div className="flex justify-center gap-3 mt-4 flex-wrap">{imagePreviews.map((src, i) => <img key={i} src={src} className="h-16 w-16 rounded-lg border border-slate-200 object-cover shadow-sm" />)}</div>}
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Item Name <span className="text-red-500">*</span></label><input className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Surgical Mask" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Category <span className="text-red-500">*</span></label><select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>{categories?.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Serial Number <span className="text-red-500">*</span></label><input className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="SN-XXXX" value={formData.serialNumber || ''} onChange={e => setFormData({...formData, serialNumber: e.target.value})} required /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Model Number</label><input className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Model-XYZ" value={formData.modelNumber || ''} onChange={e => setFormData({...formData, modelNumber: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Quantity <span className="text-red-500">*</span></label><input type="number" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} required /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Low Stock Alert <span className="text-red-500">*</span></label><input type="number" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.minStock} onChange={e => setFormData({...formData, minStock: parseInt(e.target.value)})} required /></div>
                        <div className="md:col-span-2 space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Location</label><input className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Shelf A-2" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Purchase Date</label><input type="date" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.lastUpdated} onChange={e => setFormData({...formData, lastUpdated: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Purchase Price</label><input type="number" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: parseFloat(e.target.value)})} /></div>
                     </div>
                  </div>
               )}

               {activeTab === 'vendor' && (
                  <div className="space-y-6">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Search Vendor</label>
                        <div className="relative">
                           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                           <input className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Type vendor name..." value={vendorSearch} onChange={e => setVendorSearch(e.target.value)} />
                        </div>
                     </div>

                     {formData.vendorId && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 animate-in fade-in slide-in-from-top-2">
                           <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Selected Vendor</h4>
                           <div className="space-y-1">
                              <p className="text-base font-bold text-slate-900">{vendors.find(v => v.id === formData.vendorId)?.name}</p>
                              <p className="text-sm text-slate-600">Contact: <span className="font-medium">{vendors.find(v => v.id === formData.vendorId)?.mobile}</span></p>
                              <p className="text-sm text-slate-600">GST: <span className="font-mono font-medium bg-white px-2 py-0.5 rounded border border-blue-100">{vendors.find(v => v.id === formData.vendorId)?.gstNumber}</span></p>
                           </div>
                        </div>
                     )}

                     <div className="max-h-60 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50/50 divide-y divide-slate-100">
                        {vendors.filter(v => v.name.toLowerCase().includes(vendorSearch.toLowerCase())).map(v => (
                           <div 
                              key={v.id} 
                              onClick={() => setFormData({...formData, vendorId: v.id})} 
                              className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors flex justify-between items-center ${formData.vendorId === v.id ? 'bg-blue-50' : ''}`}
                           >
                              <div>
                                 <p className="font-bold text-sm text-slate-800">{v.name}</p>
                                 <p className="text-xs text-slate-500">{v.contactPerson}</p>
                              </div>
                              {formData.vendorId === v.id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'amc' && (
                  <div className="space-y-6">
                     <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Contract Type</label><select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={formData.amcCmc} onChange={e => setFormData({...formData, amcCmc: e.target.value})}><option value="None">None</option><option value="AMC">AMC (Annual Maintenance)</option><option value="CMC">CMC (Comprehensive Maintenance)</option></select></div>
                     {formData.amcCmc !== 'None' && (
                        <div className="grid grid-cols-2 gap-6 animate-in fade-in">
                           <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Start Date</label><input type="date" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.contractStartDate} onChange={e => setFormData({...formData, contractStartDate: e.target.value})} /></div>
                           <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">End Date</label><input type="date" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.contractEndDate} onChange={e => setFormData({...formData, contractEndDate: e.target.value})} /></div>
                        </div>
                     )}
                  </div>
               )}

               {activeTab === 'notes' && (
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Additional Notes</label>
                     <textarea className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={6} placeholder="Enter any additional details, remarks, or receiving notes here..." />
                  </div>
               )}
            </form>
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
               <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all">Cancel</button>
               <button onClick={handleSubmit} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-md shadow-blue-200 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all">{editingItem ? 'Update Item' : 'Add Item'}</button>
            </div>
          </div>
        </div>
      )}
      
      {isViewModalOpen && viewItem && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 animate-in zoom-in-95 duration-200">
               <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2"><Package className="w-6 h-6 text-blue-600"/> {viewItem.name}</h3>
                  <div className="flex gap-3">
                     <button onClick={handleGenerateItemReport} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center shadow-sm transition-all"><FileText className="w-4 h-4 mr-2 text-indigo-600"/> Generate Report</button>
                     <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
                  </div>
               </div>
               
               <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Item Gallery</h4>
                   {viewItem.images && viewItem.images.length > 0 ? (
                      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                         {viewItem.images.map((src, i) => <img key={i} src={src} className="h-48 rounded-lg border border-slate-200 object-cover shadow-sm" />)}
                      </div>
                   ) : (
                      <div className="h-32 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg"><ImageIcon className="w-8 h-8 mr-2 opacity-50"/> No images available</div>
                   )}
               </div>

               <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                  <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center"><Info className="w-4 h-4 mr-1.5"/> Basic Details</h4>
                     <div className="space-y-3">
                        <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-sm text-slate-500">Serial Number</span><span className="text-sm font-mono font-medium text-slate-900">{viewItem.serialNumber}</span></div>
                        <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-sm text-slate-500">Category</span><span className="text-sm font-medium text-blue-600">{viewItem.category}</span></div>
                        <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-sm text-slate-500">Quantity</span><span className="text-sm font-bold text-slate-900">{viewItem.quantity}</span></div>
                        <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-sm text-slate-500">Status</span><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${viewItem.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{viewItem.status}</span></div>
                        <div className="flex justify-between pt-1"><span className="text-sm text-slate-500">Location</span><span className="text-sm font-medium text-slate-900 flex items-center"><Briefcase className="w-3 h-3 mr-1 text-slate-400"/> {viewItem.location || 'Unassigned'}</span></div>
                     </div>
                  </div>

                  <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center"><Upload className="w-4 h-4 mr-1.5"/> Purchase & Vendor</h4>
                     <div className="space-y-3">
                        <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-sm text-slate-500">Purchase Date</span><span className="text-sm font-medium text-slate-900">{viewItem.lastUpdated}</span></div>
                        <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-sm text-slate-500">Unit Price</span><span className="text-sm font-bold text-emerald-600">₹{(viewItem.purchasePrice || 0).toFixed(2)}</span></div>
                        <div className="pt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                           <p className="text-xs font-bold text-slate-500 uppercase mb-1">Vendor</p>
                           {(() => {
                              const v = vendors.find(ven => ven.id === viewItem.vendorId);
                              return v ? (
                                 <>
                                    <p className="text-sm font-bold text-slate-900">{v.name}</p>
                                    <p className="text-xs text-slate-500">{v.mobile}</p>
                                 </>
                              ) : <p className="text-sm text-slate-400 italic">Not linked</p>;
                           })()}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export const InventoryManager: React.FC<{ department?: Department }> = ({ department }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  // Use dataService to get categories if available, otherwise mock for now or static
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Stationery' },
    { id: '2', name: 'Medicine' },
    { id: '3', name: 'Consumables' },
    { id: '4', name: 'Assets' },
    { id: '5', name: 'Machinery' },
    { id: '6', name: 'Linen' },
    { id: '7', name: 'Chemicals' },
    { id: '8', name: 'Gas' },
    { id: '9', name: 'HVAC' },
    { id: '10', name: 'Other' }
  ]);

  useEffect(() => {
    // Initial fetch
    setItems(dataService.getInventory(department));
  }, [department]);

  // Wrapper handlers that interact with dataService
  const handleAdd = (item: InventoryItem) => {
    // Ensure item has the correct department context
    const newItem = { 
        ...item, 
        department: department || item.department || Department.STORE,
        // If status wasn't set correctly (though form does it), ensure it here
        status: item.status || (item.quantity <= 0 ? ItemStatus.OUT_OF_STOCK : (item.quantity <= item.minStock ? ItemStatus.LOW_STOCK : ItemStatus.IN_STOCK))
    };
    dataService.addInventoryItem(newItem);
    setItems(dataService.getInventory(department));
  };

  const handleUpdate = (item: InventoryItem) => {
    dataService.updateInventoryItem(item);
    setItems(dataService.getInventory(department));
  };

  const handleDelete = (id: string) => {
    dataService.deleteInventoryItem(id);
    setItems(dataService.getInventory(department));
  };

  return (
    <InventoryList 
      items={items} 
      categories={categories} 
      onAddItem={handleAdd} 
      onUpdateItem={handleUpdate} 
      onDeleteItem={handleDelete} 
    />
  );
};

export default InventoryManager;
