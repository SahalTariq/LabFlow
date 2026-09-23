import React, { useState } from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  Smartphone,
  FileText,
  Download,
  Share2,
  CheckCircle2,
  Lock,
  Search,
  FlaskConical,
  Eye,
  ShieldCheck,
} from 'lucide-react';

export const PatientPortalView = () => {
  const { patients, setPdfViewerPatient, showNotification } = useLab();

  const [selectedPatientId, setSelectedPatientId] = useState(
    patients.find((p) => p.status === 'sent')?.id || patients[0]?.id
  );

  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleDownload = () => {
    showNotification('Diagnostic PDF downloaded to phone storage.', 'success');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Lab Report - ${currentPatient?.name}`,
        url: window.location.href,
      });
    } else {
      showNotification('Direct link copied for sharing.', 'info');
    }
  };

  if (!currentPatient) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        No patient records available.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Top Banner explaining Patient Experience */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-teal-700" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Patient WhatsApp Link Simulator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Preview the exact mobile landing page patient sees when tapping the WhatsApp link.
          </p>
        </div>

        {/* Patient Switcher for Admin testing */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-semibold whitespace-nowrap">
            Simulate Patient:
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.testType}) - #{p.tokenNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Simulated Mobile Frame Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-white border border-slate-300 rounded-3xl shadow-xl overflow-hidden flex flex-col">
          {/* Mobile Status Bar Simulation */}
          <div className="bg-teal-850 px-6 py-3 text-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold">
              <FlaskConical className="w-4 h-4 text-teal-300" />
              <span>LabFlow Patient Portal</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-teal-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>Secure 256-bit</span>
            </div>
          </div>

          {/* Portal Content */}
          <div className="p-6 space-y-5 bg-slate-50">
            {/* Verified Patient Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{currentPatient.name}</h2>
                  <p className="text-xs text-slate-500">
                    {currentPatient.age} Yrs • {currentPatient.gender} • Token #{currentPatient.tokenNumber}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Investigation:</span>
                  <span className="font-bold text-teal-800">{currentPatient.testType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date of Test:</span>
                  <span className="font-medium text-slate-700">{currentPatient.visitDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verified By:</span>
                  <span className="font-medium text-slate-700">Prof. Dr. Ayesha Siddiqui (FCPS)</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Report Download Box */}
            <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-2xl p-5 text-white shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <FileText className="w-5 h-5 text-teal-200" />
                </div>
                <div>
                  <div className="text-sm font-bold">Official Lab Report PDF</div>
                  <div className="text-xs text-teal-200">
                    {currentPatient.reportDetails?.fileName || `${currentPatient.name}_Report.pdf`}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPdfViewerPatient(currentPatient)}
                  className="py-2.5 px-3 bg-white text-teal-900 font-bold text-xs rounded-xl shadow-xs hover:bg-teal-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-teal-700" />
                  <span>View PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="py-2.5 px-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 border border-teal-400/40 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Lab Contact / Assistance for Patient */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800">Need help understanding your report?</div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Contact your consulting physician or call LabFlow Diagnostics Pakistan helpline at <strong>+92 42 3578 1234</strong> or WhatsApp <strong>+92 300 8472910</strong> for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
