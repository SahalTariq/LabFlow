import React from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  Clock,
  CheckCircle2,
  Check,
  RotateCw,
  Copy,
  Printer,
  PhoneCall,
  X,
  ExternalLink,
  Smartphone,
  Eye,
  Download,
} from 'lucide-react';

export const DeliveryTrackerModal = () => {
  const {
    deliveryTrackerPatient,
    setDeliveryTrackerPatient,
    resendWhatsAppReport,
    simulatePatientOpen,
    simulatePatientDownload,
    setPdfViewerPatient,
    showNotification,
  } = useLab();

  if (!deliveryTrackerPatient) return null;

  const delivery = deliveryTrackerPatient.deliveryDetails || {
    whatsappSentAt: '02:18 PM',
    deliveredAt: '02:18 PM',
    openedAt: '02:22 PM',
    downloadedAt: null,
    status: 'opened',
    resendCount: 0,
  };

  const handleCopyLink = () => {
    const link = `https://labflow.pk/report/${deliveryTrackerPatient.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      showNotification('Report link copied to clipboard.', 'success');
    }
  };

  const handleResend = () => {
    resendWhatsAppReport(deliveryTrackerPatient.id);
  };

  const handleSimulateOpen = () => {
    simulatePatientOpen(deliveryTrackerPatient.id);
    showNotification("Patient simulated opening WhatsApp report link.", "info");
  };

  const handleSimulateDownload = () => {
    simulatePatientDownload(deliveryTrackerPatient.id);
    showNotification("Patient downloaded final diagnostic PDF.", "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
              <Clock className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Track Report Delivery</h2>
              <p className="text-[11px] text-slate-400">Step 9: WhatsApp Real-time Delivery History</p>
            </div>
          </div>
          <button
            onClick={() => setDeliveryTrackerPatient(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient header card */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 text-xs flex justify-between items-center shrink-0">
          <div>
            <div className="font-bold text-slate-900 text-sm">{deliveryTrackerPatient.name}</div>
            <div className="text-slate-500">{deliveryTrackerPatient.testType} • {deliveryTrackerPatient.id}</div>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-slate-800 block">{deliveryTrackerPatient.mobile}</span>
            <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Sent via WhatsApp
            </span>
          </div>
        </div>

        {/* Timeline body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {/* 1. Created */}
            <div className="flex items-start gap-4 relative">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center z-10 shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>Sample Registered & Logged</span>
                  <span className="text-slate-400 font-mono">09:42 AM</span>
                </div>
                <p className="text-slate-500 text-[11px]">Patient token created and sample collected.</p>
              </div>
            </div>

            {/* 2. Approved */}
            <div className="flex items-start gap-4 relative">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center z-10 shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>Report Approved by Pathologist</span>
                  <span className="text-slate-400 font-mono">
                    {deliveryTrackerPatient.reportDetails?.approvedAt || '02:15 PM'}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">Verified by Prof. Dr. Ayesha Siddiqui (FCPS).</p>
              </div>
            </div>

            {/* 3. WhatsApp Sent */}
            <div className="flex items-start gap-4 relative">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center z-10 shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>WhatsApp Sent</span>
                  <span className="text-slate-400 font-mono">{delivery.whatsappSentAt || '02:18 PM'}</span>
                </div>
                <p className="text-slate-500 text-[11px]">Dispatched from LabFlow WhatsApp Gateway.</p>
              </div>
            </div>

            {/* 4. Delivered */}
            <div className="flex items-start gap-4 relative">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center z-10 shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>Delivered to Handset</span>
                  <span className="text-slate-400 font-mono">{delivery.deliveredAt || '02:18 PM'}</span>
                </div>
                <p className="text-slate-500 text-[11px]">Two grey ticks received from Meta WhatsApp API.</p>
              </div>
            </div>

            {/* 5. Opened by patient */}
            <div className="flex items-start gap-4 relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 ${
                  delivery.openedAt ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-400'
                }`}
              >
                {delivery.openedAt ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>Opened by Patient</span>
                  <span className="text-slate-500 font-mono">{delivery.openedAt || 'Waiting...'}</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  {delivery.openedAt
                    ? 'Patient clicked the secure link to view results.'
                    : 'Patient has received but not yet opened the link.'}
                </p>
                {!delivery.openedAt && (
                  <button
                    type="button"
                    onClick={handleSimulateOpen}
                    className="mt-1 text-[10px] text-teal-700 font-bold hover:underline cursor-pointer"
                  >
                    Simulate Patient Opening Link &rarr;
                  </button>
                )}
              </div>
            </div>

            {/* 6. Downloaded */}
            <div className="flex items-start gap-4 relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 ${
                  delivery.downloadedAt ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-400'
                }`}
              >
                {delivery.downloadedAt ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>Downloaded PDF</span>
                  <span className="text-slate-500 font-mono">{delivery.downloadedAt || 'Not yet'}</span>
                </div>
                <p className="text-slate-500 text-[11px]">Saved to phone or printed by patient.</p>
                {!delivery.downloadedAt && (
                  <button
                    type="button"
                    onClick={handleSimulateDownload}
                    className="mt-1 text-[10px] text-teal-700 font-bold hover:underline cursor-pointer"
                  >
                    Simulate Patient PDF Download &rarr;
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Staff Action Controls (Prompt requirement) */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Staff Actions If Patient Has Issues
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={handleResend}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center gap-1 text-slate-800 text-[11px] font-bold cursor-pointer transition-colors"
              >
                <RotateCw className="w-4 h-4 text-teal-700" />
                <span>Resend Link</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center gap-1 text-slate-800 text-[11px] font-bold cursor-pointer transition-colors"
              >
                <Copy className="w-4 h-4 text-teal-700" />
                <span>Copy Link</span>
              </button>

              <button
                type="button"
                onClick={() => setPdfViewerPatient(deliveryTrackerPatient)}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center gap-1 text-slate-800 text-[11px] font-bold cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-teal-700" />
                <span>Print Report</span>
              </button>

              <a
                href={`tel:${deliveryTrackerPatient.mobile}`}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center gap-1 text-slate-800 text-[11px] font-bold cursor-pointer transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-teal-700" />
                <span>Call Patient</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
