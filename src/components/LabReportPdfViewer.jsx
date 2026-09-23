import React from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  FileText,
  Printer,
  Download,
  Share2,
  X,
  ShieldCheck,
  FlaskConical,
  CheckCircle,
} from 'lucide-react';

export const LabReportPdfViewer = () => {
  const { pdfViewerPatient, setPdfViewerPatient, showNotification } = useLab();

  if (!pdfViewerPatient) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showNotification(
      `Downloading ${pdfViewerPatient.name.replace(/\s+/g, '_')}_Diagnostic_Report.pdf`,
      'success'
    );
  };

  const params =
    pdfViewerPatient.reportDetails?.parameters &&
    pdfViewerPatient.reportDetails.parameters.length > 0
      ? pdfViewerPatient.reportDetails.parameters
      : [
          { name: 'Hemoglobin (Hb)', value: '13.2', unit: 'g/dL', referenceRange: '12.0 - 15.5', flag: 'Normal' },
          { name: 'Total Leucocyte Count (WBC)', value: '6,800', unit: '/cu.mm', referenceRange: '4,000 - 11,000', flag: 'Normal' },
          { name: 'Platelet Count', value: '265,000', unit: '/cu.mm', referenceRange: '150,000 - 450,000', flag: 'Normal' },
          { name: 'Packed Cell Volume (PCV)', value: '39.8', unit: '%', referenceRange: '36.0 - 46.0', flag: 'Normal' },
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Action Bar */}
        <div className="bg-slate-900 px-6 py-3.5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold tracking-tight">
              Diagnostic Lab Report PDF • {pdfViewerPatient.reportDetails?.fileName || `${pdfViewerPatient.name}_Report.pdf`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={() => setPdfViewerPatient(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Diagnostic Report Paper View */}
        <div className="p-6 overflow-y-auto bg-slate-100 flex justify-center">
          <div
            id="diagnostic-report-paper"
            className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-8 shadow-md space-y-6 text-slate-800"
          >
            {/* Header with Lab Details */}
            <div className="border-b-2 border-teal-700 pb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-slate-900 leading-tight">
                      LabFlow Diagnostic & Pathology Laboratories
                    </h1>
                    <p className="text-[11px] text-teal-800 font-semibold">
                      ISO 15189 Certified • PHCC Approved Medical Lab • PM&DC Registered
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Plot 42-B, Main Boulevard, Gulberg III, Lahore, Pakistan • Phone: +92 42 3578 1234 • info@labflow.pk
                </p>
              </div>
              <div className="text-right text-[10px] text-slate-500 font-mono">
                <div>Report ID: {pdfViewerPatient.reportDetails?.reportId || 'REP-1048'}</div>
                <div className="text-teal-800 font-bold">Verified & Signed</div>
              </div>
            </div>

            {/* Patient Demographic Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name</span>
                <span className="font-bold text-slate-900">{pdfViewerPatient.name}</span>
                {pdfViewerPatient.guardianName && (
                  <span className="text-[10px] text-slate-500 block truncate">S/O: {pdfViewerPatient.guardianName}</span>
                )}
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Token / LF-ID</span>
                <span className="font-mono font-bold text-teal-800">
                  #{pdfViewerPatient.tokenNumber} ({pdfViewerPatient.id})
                </span>
                {pdfViewerPatient.cnic && (
                  <span className="text-[10px] text-slate-500 block font-mono">CNIC: {pdfViewerPatient.cnic}</span>
                )}
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Gender</span>
                <span className="font-semibold text-slate-700">
                  {pdfViewerPatient.age} Yrs / {pdfViewerPatient.gender}
                </span>
                <span className="text-[10px] text-slate-500 block">{pdfViewerPatient.city || 'Lahore'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Referred By</span>
                <span className="font-semibold text-slate-700 truncate block">
                  {pdfViewerPatient.doctorName || 'Self / Walk-in'}
                </span>
                {pdfViewerPatient.pmdcRegNumber && (
                  <span className="text-[10px] text-slate-500 block">{pdfViewerPatient.pmdcRegNumber}</span>
                )}
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Sample Collected</span>
                <span className="text-slate-700">
                  {pdfViewerPatient.sampleDetails?.collectedAt || '09:42 AM'} ({pdfViewerPatient.sampleDetails?.sampleType || 'Blood'})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Report Date</span>
                <span className="text-slate-700">{pdfViewerPatient.visitDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp Mobile</span>
                <span className="font-mono text-slate-700">{pdfViewerPatient.mobile}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Quality Grade</span>
                <span className="text-emerald-700 font-bold">Pass / Verified</span>
              </div>
            </div>

            {/* Test Title */}
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-sm font-bold text-teal-900 uppercase tracking-wide">
                Investigation: {pdfViewerPatient.testType}
              </h2>
            </div>

            {/* Diagnostic Parameters Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2">Test Investigation</th>
                    <th className="py-2 text-right">Result Value</th>
                    <th className="py-2">Units</th>
                    <th className="py-2">Biological Reference Interval</th>
                    <th className="py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {params.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 font-medium text-slate-900">{p.name}</td>
                      <td className="py-2.5 font-bold text-right text-slate-900 font-mono">
                        {p.value}
                      </td>
                      <td className="py-2.5 text-slate-500 font-mono">{p.unit}</td>
                      <td className="py-2.5 text-slate-500 font-mono">{p.referenceRange}</td>
                      <td className="py-2.5 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.flag === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : p.flag === 'Low'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.flag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Clinical Remarks & Pathologist Sign-off */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                Clinical Interpretation / Pathologist Remarks
              </span>
              <p className="text-slate-600 leading-relaxed italic text-[11px]">
                "{pdfViewerPatient.reportDetails?.clinicalRemarks || 'Hb within normal limits. Normocytic normochromic smear. Total counts and platelets adequate.'}"
              </p>
            </div>

            {/* Footer Signatures */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
              <div>
                <p className="font-bold text-slate-800">Muhammad Bilal Khan, BS-MLT</p>
                <p className="text-[10px] text-slate-500">Chief Medical Lab Technologist</p>
                <p className="text-[9px] text-slate-400">Section: Automated Hematology / Biochemistry</p>
              </div>
              <div className="text-right">
                <div className="font-mono text-teal-800 font-bold text-xs">
                  {pdfViewerPatient.reportDetails?.approvedBy || 'Prof. Dr. Ayesha Siddiqui, MBBS, FCPS'}
                </div>
                <p className="text-[10px] text-slate-500">Consultant Pathologist & Lab Director</p>
                <p className="text-[9px] text-teal-700 font-medium">PM&DC Reg # 24519-P</p>
                <p className="text-[9px] text-slate-400 font-mono">Digital Signature Hash: #PK-LHR-8F9A-412C</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
