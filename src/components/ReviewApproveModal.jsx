import React, { useState } from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  FileCheck2,
  CheckCircle,
  CheckCircle2,
  Eye,
  FileText,
  AlertTriangle,
  X,
  Phone,
  ShieldCheck,
  Calendar,
  User,
} from 'lucide-react';

export const ReviewApproveModal = () => {
  const {
    reviewApprovePatient,
    setReviewApprovePatient,
    approveReport,
    saveReportDetails,
    currentUser,
    setSendWhatsAppPatient,
    setPdfViewerPatient,
    showNotification,
  } = useLab();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [approving, setApproving] = useState(false);

  // Review Checklist Items
  const [checks, setChecks] = useState({
    patientIdentity: true,
    testMatch: true,
    pdfAttached: true,
    resultsComplete: true,
    phoneCorrect: true,
  });

  if (!reviewApprovePatient) return null;

  const allChecked = Object.values(checks).every(Boolean);

  const toggleCheck = (k) => {
    setChecks((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const handleSaveAsDraft = () => {
    saveReportDetails(reviewApprovePatient.id, { isDraft: true });
    showNotification('Report saved as draft.', 'info');
    setReviewApprovePatient(null);
  };

  const handleConfirmApproval = async () => {
    setApproving(true);
    try {
      await approveReport(
        reviewApprovePatient.id,
        currentUser?.name || 'Prof. Dr. Ayesha Siddiqui (FCPS)'
      );
      setShowConfirmDialog(false);
      const curr = reviewApprovePatient;
      setReviewApprovePatient(null);

      // Open WhatsApp Dispatch directly after approval
      setSendWhatsAppPatient(curr);
    } catch (err) {
      showNotification(err.message || 'Approval failed', 'warning');
    } finally {
      setApproving(false);
    }
  };

  // Mask phone number for security
  const maskedPhone = reviewApprovePatient.mobile
    ? reviewApprovePatient.mobile.replace(/(\+\d{2}\s?\d{2})\d{5}(\d{3})/, '$1*** $2')
    : '+91 98*** 43210';

  const reportFileName =
    reviewApprovePatient.reportDetails?.fileName ||
    `${reviewApprovePatient.name.replace(/\s+/g, '_')}_CBC_18Sep2026.pdf`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-teal-700 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center border border-teal-600">
              <ShieldCheck className="w-4 h-4 text-teal-100" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Review and Approve Report</h2>
              <p className="text-[11px] text-teal-100">Step 7: Pathologist Verification & Quality Check</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowConfirmDialog(false);
              setReviewApprovePatient(null);
            }}
            className="text-teal-200 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient & Report Card */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Patient:</span>
              <span className="font-bold text-slate-900 text-sm">{reviewApprovePatient.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Test:</span>
              <span className="font-bold text-teal-800">{reviewApprovePatient.testType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Mobile (WhatsApp):</span>
              <span className="font-mono font-medium text-slate-700">{maskedPhone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Report PDF:</span>
              <span className="font-mono font-semibold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>{reportFileName}</span>
              </span>
            </div>
          </div>

          {/* Quick Preview PDF Action Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setPdfViewerPatient(reviewApprovePatient)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-teal-700" />
              <span>Preview Diagnostic PDF Report</span>
            </button>
          </div>

          {/* Pathologist Verification Checklist */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Pathologist Pre-Sign Checklist
            </span>
            <div className="space-y-1.5 text-xs">
              {[
                { key: 'patientIdentity', label: `Patient name (${reviewApprovePatient.name}) and token match requisition` },
                { key: 'testMatch', label: `Test parameters match prescribed test (${reviewApprovePatient.testType})` },
                { key: 'pdfAttached', label: `Diagnostic PDF file attached (${reportFileName})` },
                { key: 'resultsComplete', label: 'All reference ranges and clinical interpretations verified' },
                { key: 'phoneCorrect', label: `WhatsApp delivery phone confirmed (${maskedPhone})` },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checks[item.key]}
                    onChange={() => toggleCheck(item.key)}
                    className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className="text-slate-700 font-medium">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSaveAsDraft}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={!allChecked}
              onClick={() => setShowConfirmDialog(true)}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve Report</span>
            </button>
          </div>
        </div>

        {/* Confirmation Dialog Overlay */}
        {showConfirmDialog && (
          <div className="absolute inset-0 bg-slate-950/75 z-20 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Please confirm approval</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Once approved, this diagnostic report will be marked <strong>Ready to send</strong> and can be dispatched to the patient's WhatsApp.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 text-[11px] space-y-1 text-slate-700 border border-slate-200">
                <div><strong>Patient:</strong> {reviewApprovePatient.name}</div>
                <div><strong>Test:</strong> {reviewApprovePatient.testType}</div>
                <div><strong>Mobile:</strong> {maskedPhone}</div>
                <div><strong>Report file:</strong> {reportFileName}</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={approving}
                  onClick={handleConfirmApproval}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {approving ? 'Approving...' : 'Approve and Continue'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
