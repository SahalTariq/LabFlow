import React, { useState } from 'react';
import { useLab } from '../context/LabContext.jsx';
import { Lock, ShieldAlert, KeyRound, Phone, Mail, CheckCircle2, User, X } from 'lucide-react';

export const LoginModal = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, isLoggedIn } = useLab();

  const [identifier, setIdentifier] = useState('usman@labflow.pk');
  const [password, setPassword] = useState('admin123');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  if (!isLoginModalOpen && isLoggedIn) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    login(identifier, password, selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-850 p-6 text-white text-center relative">
          {isLoggedIn && (
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-teal-200 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center mb-3 backdrop-blur-xs border border-white/20">
            <Lock className="w-6 h-6 text-teal-100" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">LabFlow Admin</h2>
          <p className="text-xs text-teal-100 mt-1">
            Authorized Laboratory Staff & Pathology Login
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile number or email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 03008472910 or usman@labflow.pk"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password or staff PIN
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          {/* Role preset chips */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Select Staff Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'admin', label: 'Admin' },
                { id: 'pathologist', label: 'Pathologist' },
                { id: 'technician', label: 'Technician' },
              ].map((role) => (
                <button
                  type="button"
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                    selectedRole === role.id
                      ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {showForgotNotice && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
              <strong>Need password reset?</strong> Contact the Chief Lab Administrator or call the LabFlow Pakistan help desk at <strong>+92 42 3578 1234</strong> / <strong>+92 300 8472910</strong> to reset your staff credentials.
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              Log In to LabFlow
            </button>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setShowForgotNotice(!showForgotNotice)}
              className="text-xs text-teal-700 hover:text-teal-900 font-medium hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        </form>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            Protected Medical System. All access actions are logged for audit compliance.
          </p>
        </div>
      </div>
    </div>
  );
};
