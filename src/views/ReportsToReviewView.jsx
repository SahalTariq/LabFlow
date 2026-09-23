import React from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  FileCheck2,
  Eye,
  CheckCircle,
  FileText,
  AlertTriangle,
  Clock,
  ShieldCheck,
  User,
} from 'lucide-react';

export const ReportsToReviewView = () => {
  const {
    patients,
    setReviewApprovePatient,
    setPdfViewerPatient,
    setResultEntryPatient,
  } = useLab();

  const toReview = patients.filter((p) => p.status === 'ready_for_review');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-teal-700" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Pathologist Reports to Review
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Step 7: Clinical verification, signature authorization, and WhatsApp dispatch trigger.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-xl text-teal-900 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>{toReview.length} reports awaiting approval</span>
        </div>
      </div>

      {/* Review Queue Cards */}
      <div className="space-y-3">
        {toReview.length > 0 ? (
          toReview.map((patient) => {
            const fileName =
              patient.reportDetails?.fileName || `${patient.name.replace(/\s+/g, '_')}_Report.pdf`;
            const maskedPhone = patient.mobile.replace(/(\+\d{2}\s?\d{2})\d{5}(\d{3})/, '$1*** $2');

            return (
              <div
                key={patient.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:border-teal-300 transition-colors space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{patient.name}</span>
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Token #{patient.tokenNumber} ({patient.id})
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {patient.age} Yrs • {patient.gender} • Doctor: {patient.doctorName || 'Self / Walk-in'}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 block sm:inline-block">
                      {patient.testType}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                      Uploaded at {patient.reportDetails?.uploadedAt || '11:45 AM'}
                    </span>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Attached Report PDF</span>
                    <span className="font-mono font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      <span className="truncate">{fileName}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp Recipient</span>
                    <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{maskedPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Verification State</span>
                    <span className="font-semibold text-amber-700 mt-0.5 block">
                      {patient.reportDetails?.isDraft ? 'Pending Pathologist Signature' : 'Approved'}
                    </span>
                  </div>
                </div>

                {/* Clinical remarks */}
                {patient.reportDetails?.clinicalRemarks && (
                  <div className="text-xs text-slate-600 bg-amber-50/50 border border-amber-200/60 p-2.5 rounded-lg italic">
                    "{patient.reportDetails.clinicalRemarks}"
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setResultEntryPatient(patient)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-800 underline"
                  >
                    Edit Results or Change File
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPdfViewerPatient(patient)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-700" />
                      <span>Preview PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewApprovePatient(patient)}
                      className="inline-flex items-center gap-1.5 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Review & Approve Report</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Review Queue Clear</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All uploaded diagnostic test reports have been verified, signed by the pathologist, and dispatched.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
