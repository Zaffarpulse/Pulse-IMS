
import React, { useState } from 'react';
import { InventoryItem, Category } from '../types';
import { Tags, Package, ChevronRight, Plus, Edit2, Trash2, X } from 'lucide-react';

interface CategoriesProps {
  categories: Category[];
  inventory: InventoryItem[];
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ 
  categories, 
  inventory,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Calculate items per category dynamically for display
  const getCategoryCount = (catName: string) => {
    return inventory.filter(i => i.category === catName).length;
  };

  const getCategoryValue = (catName: string) => {
    return inventory
      .filter(i => i.category === catName)
      .reduce((acc, i) => acc + (i.quantity * (i.purchasePrice || 0)), 0);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"? Items in this category will not be deleted but may have an invalid category.`)) {
      onDeleteCategory(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
       onUpdateCategory({
         ...editingCategory,
         name: formData.name,
         description: formData.description
       });
    } else {
       onAddCategory({
         id: `cat-${Math.floor(Math.random() * 10000)}`,
         name: formData.name,
         description: formData.description
       });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
             <h2 className="text-xl font-bold text-slate-900">Category Management</h2>
             <p className="text-slate-500 text-sm">Create, edit, and manage inventory categories.</p>
          </div>
          <button 
             onClick={handleOpenAdd}
             className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
             <Plus className="w-4 h-4 mr-2" />
             Add Category
          </button>
       </div>

       {/* Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
               </div>
               <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg">Save Category</button>
               </div>
            </form>
          </div>
        </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
             <div key={cat.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-colors group relative">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <Tags className="w-6 h-6" />
                   </div>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEdit(cat)} className="p-1 text-slate-400 hover:text-emerald-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                   </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 h-10">{cat.description || 'No description provided.'}</p>
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
                   <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Items</p>
                      <p className="text-xl font-bold text-slate-800">{getCategoryCount(cat.name)}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Value</p>
                      <p className="text-lg font-bold text-slate-800">${getCategoryValue(cat.name).toLocaleString()}</p>
                   </div>
                </div>
             </div>
          ))}
          
          <div 
             onClick={handleOpenAdd}
             className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all cursor-pointer min-h-[220px]"
          >
             <div className="p-3 bg-white rounded-full mb-3 shadow-sm">
                <Plus className="w-6 h-6" />
             </div>
             <span className="font-medium">Create New Category</span>
          </div>
       </div>
    </div>
  );
};

export default Categories;
