import React from 'react';
import { useLab } from '../context/LabContext.jsx';
import { Printer, X, CheckCircle2, QrCode, FileText, FlaskConical } from 'lucide-react';

export const PrintReceiptModal = () => {
  const { receiptPatient, setReceiptPatient, setCollectionPatient } = useLab();

  if (!receiptPatient) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleProceedCollection = () => {
    const current = receiptPatient;
    setReceiptPatient(null);
    setCollectionPatient(current);
  };

  const feeAmount = receiptPatient.billing?.paidAmount || receiptPatient.billing?.testPrice || 650;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 px-5 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold tracking-tight">Print Patient Token Receipt</span>
          </div>
          <button
            onClick={() => setReceiptPatient(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 bg-slate-50 flex justify-center">
          <div
            id="printable-receipt-area"
            className="w-full max-w-[340px] bg-white border border-dashed border-slate-300 rounded-xl p-5 shadow-xs space-y-4 text-slate-800"
          >
            {/* Lab Receipt Header */}
            <div className="text-center border-b border-slate-200 pb-3">
              <div className="flex items-center justify-center gap-1.5 font-bold text-slate-900 text-sm">
                <FlaskConical className="w-4 h-4 text-teal-600" />
                <span>LabFlow Diagnostics Pakistan</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Plot 42-B, Main Boulevard, Gulberg III, Lahore
              </p>
              <p className="text-[9px] text-teal-800 font-medium">
                Helpline: +92 42 3578 1234 • WhatsApp: +92 300 8472910
              </p>
              <div className="mt-2 inline-block bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold px-3 py-0.5 rounded-full">
                TOKEN #{receiptPatient.tokenNumber}
              </div>
            </div>

            {/* Patient & Test Details */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient ID:</span>
                <span className="font-mono font-bold text-slate-900">{receiptPatient.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-bold text-slate-900">{receiptPatient.name}</span>
              </div>
              {receiptPatient.guardianName && (
                <div className="flex justify-between">
                  <span className="text-slate-500">S/O, D/O, W/O:</span>
                  <span className="font-medium text-slate-700">{receiptPatient.guardianName}</span>
                </div>
              )}
              {receiptPatient.cnic && (
                <div className="flex justify-between">
                  <span className="text-slate-500">NADRA CNIC:</span>
                  <span className="font-mono font-bold text-slate-800">{receiptPatient.cnic}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Age / Gender:</span>
                <span className="font-medium">
                  {receiptPatient.age} Yrs / {receiptPatient.gender}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">City:</span>
                <span className="font-medium text-slate-700">{receiptPatient.city || 'Lahore'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">WhatsApp:</span>
                <span className="font-mono font-medium text-slate-900">{receiptPatient.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prescribed Test:</span>
                <span className="font-bold text-teal-800 text-right">{receiptPatient.testType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="text-slate-700">{receiptPatient.doctorName || 'Self / Walk-in'}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-1">
                <span className="text-slate-500">Paid Amount:</span>
                <span className="font-bold text-slate-900 font-mono">Rs. {feeAmount} PKR (Paid)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="text-slate-700">
                  {receiptPatient.visitDate} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Barcode Simulation for Phlebotomist Scanning */}
            <div className="pt-2 border-t border-slate-200 text-center space-y-1">
              <div className="h-9 flex items-center justify-center gap-1 font-mono tracking-widest text-[9px] bg-slate-100 rounded px-2 py-1 select-none">
                <div className="flex gap-0.5 h-6 items-center">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2].map((w, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-900 h-full inline-block"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[10px] font-mono text-slate-500">*{receiptPatient.id}*</p>
            </div>

            {/* Note for Patient */}
            <div className="bg-teal-50/70 border border-teal-200/80 rounded-lg p-2 text-center text-[10px] text-teal-900 leading-tight">
              🇵🇰 Your verified diagnostic report will be sent to your WhatsApp number ({receiptPatient.mobile}) as soon as signed by our Consultant Pathologist.
            </div>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setReceiptPatient(null)}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={handleProceedCollection}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Collect Sample Now &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
