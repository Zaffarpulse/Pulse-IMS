
import React, { useState } from 'react';
import { User, Role } from '../types';
import { LogOut, LayoutDashboard, ShoppingCart, Activity, User as UserIcon, ClipboardList, Briefcase, Menu, X, Truck, PackagePlus } from 'lucide-react';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activePage, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavItems = () => {
    switch (user.role) {
      case Role.ADMIN:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'requisitions', label: 'Approvals', icon: ClipboardList },
          { id: 'inventory', label: 'Master Inventory', icon: ShoppingCart },
          { id: 'users', label: 'User Mgmt', icon: UserIcon },
          { id: 'reports', label: 'Report Center', icon: Activity },
        ];
      case Role.STAFF:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'shop', label: 'Service Portals', icon: ShoppingCart },
          { id: 'my-requests', label: 'My History', icon: ClipboardList },
        ];
      case Role.STORE_INCHARGE:
          return [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'inventory', label: 'Manage Inventory', icon: ShoppingCart },
            { id: 'suppliers', label: 'Suppliers', icon: Truck },
            { id: 'procurement', label: 'Procurement', icon: PackagePlus },
            { id: 'requests', label: 'Issue Items', icon: ClipboardList },
            { id: 'reports', label: 'Store Reports', icon: Activity },
          ];
      default: // Other Incharges
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'inventory', label: 'Manage Inventory', icon: ShoppingCart },
          { id: 'requests', label: 'Issue / Tasks', icon: ClipboardList },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden print:overflow-visible print:h-auto print:bg-white">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden no-print" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar - Hidden in Print */}
      <aside className={`fixed md:relative z-30 w-64 h-full bg-cyan-950 text-white transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col no-print shadow-2xl`}>
        <div className="p-6 flex flex-col items-center border-b border-cyan-900">
          <div className="mb-3 bg-white/10 p-2 rounded-xl">
            <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-8">
              <path d="M50 75C50 75 10 50 10 25C10 12 20 5 32 5C42 5 50 15 50 15" stroke="#ef4444" strokeWidth="8" strokeLinecap="round"></path>
              <path d="M50 75C50 75 90 50 90 25C90 12 80 5 68 5C58 5 50 15 50 15" stroke="#10b981" strokeWidth="8" strokeLinecap="round"></path>
              <path d="M30 40H42L46 25L54 55L58 40H70" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
          <div className="text-center">
            <span className="font-extrabold text-lg tracking-tight block leading-none">PULSE IMS</span>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-1">MANAGEMENT CONSOLE</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden absolute top-4 right-4 text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800">
          <div className="mb-6 px-2">
            <p className="text-[10px] uppercase text-cyan-400/80 font-bold tracking-wider mb-3">Active Session</p>
            <div className="flex items-center space-x-3 p-3 bg-cyan-900/50 rounded-xl border border-cyan-800/50">
              <img src={user.avatar} alt="User" className="w-9 h-9 rounded-full border-2 border-cyan-700" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-cyan-300 truncate">{user.staffId} • {user.role}</p>
              </div>
            </div>
          </div>

          <p className="text-[10px] uppercase text-cyan-400/80 font-bold tracking-wider px-2 mb-2 mt-6">Modules</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activePage === item.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                  : 'text-cyan-100 hover:bg-cyan-900 hover:text-white'
              }`}
            >
              <item.icon size={18} className={activePage === item.id ? 'text-white' : 'text-cyan-400'} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-cyan-900 bg-cyan-950">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-300 hover:bg-red-900/20 hover:text-red-200 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative print:overflow-visible print:h-auto">
        {/* Mobile Menu Trigger (Floating) */}
        <div className="md:hidden absolute top-4 left-4 z-50">
           <button onClick={() => setIsMobileMenuOpen(true)} className="bg-white p-2 rounded-full shadow-md text-gray-600 border border-gray-200">
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 print:p-0 print:overflow-visible bg-slate-50/50">
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-3 px-6 text-center text-[10px] text-gray-400 no-print uppercase tracking-wider">
          &copy; {new Date().getFullYear()} Pulse Hospital & Research Centre | Confidential System
        </footer>
      </main>
    </div>
  );
};
