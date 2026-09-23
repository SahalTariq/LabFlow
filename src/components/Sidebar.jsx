import React from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  LayoutDashboard,
  Users,
  TestTube,
  FileCheck2,
  Send,
  Smartphone,
  HelpCircle,
  Settings,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, stats } = useLab();

  const navItems = [
    {
      id: 'overview',
      label: 'Lab Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'patients',
      label: 'Patient Directory',
      icon: Users,
      badge: null,
    },
    {
      id: 'samples',
      label: 'Sample Tracking',
      icon: TestTube,
      badge: stats.samplesWaitingCollection > 0 ? `${stats.samplesWaitingCollection} waiting` : null,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    },
    {
      id: 'review',
      label: 'Reports to Review',
      icon: FileCheck2,
      badge: stats.reportsWaitingApproval > 0 ? `${stats.reportsWaitingApproval} ready` : null,
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-200',
    },
    {
      id: 'sent',
      label: 'Sent on WhatsApp',
      icon: Send,
      badge: stats.whatsappFailed > 0 ? `${stats.whatsappFailed} alert` : null,
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
    },
    {
      id: 'portal',
      label: 'Patient Web Portal',
      icon: Smartphone,
      badge: 'Live',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  ];

  const secondaryNav = [
    {
      id: 'help',
      label: 'Help & Staff Guide',
      icon: HelpCircle,
    },
    {
      id: 'settings',
      label: 'Lab Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none">
      <div className="p-4 flex-1 space-y-6 overflow-y-auto">
        {/* Main Flow Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
            Workflow Operations
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 text-teal-950 font-bold shadow-xs border border-teal-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-teal-700' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                      item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* What Needs Attention Quick Box */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Today's Action Items</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-amber-950">
            <div
              onClick={() => setActiveTab('review')}
              className="flex items-center justify-between hover:underline cursor-pointer"
            >
              <span>Reports for approval:</span>
              <span className="font-bold text-amber-900 bg-amber-100/80 px-1.5 py-0.2 rounded">
                {stats.reportsWaitingApproval}
              </span>
            </div>
            <div
              onClick={() => setActiveTab('samples')}
              className="flex items-center justify-between hover:underline cursor-pointer"
            >
              <span>Awaiting sample draw:</span>
              <span className="font-bold text-amber-900 bg-amber-100/80 px-1.5 py-0.2 rounded">
                {stats.samplesWaitingCollection}
              </span>
            </div>
            <div
              onClick={() => setActiveTab('sent')}
              className="flex items-center justify-between hover:underline cursor-pointer"
            >
              <span>WhatsApp bounce/alert:</span>
              <span className="font-bold text-rose-700 bg-rose-100/80 px-1.5 py-0.2 rounded">
                {stats.whatsappFailed}
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Links */}
        <div className="space-y-1 pt-2 border-t border-slate-100">
          <p className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
            Support & Setup
          </p>
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 text-teal-950 font-bold border border-teal-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-teal-700' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Lab Status */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-slate-700">Lab Server Active</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">v2.1 MERN</span>
      </div>
    </aside>
  );
};
