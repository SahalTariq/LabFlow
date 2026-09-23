import React, { useState } from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  TestTube,
  X,
  User,
  Clock,
  CheckCircle,
  FlaskConical,
  AlertTriangle,
} from 'lucide-react';

export const SampleCollectionModal = () => {
  const {
    collectionPatient,
    setCollectionPatient,
    markSampleCollected,
    currentUser,
    setResultEntryPatient,
  } = useLab();

  const [sampleType, setSampleType] = useState('Blood');
  const [tubeType, setTubeType] = useState('EDTA Purple Tube (K2 EDTA)');
  const [technician, setTechnician] = useState(
    currentUser?.role === 'technician' ? currentUser.name : 'Muhammad Bilal Khan (BS-MLT)'
  );
  const [sampleCondition, setSampleCondition] = useState('Good');
  const [notes, setNotes] = useState('');

  if (!collectionPatient) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    markSampleCollected(collectionPatient.id, {
      sampleType,
      collectedAt: timeStr,
      technician,
      tubeType,
      sampleCondition,
      notes: notes.trim() || undefined,
    });

    const curr = collectionPatient;
    setCollectionPatient(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-teal-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center border border-teal-600">
              <TestTube className="w-4 h-4 text-teal-100" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Record Sample Collection</h2>
              <p className="text-[11px] text-teal-100">Step 4: Phlebotomist Specimen Intake</p>
            </div>
          </div>
          <button
            onClick={() => setCollectionPatient(null)}
            className="text-teal-200 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Reference Summary Banner */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient</span>
            <span className="font-bold text-slate-800">{collectionPatient.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Token / ID</span>
            <span className="font-mono font-bold text-teal-800">
              #{collectionPatient.tokenNumber} ({collectionPatient.id})
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Gender</span>
            <span className="font-medium text-slate-700">
              {collectionPatient.age} Y / {collectionPatient.gender}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Test</span>
            <span className="font-bold text-slate-900 truncate block">
              {collectionPatient.testType}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sample Specimen Type
              </label>
              <select
                value={sampleType}
                onChange={(e) => setSampleType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Blood">Blood (Venous / Capillary)</option>
                <option value="Serum">Serum</option>
                <option value="Plasma">Plasma</option>
                <option value="Urine">Urine (Clean Catch Midstream)</option>
                <option value="Swab">Swab (Throat / Nasal)</option>
                <option value="Sputum">Sputum</option>
                <option value="Stool">Stool Specimen</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Container / Vacutainer Tube
              </label>
              <select
                value={tubeType}
                onChange={(e) => setTubeType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="EDTA Purple Tube (K2 EDTA)">EDTA Purple Tube (Hematology)</option>
                <option value="SST Gold Gel Tube (Clot Activator)">SST Gold Gel Tube (Biochemistry)</option>
                <option value="Plain Red Tube (No Additive)">Plain Red Tube (Serology)</option>
                <option value="Sodium Fluoride Grey Tube">Sodium Fluoride Grey Tube (Glucose)</option>
                <option value="Sodium Citrate Blue Tube">Sodium Citrate Blue Tube (Coagulation)</option>
                <option value="Sterile Urine Container">Sterile Container (Urine/Sputum)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Collecting Technician Name
              </label>
              <input
                type="text"
                required
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                placeholder="Technician name"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specimen Condition
              </label>
              <select
                value={sampleCondition}
                onChange={(e) => setSampleCondition(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Good">Good (Adequate volume, unhemolyzed)</option>
                <option value="Hemolyzed">Hemolyzed (Requires note)</option>
                <option value="Clotted">Clotted (Re-collection suggested)</option>
                <option value="Insufficient">Insufficient Quantity (QNS)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phlebotomist Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Clean draw right median cubital vein."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-center justify-between text-xs text-teal-900">
            <span className="font-semibold">Barcode Tag Generated:</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-teal-300 font-bold">
              BAR-{collectionPatient.id}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCollectionPatient(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark Sample Collected</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
