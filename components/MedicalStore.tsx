
import React, { useState } from 'react';
import { InventoryItem, PurchaseOrder, Requisition, UserRole, ItemStatus, Category } from '../types';
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingCart, 
  ClipboardList, 
  Activity, 
  AlertTriangle, 
  Calendar,
  Building2,
  Tags,
  ArrowLeft,
  Menu
} from 'lucide-react';
import Dashboard from './Dashboard';
import MedicalInventory from './MedicalInventory';
import Procurement from './Procurement';
import Requisitions from './Requisitions';
import Vendors from './Vendors';
import Categories from './Categories';

interface MedicalStoreProps {
  inventory: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
  requisitions: Requisition[];
  categories: Category[];
  onAddItem: (item: InventoryItem) => void;
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onCreateOrder: (po: PurchaseOrder) => void;
  onAddRequisition: (req: Requisition) => void;
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  activeRole: UserRole;
  onBack: () => void;
}

const MedicalStore: React.FC<MedicalStoreProps> = ({
  inventory,
  purchaseOrders,
  requisitions,
  categories,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onCreateOrder,
  onAddRequisition,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  activeRole,
  onBack
}) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Filter Data for Medical/Pharmacy Context
  const medicalInventory = inventory.filter(item => 
    ['Pharmaceuticals', 'Consumables', 'Medicine', 'Surgical', 'Medical Equipment'].includes(item.category)
  );

  const medicalPOs = purchaseOrders.filter(po => {
     const firstItem = po.items[0];
     const invItem = inventory.find(i => i.name === firstItem.item_name);
     return invItem ? ['Pharmaceuticals', 'Consumables', 'Medicine', 'Surgical', 'Medical Equipment'].includes(invItem.category) : true;
  });

  const medicalRequisitions = requisitions; 

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Pharmacy Inventory', icon: Pill },
    { id: 'procurement', label: 'Procurement', icon: ShoppingCart },
    { id: 'requisitions', label: 'Indent / Requests', icon: ClipboardList },
    { id: 'vendors', label: 'Vendors', icon: Building2 },
    { id: 'categories', label: 'Categories', icon: Tags },
  ];

  const MedicalDashboard = () => {
    const pharmaItems = medicalInventory.filter(i => i.category === 'Pharmaceuticals');
    const lowStock = medicalInventory.filter(i => i.status === ItemStatus.LOW_STOCK || i.status === ItemStatus.OUT_OF_STOCK);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-blue-100/50 flex items-center transform hover:scale-[1.02] transition-transform">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-5 shadow-lg shadow-blue-200">
              <Pill className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Total Medicines</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{pharmaItems.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-red-100/50 flex items-center transform hover:scale-[1.02] transition-transform">
            <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mr-5 shadow-lg shadow-red-200">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Critical Stock</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{lowStock.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-amber-100/50 flex items-center transform hover:scale-[1.02] transition-transform">
            <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl mr-5 shadow-lg shadow-amber-200">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Expiring Soon</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">0</p>
              <p className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">Batch Tracking Active</p>
            </div>
          </div>
        </div>
        <Dashboard inventory={medicalInventory} purchaseOrders={medicalPOs} />
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <MedicalDashboard />;
      case 'inventory': return <MedicalInventory items={medicalInventory} onAddItem={onAddItem} onUpdateItem={onUpdateItem} onDeleteItem={activeRole === UserRole.ADMIN ? onDeleteItem : (id) => console.log("Deletion restricted")} />;
      case 'procurement': return <Procurement orders={medicalPOs} inventory={medicalInventory} onCreateOrder={onCreateOrder} />;
      case 'requisitions': return <Requisitions requisitions={medicalRequisitions} inventory={medicalInventory} isAdmin={activeRole === UserRole.ADMIN || activeRole === UserRole.MEDICAL_INCHARGE} onAddRequisition={onAddRequisition} />;
      case 'vendors': return <Vendors />;
      case 'categories': return <Categories categories={categories} inventory={medicalInventory} onAddCategory={onAddCategory} onUpdateCategory={onUpdateCategory} onDeleteCategory={onDeleteCategory} />;
      default: return <MedicalDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {isSidebarOpen && (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />)}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-cyan-950 text-slate-300 transform transition-transform duration-300 ease-in-out border-r border-cyan-900
        lg:translate-x-0 lg:static lg:inset-0 flex flex-col shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
         <div className="h-40 flex flex-col items-center justify-center px-6 bg-cyan-950 border-b border-cyan-900">
            <div className="p-2 bg-white/10 rounded-xl mb-3">
               <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-8">
                  <path d="M50 75C50 75 10 50 10 25C10 12 20 5 32 5C42 5 50 15 50 15" stroke="#ef4444" strokeWidth="8" strokeLinecap="round"></path>
                  <path d="M50 75C50 75 90 50 90 25C90 12 80 5 68 5C58 5 50 15 50 15" stroke="#10b981" strokeWidth="8" strokeLinecap="round"></path>
                  <path d="M30 40H42L46 25L54 55L58 40H70" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
               </svg>
            </div>
            <div className="text-center">
               <span className="block text-xl font-extrabold text-white tracking-wide">PULSE IMS</span>
               <span className="block text-[10px] text-cyan-400 uppercase tracking-widest mt-1 font-bold">Medical Console</span>
            </div>
         </div>

         <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-thin scrollbar-thumb-cyan-800">
            {menuItems.map(item => (
               <button key={item.id} onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${currentView === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-cyan-100 hover:text-white hover:bg-cyan-900'}`}>
                  <item.icon className={`w-5 h-5 mr-3 ${currentView === item.id ? 'text-white' : 'text-cyan-400'}`} />
                  {item.label}
               </button>
            ))}
         </nav>

         <div className="p-4 bg-cyan-950 border-t border-cyan-900">
            <button onClick={onBack} className="flex items-center w-full px-4 py-3 text-cyan-200 hover:text-white hover:bg-indigo-600/20 border border-transparent hover:border-indigo-500/30 rounded-xl transition-all text-sm font-medium">
               <ArrowLeft className="w-5 h-5 mr-3" />
               Back to Main Menu
            </button>
         </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
         <header className="lg:hidden bg-white border-b border-slate-200 h-16 flex items-center px-4">
            <button onClick={() => setSidebarOpen(true)} className="text-slate-600"><Menu className="w-6 h-6" /></button>
            <span className="ml-4 font-bold text-slate-800">Medical MIS</span>
         </header>

         <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-100/50">
            <div className="max-w-7xl mx-auto space-y-6">
               {renderContent()}
            </div>
         </main>
      </div>
    </div>
  );
};

export default MedicalStore;
