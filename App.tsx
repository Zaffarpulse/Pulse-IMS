
import React, { useState } from 'react';
import { User, Role, Department } from './types';
import { dataService } from './services/dataService';
import { Layout } from './components/Layout';
import { AdminPortal } from './portals/AdminPortal';
import { StaffPortal } from './portals/StaffPortal';
import { InchargePortal } from './portals/InchargePortal';
import { HeartPulse, Lock, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState('dashboard');
  
  // Login State
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanStaffId = staffId.trim();
    const cleanPassword = password.trim();
    const user = dataService.authenticate(cleanStaffId, cleanPassword);
    if (user) {
      setCurrentUser(user);
      setError('');
      setActivePage('dashboard'); // Reset to dashboard on login
    } else {
      setError('Invalid Employee ID or Password');
    }
  };

  // Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
           <div className="text-center mb-8">
             <div className="bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                <HeartPulse className="text-teal-600" size={40} />
             </div>
             <h1 className="text-3xl font-bold text-gray-900">Pulse Hospital</h1>
             <p className="text-gray-500 mt-2 font-medium">Inventory Management System</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-6">
             {error && (
               <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
                 {error}
               </div>
             )}
             
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
               <div className="relative">
                 <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 <input 
                   type="text" 
                   required
                   value={staffId}
                   onChange={(e) => setStaffId(e.target.value)}
                   className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2.5 border" 
                   placeholder="e.g., 1, 251, 90"
                 />
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
               <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 <input 
                   type="password" 
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2.5 border" 
                   placeholder="••••••••"
                 />
               </div>
             </div>

             <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
               Sign In
             </button>
           </form>
           
           <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-center text-gray-400 mb-2">Demo Access (Password: 123)</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                 <div className="bg-gray-50 p-1 rounded text-center">Admin (Sohail): 1</div>
                 <div className="bg-gray-50 p-1 rounded text-center">Store (Shahid): 251</div>
                 <div className="bg-gray-50 p-1 rounded text-center">Medical (Jhangir): 353</div>
                 <div className="bg-gray-50 p-1 rounded text-center">HK (Sarfraz): 90</div>
                 <div className="bg-gray-50 p-1 rounded text-center">Allied (Sarfraz): 90A</div>
                 <div className="bg-gray-50 p-1 rounded text-center">Staff (Hilal): 83</div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // Routing Logic
  const renderContent = () => {
    switch (currentUser.role) {
      case Role.ADMIN:
        return <AdminPortal user={currentUser} activeTab={activePage} onNavigate={setActivePage} />;
      case Role.STAFF:
        return <StaffPortal user={currentUser} activeTab={activePage} onNavigate={setActivePage} />;
      case Role.STORE_INCHARGE:
        return <InchargePortal user={currentUser} department={Department.STORE} activeTab={activePage} onNavigate={setActivePage} />;
      case Role.MEDICAL_INCHARGE:
        return <InchargePortal user={currentUser} department={Department.MEDICAL} activeTab={activePage} onNavigate={setActivePage} />;
      case Role.HK_INCHARGE:
        return <InchargePortal user={currentUser} department={Department.HOUSEKEEPING} activeTab={activePage} onNavigate={setActivePage} />;
      case Role.ALLIED_INCHARGE:
        return <InchargePortal user={currentUser} department={Department.ALLIED} activeTab={activePage} onNavigate={setActivePage} />;
      default:
        return <div>Role not recognized</div>;
    }
  };

  return (
    <Layout 
      user={currentUser} 
      onLogout={() => {
        setCurrentUser(null);
        setStaffId('');
        setPassword('');
      }} 
      activePage={activePage}
      onNavigate={setActivePage}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
