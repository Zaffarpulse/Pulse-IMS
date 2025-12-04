
import React, { useState } from 'react';
import { StaffEntity, UserRole } from '../types';
import { Loader2, ArrowRight, Lock, User, AlertCircle, Briefcase } from 'lucide-react';

interface LoginProps {
  users: StaffEntity[];
  isLoading: boolean;
  onLogin: (user: StaffEntity) => void;
}

const Login: React.FC<LoginProps> = ({ users, isLoading, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const roles = [
    UserRole.ADMIN,
    UserRole.STORE_INCHARGE,
    UserRole.MEDICAL_INCHARGE,
    UserRole.HOUSEKEEPING_INCHARGE,
    UserRole.ALLIED_INCHARGE,
    UserRole.STAFF
  ];

  const normalizeId = (id: string | undefined) => {
    if (!id) return '';
    let normalized = id.trim().toUpperCase().replace(/^SC[\/\-]?PHRC[\/\-]?/, '');
    return normalized;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select a role.');
      return;
    }
    if (!employeeId || !password) {
      setError('Please enter both Employee ID and Password.');
      return;
    }

    const inputIdNormalized = normalizeId(employeeId);
    
    const user = users.find(u => {
      const storedId = u.employee_id ? u.employee_id.trim().toUpperCase() : '';
      const storedIdNormalized = normalizeId(storedId);
      return storedId === employeeId.trim().toUpperCase() || storedIdNormalized === inputIdNormalized;
    });

    if (user) {
      // Check if active
      if (!user.is_active) {
        setError('Account is inactive. Please contact Administration.');
        return;
      }

      const storedPw = user.password ? user.password.trim() : '';
      const storedPwNormalized = normalizeId(storedPw);
      const inputPwNormalized = normalizeId(password);

      const isPasswordMatch = (user.password === password) || (storedPwNormalized === inputPwNormalized);

      if (!isPasswordMatch) {
         setError('Invalid credentials. Please check your password.');
         return;
      }

      const userRoleNormalized = user.role.toLowerCase();
      const selectedRoleNormalized = selectedRole.toLowerCase();
      
      let isRoleAuthorized = false;

      // Role Authorization Logic
      if (userRoleNormalized === 'admin') {
         // Admin can log in as any role (useful for testing, or restrict if preferred)
         isRoleAuthorized = true; 
      } else if (userRoleNormalized === selectedRoleNormalized) {
         isRoleAuthorized = true;
      } else if (selectedRole === UserRole.STAFF) {
         // Any employee can likely log in as Staff to make requests
         isRoleAuthorized = true;
      } else if (selectedRole === UserRole.MEDICAL_INCHARGE && user.department.toUpperCase() === 'PHARMACY') {
          // Fallback for older data mapping if role string isn't exact
          isRoleAuthorized = true;
      }

      if (!isRoleAuthorized) {
         setError(`Access Denied: Your account is not authorized for the '${selectedRole}' role.`);
         return;
      }

      // Override the role in the user object passed up, so the app knows which portal to show
      onLogin({ ...user, role: selectedRole as UserRole }); 
    } else {
      setError(`Employee ID '${employeeId}' not found.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-50 via-white to-white z-0"></div>
      
      {/* Glass Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 z-10 relative">
        
        {/* Header Section */}
        <div className="p-8 text-center border-b border-slate-50 bg-white">
          <div className="flex justify-center mb-6">
             <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-20"><path d="M50 75C50 75 10 50 10 25C10 12 20 5 32 5C42 5 50 15 50 15" stroke="#ef4444" strokeWidth="8" strokeLinecap="round"></path><path d="M50 75C50 75 90 50 90 25C90 12 80 5 68 5C58 5 50 15 50 15" stroke="#10b981" strokeWidth="8" strokeLinecap="round"></path><path d="M30 40H42L46 25L54 55L58 40H70" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            PULSE HOSPITAL
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-wide">And Research Centre</p>
          <p className="text-[10px] font-bold text-emerald-600 tracking-[0.2em] mt-3 uppercase bg-emerald-50 py-1 px-3 rounded-full inline-block">Inventory Management Portal</p>
        </div>

        {/* Login Form */}
        <div className="p-8 pt-6">
          <form onSubmit={handleLogin} className="space-y-5">
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
                Select Portal Role
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                </div>
                <select
                  className="block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent sm:text-sm transition-all appearance-none font-medium cursor-pointer hover:bg-white"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="" disabled>Choose your role...</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
                  Employee ID
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent sm:text-sm transition-all font-medium hover:bg-white"
                    placeholder="ID Number"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    className="block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent sm:text-sm transition-all font-medium hover:bg-white"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || users.length === 0}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-100 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Access Secure Portal
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} Pulse Hospital & Research Centre.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
