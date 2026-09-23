import React from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  User,
  X,
  Phone,
  Calendar,
  FileText,
  Clock,
  Send,
  Eye,
  RotateCw,
  Printer,
  History,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const PatientDetailModal = () => {
  const {
    detailPatient,
    setDetailPatient,
    setPdfViewerPatient,
    setDeliveryTrackerPatient,
    resendWhatsAppReport,
    setCollectionPatient,
    setResultEntryPatient,
    setReviewApprovePatient,
  } = useLab();

  if (!detailPatient) return null;

  const previousReports = detailPatient.previousReports || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-teal-700 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center border border-teal-600">
              <User className="w-4 h-4 text-teal-100" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">{detailPatient.name}</h2>
              <p className="text-[11px] text-teal-100">
                Patient ID: {detailPatient.id} • Token #{detailPatient.tokenNumber}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDetailPatient(null)}
            className="text-teal-200 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Gender</span>
              <span className="font-bold text-slate-800">{detailPatient.age} Yrs / {detailPatient.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp Mobile</span>
              <span className="font-mono font-bold text-slate-900">{detailPatient.mobile}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Status</span>
              <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900">
                {detailPatient.status.replace(/_/g, ' ')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Referred By</span>
              <span className="font-medium text-slate-700">{detailPatient.doctorName || 'Self / Walk-in'}</span>
            </div>
          </div>

          {/* Current Test Requisition Card */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Current Visit Test</span>
              <span className="text-[11px] text-slate-500 font-mono">{detailPatient.visitDate}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-teal-800">{detailPatient.testType}</div>
                <div className="text-[11px] text-slate-500">
                  {detailPatient.sampleDetails
                    ? `Sample: ${detailPatient.sampleDetails.sampleType} collected by ${detailPatient.sampleDetails.technician} at ${detailPatient.sampleDetails.collectedAt}`
                    : 'Sample awaiting collection'}
                </div>
              </div>

              {/* Status context action */}
              <div className="flex items-center gap-2">
                {detailPatient.status === 'awaiting_sample' && (
                  <button
                    onClick={() => {
                      const p = detailPatient;
                      setDetailPatient(null);
                      setCollectionPatient(p);
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px]"
                  >
                    Collect Sample
                  </button>
                )}
                {detailPatient.status === 'collected' && (
                  <button
                    onClick={() => {
                      const p = detailPatient;
                      setDetailPatient(null);
                      setResultEntryPatient(p);
                    }}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-[11px]"
                  >
                    Enter Results
                  </button>
                )}
                {detailPatient.status === 'ready_for_review' && (
                  <button
                    onClick={() => {
                      const p = detailPatient;
                      setDetailPatient(null);
                      setReviewApprovePatient(p);
                    }}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-[11px]"
                  >
                    Review & Approve
                  </button>
                )}
                {detailPatient.status === 'sent' && (
                  <button
                    onClick={() => {
                      const p = detailPatient;
                      setDeliveryTrackerPatient(p);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px]"
                  >
                    Track Delivery
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Patient Historic Reports List (Step 11: Patient report history) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-teal-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Historic Patient Reports Archive
              </h3>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {previousReports.length > 0 ? (
                previousReports.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{r.testType}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {r.date} • {r.fileName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPdfViewerPatient(detailPatient)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold flex items-center gap-1 text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-700" />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => resendWhatsAppReport(detailPatient.id)}
                        className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg font-semibold flex items-center gap-1 text-[11px]"
                      >
                        <Send className="w-3.5 h-3.5 text-teal-600" />
                        <span>Resend</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  First visit for this patient. No prior historical reports found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
