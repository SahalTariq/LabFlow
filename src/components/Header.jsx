import React, { useState } from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  Search,
  PlusCircle,
  FlaskConical,
  Bell,
  User,
  LogOut,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const Header = () => {
  const {
    currentUser,
    staffUsers,
    switchStaff,
    logout,
    searchQuery,
    setSearchQuery,
    setIsRegisterOpen,
    setActiveTab,
    resetDemoData,
    stats,
  } = useLab();

  const [isStaffMenuOpen, setIsStaffMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 transition-colors">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-lg leading-none">
                  LabFlow
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">
                  🇵🇰 Pakistan
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Clinic & Pathology Diagnostic System
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient name, mobile, LF-ID, or token..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Register Patient Button */}
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Patient</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={resetDemoData}
            title="Reset database to default seed state"
            className="hidden md:flex items-center gap-1 text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px]">Reset DB</span>
          </button>

          {/* Staff User Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsStaffMenuOpen(!isStaffMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 font-bold text-xs flex items-center justify-center border border-teal-200">
                {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div className="hidden lg:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.name || 'Usman Tariq'}
                </div>
                <div className="text-[10px] text-teal-700 font-medium leading-tight">
                  {currentUser?.roleTitle || 'Administrator'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isStaffMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Switch Staff Account
                  </p>
                </div>
                {staffUsers.map((staff) => (
                  <button
                    key={staff.id}
                    onClick={() => {
                      switchStaff(staff.id);
                      setIsStaffMenuOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                      currentUser?.id === staff.id
                        ? 'bg-teal-50 text-teal-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-[10px] text-slate-400">{staff.roleTitle}</div>
                    </div>
                    {currentUser?.id === staff.id && (
                      <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    )}
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setIsStaffMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
