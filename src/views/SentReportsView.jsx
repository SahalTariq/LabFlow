import React, { useState } from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  Send,
  CheckCircle2,
  Clock,
  RotateCw,
  Search,
  Eye,
  AlertTriangle,
  PhoneCall,
  Printer,
  Copy,
} from 'lucide-react';

export const SentReportsView = () => {
  const {
    patients,
    setDeliveryTrackerPatient,
    setPdfViewerPatient,
    resendWhatsAppReport,
    showNotification,
  } = useLab();

  const [deliveryFilter, setDeliveryFilter] = useState('all'); // all, delivered, opened, failed
  const [searchTerm, setSearchTerm] = useState('');

  const sentList = patients.filter((p) => p.status === 'sent' || p.status === 'needs_attention');

  const filtered = sentList.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.mobile.includes(q) ||
      p.id.toLowerCase().includes(q);

    if (deliveryFilter === 'all') return matchesSearch;
    if (deliveryFilter === 'delivered')
      return matchesSearch && p.deliveryDetails?.status === 'delivered';
    if (deliveryFilter === 'opened')
      return matchesSearch && (p.deliveryDetails?.status === 'opened' || p.deliveryDetails?.status === 'downloaded');
    if (deliveryFilter === 'failed')
      return matchesSearch && (p.deliveryDetails?.status === 'failed' || p.status === 'needs_attention');
    return matchesSearch;
  });

  const handleCopyLink = (p) => {
    const link = `https://labflow.org/report/${p.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      showNotification('Report link copied to clipboard.', 'success');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-teal-700" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              WhatsApp Sent Reports & Delivery Audits
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Step 9: Monitor delivery timestamps, two-tick delivery status, read receipts, and download actions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sent reports by patient, phone..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Sent' },
            { id: 'delivered', label: 'Delivered (Handset)' },
            { id: 'opened', label: 'Opened / Downloaded' },
            { id: 'failed', label: 'Failed / Action Needed' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setDeliveryFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                deliveryFilter === f.id
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <th className="py-3.5 px-4">Patient & Token</th>
                <th className="py-3.5 px-4">WhatsApp Mobile</th>
                <th className="py-3.5 px-4">Test Report</th>
                <th className="py-3.5 px-4">Sent At</th>
                <th className="py-3.5 px-4">Delivery Status</th>
                <th className="py-3.5 px-4">Patient Interaction</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((patient) => {
                  const del = patient.deliveryDetails;
                  const isFailed = del?.status === 'failed' || patient.status === 'needs_attention';

                  return (
                    <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{patient.name}</div>
                        <div className="text-[10px] font-mono text-teal-800">
                          #{patient.tokenNumber} ({patient.id})
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        {patient.mobile}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{patient.testType}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">
                          {patient.reportDetails?.fileName || 'Report PDF'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {del?.whatsappSentAt || '02:18 PM'}
                      </td>
                      <td className="py-3.5 px-4">
                        {isFailed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            <AlertTriangle className="w-3 h-3" /> Delivery Failed
                          </span>
                        ) : del?.deliveredAt ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Delivered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" /> Sending...
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {del?.downloadedAt ? (
                          <span className="text-[11px] font-bold text-teal-800">
                            Downloaded ({del.downloadedAt})
                          </span>
                        ) : del?.openedAt ? (
                          <span className="text-[11px] font-bold text-blue-700">
                            Opened ({del.openedAt})
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Not opened yet</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPdfViewerPatient(patient)}
                            title="Preview PDF"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(patient)}
                            title="Copy Direct Link"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => resendWhatsAppReport(patient.id)}
                            title="Resend WhatsApp"
                            className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeliveryTrackerPatient(patient)}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                          >
                            Audit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                    No sent reports matching filter.
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
