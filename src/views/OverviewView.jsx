import React from 'react';
import { useLab } from '../context/LabContext.jsx';
import {
  Users,
  TestTube,
  FileCheck2,
  Send,
  Clock,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  PhoneCall,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const OverviewView = () => {
  const {
    currentUser,
    stats,
    patients,
    setIsRegisterOpen,
    setActiveTab,
    setCollectionPatient,
    setReviewApprovePatient,
    setDeliveryTrackerPatient,
    setPdfViewerPatient,
  } = useLab();

  // Filter queues
  const waitingCollection = patients.filter((p) => p.status === 'awaiting_sample');
  const inProcessing = patients.filter((p) => p.status === 'processing' || p.status === 'collected');
  const waitingApproval = patients.filter((p) => p.status === 'ready_for_review');
  const sentReports = patients.filter((p) => p.status === 'sent');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 2. Admin dashboard Greeting & Register Patient (Prompt specification) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Good morning, {currentUser?.name?.split(' ')[0] || 'Usman'}
            </span>
            <span className="bg-teal-50 text-teal-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-teal-200">
              {currentUser?.roleTitle || 'Lab Administrator'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Here is what needs your attention today in the diagnostic workflow.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Patient</span>
        </button>
      </div>

      {/* 5 Headline Numbers (Prompt specification) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Patients Today
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {stats.patientsToday}
          </div>
          <div className="text-[10px] text-teal-800 font-medium">+8 from yesterday</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Samples Collected
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {stats.samplesCollected}
          </div>
          <div className="text-[10px] text-teal-800 font-medium">94% collection rate</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Processing
          </div>
          <div className="text-2xl font-bold text-blue-700 tracking-tight">
            {stats.processing}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">In analyzer queue</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Reports Ready
          </div>
          <div className="text-2xl font-bold text-emerald-700 tracking-tight">
            {stats.reportsReady}
          </div>
          <div className="text-[10px] text-emerald-800 font-medium">Waiting approval</div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Reports Sent
          </div>
          <div className="text-2xl font-bold text-teal-700 tracking-tight">
            {stats.reportsSent}
          </div>
          <div className="text-[10px] text-teal-800 font-medium">Delivered to WhatsApp</div>
        </div>
      </div>

      {/* What needs attention today section (Prompt specification) */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>What needs attention today:</span>
          </div>
          <span className="text-[11px] font-semibold text-amber-800">High Priority</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Card 1 */}
          <div
            onClick={() => setActiveTab('review')}
            className="p-3 bg-white rounded-xl border border-amber-200/90 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>{stats.reportsWaitingApproval} reports waiting for review</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-[11px] text-slate-500">Pathologist sign-off required</p>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => setActiveTab('samples')}
            className="p-3 bg-white rounded-xl border border-amber-200/90 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>{stats.samplesWaitingCollection} samples waiting for collection</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-[11px] text-slate-500">Patients in waiting lounge</p>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => setActiveTab('sent')}
            className="p-3 bg-white rounded-xl border border-amber-200/90 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span className="text-rose-700">{stats.whatsappFailed} WhatsApp messages failed</span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <p className="text-[11px] text-slate-500">Need phone verify or resend</p>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => setActiveTab('patients')}
            className="p-3 bg-white rounded-xl border border-amber-200/90 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>{stats.phoneNeedsConfirmation} patient phone numbers need confirm</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-[11px] text-slate-500">Verify +92 WhatsApp number</p>
          </div>
        </div>
      </div>

      {/* Main 4 Action Queues (Prompt Sections) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Samples waiting for collection */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Samples Waiting for Collection
              </h2>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              {waitingCollection.length} waiting
            </span>
          </div>

          <div className="space-y-2">
            {waitingCollection.length > 0 ? (
              waitingCollection.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{p.name}</span>
                      <span className="text-amber-800 text-[10px] font-mono bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                        Token #{p.tokenNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {p.testType} • Age: {p.age} • Mobile: {p.mobile}
                    </div>
                  </div>
                  <button
                    onClick={() => setCollectionPatient(p)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] shadow-xs cursor-pointer"
                  >
                    Collect Specimen
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 p-4 text-center">
                All scheduled patients have had samples collected.
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Samples in processing */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TestTube className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Samples in Processing</h2>
            </div>
            <span className="text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
              {inProcessing.length} in lab
            </span>
          </div>

          <div className="space-y-2">
            {inProcessing.length > 0 ? (
              inProcessing.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{p.name}</span>
                      <span className="text-blue-800 text-[10px] font-mono bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                        #{p.tokenNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {p.testType} • Drawn at {p.sampleDetails?.collectedAt || '10:00 AM'}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('samples')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] shadow-xs cursor-pointer"
                  >
                    Update Status
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 p-4 text-center">
                No samples currently processing in analyzer.
              </p>
            )}
          </div>
        </div>

        {/* Section 3: Reports waiting for approval */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Reports Waiting for Approval
              </h2>
            </div>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
              {waitingApproval.length} ready
            </span>
          </div>

          <div className="space-y-2">
            {waitingApproval.length > 0 ? (
              waitingApproval.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{p.name}</span>
                      <span className="text-teal-800 text-[10px] font-mono bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded">
                        {p.reportDetails?.fileName || 'Report PDF'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {p.testType} • Uploaded at {p.reportDetails?.uploadedAt || '11:45 AM'}
                    </div>
                  </div>
                  <button
                    onClick={() => setReviewApprovePatient(p)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-xs cursor-pointer"
                  >
                    Review & Sign
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 p-4 text-center">
                All ready reports have been reviewed.
              </p>
            )}
          </div>
        </div>

        {/* Section 4: Reports already sent */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">Reports Sent on WhatsApp</h2>
            </div>
            <span className="text-xs font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full">
              {sentReports.length} sent
            </span>
          </div>

          <div className="space-y-2">
            {sentReports.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {p.testType} • Delivered {p.deliveryDetails?.whatsappSentAt || '02:18 PM'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPdfViewerPatient(p)}
                    className="px-2 py-1 bg-slate-200/70 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setDeliveryTrackerPatient(p)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[11px] shadow-xs cursor-pointer"
                  >
                    Track
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
