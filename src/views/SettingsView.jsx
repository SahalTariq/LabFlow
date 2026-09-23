import React, { useState } from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  Settings,
  ShieldCheck,
  Building,
  MessageSquare,
  Printer,
  Users,
  Save,
  CheckCircle2,
  Database,
  Code2,
} from 'lucide-react';

export const SettingsView = () => {
  const { showNotification } = useLab();

  const [labName, setLabName] = useState('LabFlow Diagnostic & Pathology Laboratories');
  const [labAddress, setLabAddress] = useState('Plot 42-B, Main Boulevard, Gulberg III, Lahore, Pakistan');
  const [labPhone, setLabPhone] = useState('+92 42 3578 1234');
  const [whatsappSender, setWhatsappSender] = useState('LabFlow Official Pakistan (+92 300 8472910)');
  const [autoSendOnApprove, setAutoSendOnApprove] = useState(true);
  const [printAutoReceipt, setPrintAutoReceipt] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    showNotification('System preferences saved successfully.', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-700" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Laboratory Configuration & MERN Stack Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure laboratory branding, WhatsApp Business API gateway, and Pakistan MongoDB schema.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Lab Profile */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">Diagnostic Center Details (Pakistan)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Laboratory Name</label>
              <input
                type="text"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Contact Phone (PTCL / UAN)</label>
              <input
                type="text"
                value={labPhone}
                onChange={(e) => setLabPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Physical Address</label>
              <input
                type="text"
                value={labAddress}
                onChange={(e) => setLabAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Gateway */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageSquare className="w-4 h-4 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">WhatsApp Business Cloud API (+92 Gateway)</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Connected WhatsApp Account</label>
              <input
                type="text"
                value={whatsappSender}
                onChange={(e) => setWhatsappSender(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSendOnApprove}
                  onChange={(e) => setAutoSendOnApprove(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Automatically prompt WhatsApp dispatch upon Pathologist report approval</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={printAutoReceipt}
                  onChange={(e) => setPrintAutoReceipt(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Automatically open Printable Token Slip after patient registration</span>
              </label>
            </div>
          </div>
        </div>

        {/* Backend / Database Architecture Information (MERN Stack & Pakistan Schema) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Database className="w-4 h-4 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">MERN Stack & Pakistan MongoDB Architecture</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">State Manager</span>
              <span className="font-bold text-teal-800">Redux Toolkit (RTK)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Frontend</span>
              <span className="font-bold text-slate-900">React 19 (JSX)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Backend</span>
              <span className="font-bold text-slate-900">Node.js Express API</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Database</span>
              <span className="font-bold text-slate-900">MongoDB DocStore</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Country & Currency</span>
              <span className="font-bold text-teal-800">Pakistan (PKR / Rs.)</span>
            </div>
          </div>

          {/* Pakistan MongoDB Schema Preview */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto space-y-1">
            <div className="text-teal-400 font-bold flex items-center justify-between pb-1 border-b border-slate-800">
              <span>// server/models/PatientSchema.js — Pakistan Mongoose Schema</span>
              <span className="text-[10px] text-slate-400">PM&DC & PHCC Compliant</span>
            </div>
            <pre className="text-slate-300">
{`const PatientSchema = new mongoose.Schema({
  tokenNumber: { type: Number, required: true, index: true },
  name: { type: String, required: true, trim: true },
  cnic: { type: String, match: /^\\d{5}-\\d{7}-\\d{1}$/ }, // NADRA 13-digit CNIC
  guardianName: { type: String }, // Father or Husband Name
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  mobile: { type: String, required: true }, // +92 3xx xxxxxxx WhatsApp format
  city: { type: String, default: 'Lahore' },
  province: { type: String, default: 'Punjab' },
  testType: { type: String, required: true },
  doctorName: { type: String, default: 'Self / Walk-in' },
  pmdcRegNumber: { type: String }, // Pakistan Medical & Dental Council Reg #
  billing: {
    testPrice: { type: Number, default: 650 },
    paidAmount: { type: Number, default: 650 },
    currency: { type: String, default: 'PKR' },
    paymentMethod: { type: String, enum: ['Cash', 'JazzCash', 'Easypaisa', 'Bank Transfer'] }
  },
  sampleDetails: {
    technician: { type: String, default: 'Muhammad Bilal Khan (BS-MLT)' },
    tubeType: { type: String, default: 'EDTA Purple Tube (K2 EDTA)' }
  },
  reportDetails: {
    approvedBy: { type: String, default: 'Prof. Dr. Ayesha Siddiqui (FCPS)' },
    pathologistPmdc: { type: String, default: 'PM&DC Reg # 24519-P' }
  }
}, { timestamps: true });`}
            </pre>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved
            </span>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
