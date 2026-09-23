import React, { useState } from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  FileCheck,
  AlertCircle,
  Plus,
  Trash2,
} from 'lucide-react';

export const ResultEntryModal = () => {
  const {
    resultEntryPatient,
    setResultEntryPatient,
    saveReportDetails,
    setReviewApprovePatient,
  } = useLab();

  const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'parameters'
  const [uploadedFile, setUploadedFile] = useState(
    resultEntryPatient?.reportDetails?.fileName
      ? { name: resultEntryPatient.reportDetails.fileName, size: '412 KB' }
      : null
  );

  const [clinicalRemarks, setClinicalRemarks] = useState(
    resultEntryPatient?.reportDetails?.clinicalRemarks ||
      'Hb within normal limits (13.2 g/dL). Normocytic normochromic blood picture. Platelets adequate.'
  );

  const [parameters, setParameters] = useState(
    resultEntryPatient?.reportDetails?.parameters &&
      resultEntryPatient.reportDetails.parameters.length > 0
      ? resultEntryPatient.reportDetails.parameters
      : [
          { name: 'Hemoglobin (Hb)', value: '13.2', unit: 'g/dL', referenceRange: '12.0 - 15.5', flag: 'Normal' },
          { name: 'Total Leucocyte Count (WBC)', value: '6,800', unit: '/cu.mm', referenceRange: '4,000 - 11,000', flag: 'Normal' },
          { name: 'Platelet Count', value: '265,000', unit: '/cu.mm', referenceRange: '150,000 - 450,000', flag: 'Normal' },
          { name: 'Packed Cell Volume (PCV)', value: '39.8', unit: '%', referenceRange: '36.0 - 46.0', flag: 'Normal' },
        ]
  );

  if (!resultEntryPatient) return null;

  const handleSimulateUpload = () => {
    const defaultName = `${resultEntryPatient.name.replace(/\s+/g, '_')}_${resultEntryPatient.testType.substring(0, 3).toUpperCase()}_${new Date().getDate()}Sep2026.pdf`;
    setUploadedFile({
      name: defaultName,
      size: '412 KB',
    });
  };

  const handleParameterChange = (index, field, val) => {
    const updated = [...parameters];
    updated[index][field] = val;
    setParameters(updated);
  };

  const handleAddParam = () => {
    setParameters([
      ...parameters,
      { name: 'New Parameter', value: '', unit: '', referenceRange: '', flag: 'Normal' },
    ]);
  };

  const handleRemoveParam = (index) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalFileName =
      uploadedFile?.name ||
      `${resultEntryPatient.name.replace(/\s+/g, '_')}_Final_Report.pdf`;

    saveReportDetails(resultEntryPatient.id, {
      fileName: finalFileName,
      fileSize: uploadedFile?.size || '380 KB',
      parameters,
      clinicalRemarks,
      isDraft: true,
    });

    const curr = resultEntryPatient;
    setResultEntryPatient(null);
    setReviewApprovePatient(curr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-teal-700 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center border border-teal-600">
              <UploadCloud className="w-4 h-4 text-teal-100" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Enter or Upload Test Results</h2>
              <p className="text-[11px] text-teal-100">Step 6: Diagnostic Results Processing</p>
            </div>
          </div>
          <button
            onClick={() => setResultEntryPatient(null)}
            className="text-teal-200 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient banner */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient</span>
            <span className="font-bold text-slate-900">{resultEntryPatient.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Token / ID</span>
            <span className="font-mono font-bold text-teal-800">
              #{resultEntryPatient.tokenNumber} ({resultEntryPatient.id})
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Prescribed Test</span>
            <span className="font-semibold text-slate-800">{resultEntryPatient.testType}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp Mobile</span>
            <span className="font-mono text-slate-700">{resultEntryPatient.mobile}</span>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 px-6 pt-2 bg-white shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeMode === 'upload'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            1. Upload Final Report PDF (Recommended)
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('parameters')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeMode === 'parameters'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            2. Enter Lab Values & Parameters
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {activeMode === 'upload' ? (
            <div className="space-y-4">
              <div
                onClick={handleSimulateUpload}
                className="border-2 border-dashed border-teal-300 bg-teal-50/40 hover:bg-teal-50/80 rounded-2xl p-8 text-center cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-teal-100 mx-auto flex items-center justify-center text-teal-700 mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Click to select or drop diagnostic report PDF
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Supports .pdf scanned reports or auto-generated analyzer files (Max 15MB)
                </p>
                <div className="mt-4">
                  <span className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs">
                    Choose PDF File from Computer
                  </span>
                </div>
              </div>

              {/* Upload Confirmation Card (User prompt: "Maya_Patel_CBC_18Sep2026.pdf Upload complete") */}
              {uploadedFile && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {uploadedFile.name}
                      </div>
                      <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Upload complete • Ready for Pathologist Review</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{uploadedFile.size}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Test Parameter Values</span>
                <button
                  type="button"
                  onClick={handleAddParam}
                  className="inline-flex items-center gap-1 text-xs text-teal-700 font-bold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
              </div>

              <div className="space-y-2">
                {parameters.map((p, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => handleParameterChange(idx, 'name', e.target.value)}
                        placeholder="Parameter Name"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-800"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={p.value}
                        onChange={(e) => handleParameterChange(idx, 'value', e.target.value)}
                        placeholder="Value"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-bold text-slate-900"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={p.unit}
                        onChange={(e) => handleParameterChange(idx, 'unit', e.target.value)}
                        placeholder="Unit"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 text-[11px]"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={p.referenceRange}
                        onChange={(e) => handleParameterChange(idx, 'referenceRange', e.target.value)}
                        placeholder="Ref Range"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-500 text-[11px]"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveParam(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pathologist / Clinical Remarks
            </label>
            <textarea
              rows={2}
              value={clinicalRemarks}
              onChange={(e) => setClinicalRemarks(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
            />
          </div>

          {/* Footer action buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => setResultEntryPatient(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>Save & Proceed to Pathologist Review &rarr;</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
