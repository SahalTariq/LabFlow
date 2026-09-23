import React, { useState } from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  Send,
  MessageSquare,
  CheckCircle2,
  FileText,
  X,
  Phone,
  Edit2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const SendWhatsAppModal = () => {
  const {
    sendWhatsAppPatient,
    setSendWhatsAppPatient,
    sendWhatsAppReport,
    updatePatientPhone,
    setDeliveryTrackerPatient,
    showNotification,
  } = useLab();

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneVal, setPhoneVal] = useState('');
  const [sending, setSending] = useState(false);

  if (!sendWhatsAppPatient) return null;

  const currentPhone = phoneVal || sendWhatsAppPatient.mobile;
  // Format masked Pakistan phone like +92 301 *** 543
  const maskedPhone = currentPhone.length >= 10
    ? currentPhone.slice(0, 7) + ' *** ' + currentPhone.slice(-3)
    : currentPhone;

  const reportFileName =
    sendWhatsAppPatient.reportDetails?.fileName ||
    `${sendWhatsAppPatient.name.replace(/\s+/g, '_')}_Report.pdf`;

  const handleSavePhone = (e) => {
    e.preventDefault();
    if (phoneVal.trim()) {
      let formatted = phoneVal.trim();
      if (!formatted.startsWith('+')) {
        if (formatted.startsWith('0')) {
          formatted = '+92 ' + formatted.slice(1);
        } else {
          formatted = '+92 ' + formatted;
        }
      }
      updatePatientPhone(sendWhatsAppPatient.id, formatted);
      setIsEditingPhone(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      await sendWhatsAppReport(sendWhatsAppPatient.id);
      const curr = sendWhatsAppPatient;
      setSendWhatsAppPatient(null);
      // Open the delivery tracker timeline immediately
      setDeliveryTrackerPatient(curr);
    } catch {
      showNotification('Failed to dispatch WhatsApp message.', 'warning');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-emerald-700 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center border border-emerald-600">
              <MessageSquare className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Send Report via WhatsApp</h2>
                <span className="bg-emerald-900/60 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                  🇵🇰 Pakistan (+92)
                </span>
              </div>
              <p className="text-[11px] text-emerald-100">Step 8: Instant WhatsApp Delivery</p>
            </div>
          </div>
          <button
            onClick={() => setSendWhatsAppPatient(null)}
            className="text-emerald-200 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Status banner */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Diagnostic Report Verified & Approved</span>
            </div>
            <span className="bg-emerald-200/70 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Ready to Send
            </span>
          </div>

          {/* Recipient Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <span className="font-bold text-slate-900">{sendWhatsAppPatient.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Test:</span>
              <span className="font-semibold text-teal-800">{sendWhatsAppPatient.testType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Mobile:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-800">{maskedPhone}</span>
                <button
                  type="button"
                  onClick={() => {
                    setPhoneVal(sendWhatsAppPatient.mobile);
                    setIsEditingPhone(!isEditingPhone);
                  }}
                  className="text-teal-700 hover:text-teal-900 p-0.5 text-[11px] font-medium underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Change</span>
                </button>
              </div>
            </div>

            {isEditingPhone && (
              <form onSubmit={handleSavePhone} className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={phoneVal}
                  onChange={(e) => setPhoneVal(e.target.value)}
                  placeholder="0300 1234567 or +92 300 1234567"
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold"
                >
                  Save
                </button>
              </form>
            )}

            <div className="flex justify-between">
              <span className="text-slate-500">Attached File:</span>
              <span className="font-mono text-slate-700 truncate max-w-[220px]">
                {reportFileName}
              </span>
            </div>
          </div>

          {/* WhatsApp Message Preview */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              WhatsApp Chat Message Preview
            </span>
            <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-slate-300/80 shadow-inner space-y-2">
              <div className="max-w-[310px] bg-white rounded-xl rounded-tl-xs p-3.5 shadow-xs text-xs text-slate-800 space-y-2">
                <div className="font-bold text-slate-900">
                  Assalam-o-Alaikum,
                </div>
                <p className="text-[11px] text-slate-700 leading-tight">
                  Your diagnostic lab report is ready.
                </p>
                <div className="space-y-0.5 text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono">
                  <div><strong>Patient:</strong> {sendWhatsAppPatient.name}</div>
                  <div><strong>Test:</strong> {sendWhatsAppPatient.testType}</div>
                  <div><strong>Date:</strong> {sendWhatsAppPatient.visitDate}</div>
                  <div><strong>Lab:</strong> LabFlow Diagnostics, Lahore</div>
                </div>
                <div className="pt-1 text-[11px] text-slate-600">
                  Click below to securely access your PDF report:
                </div>
                <div className="p-2 bg-emerald-50/80 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 font-bold text-[11px]">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">View Medical PDF Report (PKR Verified)</span>
                </div>
                <div className="text-[9px] text-slate-400 text-right">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • LabFlow Pakistan
                </div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setSendWhatsAppPatient(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={sending}
              onClick={handleSend}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Sending...' : 'Send on WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
