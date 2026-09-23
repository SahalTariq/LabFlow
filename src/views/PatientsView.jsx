import React, { useState } from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  Eye,
  Send,
  Printer,
  ChevronRight,
  TestTube,
} from 'lucide-react';

export const PatientsView = () => {
  const {
    patients,
    searchQuery,
    setSearchQuery,
    setIsRegisterOpen,
    setDetailPatient,
    setCollectionPatient,
    setReviewApprovePatient,
    setDeliveryTrackerPatient,
    setReceiptPatient,
  } = useLab();

  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = patients.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.mobile.includes(q) ||
      (p.cnic && p.cnic.includes(q)) ||
      (p.city && p.city.toLowerCase().includes(q)) ||
      p.testType.toLowerCase().includes(q) ||
      String(p.tokenNumber).includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-700" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Patient Registry & Search
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Step 10: Search patient records by name, mobile, LF-ID, report #, date, or test type.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Patient Registration</span>
        </button>
      </div>

      {/* Filters and search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, token, mobile, or test..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Status' },
            { id: 'awaiting_sample', label: 'Awaiting Sample' },
            { id: 'collected', label: 'Collected' },
            { id: 'processing', label: 'Processing' },
            { id: 'ready_for_review', label: 'Ready for Review' },
            { id: 'sent', label: 'Sent on WhatsApp' },
            { id: 'needs_attention', label: 'Needs Attention' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <th className="py-3.5 px-4">Token & ID</th>
                <th className="py-3.5 px-4">Patient Information</th>
                <th className="py-3.5 px-4">WhatsApp Mobile</th>
                <th className="py-3.5 px-4">Investigation Test</th>
                <th className="py-3.5 px-4">Visit Date</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((patient) => {
                  return (
                    <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">#{patient.tokenNumber}</div>
                        <div className="font-mono text-[10px] text-teal-800">{patient.id}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{patient.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {patient.age} Yrs • {patient.gender} {patient.city ? `• ${patient.city}` : ''}
                        </div>
                        {patient.cnic && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            CNIC: {patient.cnic}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        {patient.mobile}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{patient.testType}</div>
                        <div className="text-[10px] text-slate-400">{patient.doctorName || 'Self'}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {patient.visitDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                            patient.status === 'awaiting_sample'
                              ? 'bg-amber-100 text-amber-900'
                              : patient.status === 'collected'
                              ? 'bg-blue-100 text-blue-900'
                              : patient.status === 'processing'
                              ? 'bg-indigo-100 text-indigo-900'
                              : patient.status === 'ready_for_review'
                              ? 'bg-emerald-100 text-emerald-900'
                              : patient.status === 'sent'
                              ? 'bg-teal-100 text-teal-900'
                              : 'bg-rose-100 text-rose-900'
                          }`}
                        >
                          {patient.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setReceiptPatient(patient)}
                            title="Print Token Slip"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDetailPatient(patient)}
                            className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Open Patient
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                    No patients match your search criteria.
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
