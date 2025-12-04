
import React, { useState, useMemo, useCallback } from 'react';
import { InventoryItem, ItemStatus, Department } from '../types';
import { Search, Plus, X, Trash2, Pill, Edit2, Save, Calculator, Calendar } from 'lucide-react';

interface MedicalInventoryProps {
  items: InventoryItem[];
  onAddItem: (item: InventoryItem) => void;
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}

const MedicalInventory: React.FC<MedicalInventoryProps> = ({ items, onAddItem, onUpdateItem, onDeleteItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State matches the screenshot fields
  const [formData, setFormData] = useState({
    medicineName: '',
    rackNo: '',
    expiryDate: '',
    batchNo: '',
    gstPercent: 0,
    stock: 0,
    foc: 0,
    mrp: 0,
    price: 0, // Purchase Price/Rate
    discount: 0,
    inputDiscount: 0,
  });

  // Auto-Calculations based on the screenshot logic
  const totalStock = (Number(formData.stock) || 0) + (Number(formData.foc) || 0);
  const totalInputCost = (Number(formData.price) || 0) * (Number(formData.stock) || 0); // Usually excludes FOC for cost calculation
  const totalGSTAmount = (totalInputCost * (Number(formData.gstPercent) || 0)) / 100;

  const handleOpenAdd = useCallback(() => {
    setEditingId(null);
    setFormData({
      medicineName: '',
      rackNo: '',
      expiryDate: '',
      batchNo: '',
      gstPercent: 0,
      stock: 0,
      foc: 0,
      mrp: 0,
      price: 0,
      discount: 0,
      inputDiscount: 0
    });
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((item: InventoryItem) => {
    setEditingId(item.id);
    setFormData({
      medicineName: item.name,
      rackNo: item.rackNo || '',
      expiryDate: item.expiryDate || '',
      batchNo: item.batchNumber || '',
      gstPercent: item.gstPercent || 0,
      stock: item.quantity - (item.focQuantity || 0), // Reverse calculation approx
      foc: item.focQuantity || 0,
      mrp: item.mrp || 0,
      price: item.purchasePrice || 0,
      discount: item.discount || 0,
      inputDiscount: item.inputDiscount || 0,
    });
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this medicine? This action cannot be undone.')) { 
      onDeleteItem(id); 
    }
  }, [onDeleteItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: InventoryItem = {
      id: editingId || `med-${Math.floor(Math.random() * 100000)}`,
      name: formData.medicineName || 'New Medicine',
      serialNumber: 'N/A', // Not used for meds usually
      category: 'Pharmaceuticals',
      department: Department.MEDICAL,
      quantity: totalStock,
      minStock: 10, // Default
      unit: 'Unit',
      location: formData.rackNo || 'Pharmacy',
      status: totalStock > 10 ? ItemStatus.IN_STOCK : (totalStock > 0 ? ItemStatus.LOW_STOCK : ItemStatus.OUT_OF_STOCK),
      purchasePrice: Number(formData.price),
      lastUpdated: new Date().toISOString().split('T')[0],
      
      // Specific Fields
      rackNo: formData.rackNo,
      batchNumber: formData.batchNo,
      expiryDate: formData.expiryDate,
      gstPercent: Number(formData.gstPercent),
      focQuantity: Number(formData.foc),
      mrp: Number(formData.mrp),
      discount: Number(formData.discount),
      inputDiscount: Number(formData.inputDiscount),
    };

    if (editingId) {
      onUpdateItem(newItem);
    } else {
      onAddItem(newItem);
    }
    setIsModalOpen(false);
  };

  const filteredItems = useMemo(() => items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.batchNumber && item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [items, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pharmacy Inventory</h2>
          <p className="text-slate-500 text-sm mt-1">Manage medicine stocks, batches, and expiry.</p>
        </div>
        <button 
          onClick={handleOpenAdd} 
          className="mt-4 sm:mt-0 flex items-center bg-emerald-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-emerald-700 transition-colors text-sm font-bold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Medicine
        </button>
      </div>

      {/* Modal Form matching the Screenshot Layout */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <Pill className="w-6 h-6 mr-2 text-emerald-600" />
                {editingId ? 'Edit Medicine Details' : 'Add New Medicine'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 bg-white">
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Left Column: Name */}
                <div className="w-full lg:w-1/4 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Medicine Name</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 placeholder-slate-400" 
                      placeholder="Type Name..." 
                      value={formData.medicineName} 
                      onChange={(e) => setFormData({...formData, medicineName: e.target.value})} 
                    />
                    <p className="text-xs text-slate-500 mt-1">Enter generic or brand name</p>
                  </div>
                </div>

                {/* Right Column: Grid Layout */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                  
                  {/* Group 1: Location & ID */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rack No.</label>
                      <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-emerald-500 outline-none" placeholder="e.g. A-01" value={formData.rackNo} onChange={(e) => setFormData({...formData, rackNo: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Batch No.</label>
                      <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-emerald-500 outline-none" placeholder="Batch #001" value={formData.batchNo} onChange={(e) => setFormData({...formData, batchNo: e.target.value})} />
                    </div>
                  </div>

                  {/* Group 2: Time & Tax */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expiry Date</label>
                      <input type="date" required className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-emerald-500 outline-none" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">GST (%)</label>
                      <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-emerald-500 outline-none" placeholder="0" value={formData.gstPercent} onChange={(e) => setFormData({...formData, gstPercent: parseFloat(e.target.value)})} />
                    </div>
                  </div>

                  {/* Group 3: Stock */}
                  <div className="space-y-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase mb-2">Stock Details</h4>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Stock</label>
                      <input type="number" required className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white focus:border-emerald-500 outline-none" placeholder="Qty" value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseFloat(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">FOC (Free)</label>
                      <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white focus:border-emerald-500 outline-none" placeholder="0" value={formData.foc} onChange={(e) => setFormData({...formData, foc: parseFloat(e.target.value)})} />
                    </div>
                    <div className="pt-2 border-t border-slate-200 mt-2">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500">Total Stock</span>
                          <span className="text-sm font-bold text-emerald-600">{totalStock}</span>
                       </div>
                    </div>
                  </div>

                  {/* Group 4: Pricing */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">MRP</label>
                      <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-emerald-500 outline-none" placeholder="0.00" value={formData.mrp} onChange={(e) => setFormData({...formData, mrp: parseFloat(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price (Rate)</label>
                      <input type="number" required className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-emerald-500 outline-none" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} />
                    </div>
                  </div>

                  {/* Group 5: Discounts & Totals */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Discount (%)</label>
                      <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-emerald-500 outline-none" placeholder="0" value={formData.discount} onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Input Disc. (%)</label>
                      <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-emerald-500 outline-none" placeholder="0" value={formData.inputDiscount} onChange={(e) => setFormData({...formData, inputDiscount: parseFloat(e.target.value)})} />
                    </div>
                    
                    {/* Read-only Totals */}
                    <div className="pt-4 space-y-2">
                        <div className="flex justify-between text-xs">
                           <span className="text-slate-500">Total Input</span>
                           <span className="font-mono font-medium">₹{totalInputCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                           <span className="text-slate-500">Total GST</span>
                           <span className="font-mono font-medium">₹{totalGSTAmount.toFixed(2)}</span>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer Actions */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-white hover:text-slate-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="flex items-center bg-emerald-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 transform hover:-translate-y-0.5"
              >
                {editingId ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 relative bg-white flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search medicine by name or batch..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            <div className="text-sm text-slate-500">
               Showing <span className="font-bold text-emerald-600">{filteredItems.length}</span> medicines
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Medicine Name</th>
                <th className="px-6 py-4">Batch No.</th>
                <th className="px-6 py-4">Expiry</th>
                <th className="px-6 py-4">Rack</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-center">FOC</th>
                <th className="px-6 py-4 text-right">MRP</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-3 font-bold text-slate-800">{item.name}</td>
                    <td className="px-6 py-3 font-mono text-xs text-slate-500">{item.batchNumber || '-'}</td>
                    <td className="px-6 py-3 text-xs">
                      {item.expiryDate ? (
                        <span className={`flex items-center ${new Date(item.expiryDate) < new Date() ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                          <Calendar className="w-3 h-3 mr-1.5" /> {item.expiryDate}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-3"><span className="bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">{item.rackNo || item.location}</span></td>
                    <td className="px-6 py-3 text-center font-bold text-emerald-600 text-base">{item.quantity}</td>
                    <td className="px-6 py-3 text-center text-slate-400">{item.focQuantity || 0}</td>
                    <td className="px-6 py-3 text-right font-medium">{item.mrp ? item.mrp.toFixed(2) : '-'}</td>
                    <td className="px-6 py-3 text-right font-medium text-slate-900">₹{item.purchasePrice ? item.purchasePrice.toFixed(2) : '0.00'}</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(item)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400 italic bg-slate-50/30">
                     No medicines found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MedicalInventory);
