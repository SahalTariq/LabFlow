import React from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  TestTube,
  Clock,
  CheckCircle,
  FileCheck2,
  Send,
  AlertTriangle,
  ArrowRight,
  User,
  Plus,
} from 'lucide-react';

export const SampleBoardView = () => {
  const {
    patients,
    updateSampleStatus,
    setCollectionPatient,
    setResultEntryPatient,
    setReviewApprovePatient,
    setDeliveryTrackerPatient,
    setDetailPatient,
  } = useLab();

  // 6 color-coded columns per prompt section 5
  const columns = [
    {
      id: 'registered',
      title: 'Registered',
      colorBadge: 'bg-slate-200 text-slate-800 border-slate-300',
      description: 'Intake logged in system',
      filter: (p) => p.status === 'registered',
    },
    {
      id: 'awaiting_sample',
      title: 'Awaiting Sample',
      colorBadge: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Patient in collection lounge',
      filter: (p) => p.status === 'awaiting_sample',
    },
    {
      id: 'collected',
      title: 'Collected',
      colorBadge: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      description: 'Tube labeled & drawn',
      filter: (p) => p.status === 'collected',
    },
    {
      id: 'processing',
      title: 'Processing',
      colorBadge: 'bg-blue-100 text-blue-900 border-blue-300',
      description: 'Inside clinical analyzer',
      filter: (p) => p.status === 'processing',
    },
    {
      id: 'ready_for_review',
      title: 'Ready for Review',
      colorBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: 'Awaiting pathologist sign',
      filter: (p) => p.status === 'ready_for_review',
    },
    {
      id: 'sent',
      title: 'Sent to Patient',
      colorBadge: 'bg-purple-100 text-purple-900 border-purple-300',
      description: 'WhatsApp link dispatched',
      filter: (p) => p.status === 'sent',
    },
    {
      id: 'needs_attention',
      title: 'Needs Attention',
      colorBadge: 'bg-rose-100 text-rose-900 border-rose-300',
      description: 'Delivery error or phone mismatch',
      filter: (p) => p.status === 'needs_attention',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-teal-700" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Sample Processing Pipeline Board
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Step 5: Visual workflow board tracking specimen tube journey from collection to analysis.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="font-bold text-slate-400 uppercase">Colors:</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">Grey: Registered</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-200">Yellow: Awaiting</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold border border-blue-200">Blue: Processing</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">Green: Review</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold border border-purple-200">Purple: Sent</span>
          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold border border-rose-200">Red: Attention</span>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 items-start">
        {columns.map((col) => {
          const colPatients = patients.filter(col.filter);

          return (
            <div
              key={col.id}
              className="w-72 shrink-0 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col max-h-[78vh]"
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white rounded-t-2xl">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <span>{col.title}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${col.colorBadge}`}>
                      {colPatients.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{col.description}</p>
                </div>
              </div>

              {/* Cards List */}
              <div className="p-3 space-y-2.5 overflow-y-auto flex-1">
                {colPatients.length > 0 ? (
                  colPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{patient.name}</span>
                        <span className="font-mono text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                          #{patient.tokenNumber}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 font-medium">
                        {patient.testType}
                      </div>

                      {patient.sampleDetails && (
                        <div className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100 space-y-0.5">
                          <div><strong>Tube:</strong> {patient.sampleDetails.tubeType}</div>
                          <div><strong>Drawn at:</strong> {patient.sampleDetails.collectedAt} by {patient.sampleDetails.technician}</div>
                        </div>
                      )}

                      {patient.needsAttentionReason && (
                        <div className="p-1.5 bg-rose-50 border border-rose-200 rounded text-[10px] text-rose-900 leading-tight">
                          ⚠️ {patient.needsAttentionReason}
                        </div>
                      )}

                      {/* Transition Action Trigger */}
                      <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                        <button
                          onClick={() => setDetailPatient(patient)}
                          className="text-[10px] text-slate-500 hover:text-slate-800 font-medium"
                        >
                          View Details
                        </button>

                        {/* Stage Progression Buttons */}
                        {patient.status === 'awaiting_sample' && (
                          <button
                            onClick={() => setCollectionPatient(patient)}
                            className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px]"
                          >
                            Collect &rarr;
                          </button>
                        )}

                        {patient.status === 'collected' && (
                          <button
                            onClick={() => updateSampleStatus(patient.id, 'processing')}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px]"
                          >
                            Send to Analyzer &rarr;
                          </button>
                        )}

                        {patient.status === 'processing' && (
                          <button
                            onClick={() => setResultEntryPatient(patient)}
                            className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded font-bold text-[10px]"
                          >
                            Enter Results &rarr;
                          </button>
                        )}

                        {patient.status === 'ready_for_review' && (
                          <button
                            onClick={() => setReviewApprovePatient(patient)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px]"
                          >
                            Review & Sign &rarr;
                          </button>
                        )}

                        {patient.status === 'sent' && (
                          <button
                            onClick={() => setDeliveryTrackerPatient(patient)}
                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold text-[10px]"
                          >
                            Track &rarr;
                          </button>
                        )}

                        {patient.status === 'needs_attention' && (
                          <button
                            onClick={() => setDeliveryTrackerPatient(patient)}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-[10px]"
                          >
                            Resolve Alert &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-[11px] text-slate-400">
                    No samples
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
