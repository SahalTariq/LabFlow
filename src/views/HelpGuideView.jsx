import React from 'react';
import {
  BookOpen,
  Lock,
  LayoutDashboard,
  UserPlus,
  TestTube,
  Activity,
  UploadCloud,
  FileCheck2,
  Send,
  Clock,
  Search,
  History,
  CheckCircle2,
} from 'lucide-react';

export const HelpGuideView = () => {
  const steps = [
    {
      num: 1,
      title: 'Administrator Login',
      icon: Lock,
      color: 'text-teal-700 bg-teal-50',
      summary: 'Secure login via registered mobile number or staff email, password or PIN, with role-based access for Admins, Pathologists, and Technicians.',
      tip: 'Staff credentials can be switched using the top-right profile avatar.',
    },
    {
      num: 2,
      title: 'Admin Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-700 bg-blue-50',
      summary: 'Provides an immediate morning overview of 5 core metrics: Patients Today, Samples Collected, Processing, Reports Ready, and Reports Sent.',
      tip: 'Check "What needs attention today" for urgent approval requests or WhatsApp delivery failures.',
    },
    {
      num: 3,
      title: 'Register Patient',
      icon: UserPlus,
      color: 'text-emerald-700 bg-emerald-50',
      summary: 'Capture patient demographic information: full name, NADRA CNIC, guardian name, city, age, gender, prescribed test, referring doctor with PM&DC number, and verified +92 WhatsApp mobile number. Records payment in PKR (Cash, JazzCash, Easypaisa).',
      tip: 'Immediately prints a token slip receipt in PKR with barcode for the phlebotomy collection desk.',
    },
    {
      num: 4,
      title: 'Record Test & Collect Sample',
      icon: TestTube,
      color: 'text-amber-700 bg-amber-50',
      summary: 'The phlebotomist marks the specimen intake, specifying specimen type (Blood, Serum, Urine), vacutainer tube (EDTA purple, SST gold), and draw timestamp.',
      tip: 'Sample is tagged with a unique barcode linked to the patient’s ID.',
    },
    {
      num: 5,
      title: 'Track Sample Status (Color-coded Pipeline)',
      icon: Activity,
      color: 'text-indigo-700 bg-indigo-50',
      summary: 'Visual Kanban pipeline tracking: Registered (Grey) → Awaiting Sample (Yellow) → Processing (Blue) → Ready for Review (Green) → Sent (Purple) → Needs Attention (Red).',
      tip: 'Move tubes between stages as analyzers complete their test runs.',
    },
    {
      num: 6,
      title: 'Enter or Upload Test Result',
      icon: UploadCloud,
      color: 'text-teal-700 bg-teal-50',
      summary: 'Upload scanned or auto-generated diagnostic PDF reports (e.g. Tariq_Mahmood_CBC_Report.pdf) or input specific parameter values with biological reference ranges.',
      tip: 'Add pathologist notes or clinical interpretations for physician review.',
    },
    {
      num: 7,
      title: 'Review and Approve Report',
      icon: FileCheck2,
      color: 'text-emerald-700 bg-emerald-50',
      summary: 'Pathologists complete a pre-sign checklist verifying patient identity, test investigation parameters, reference ranges, and WhatsApp number before signing.',
      tip: 'Requires deliberate confirmation before changing status to "Ready to Send".',
    },
    {
      num: 8,
      title: 'Send Report Through WhatsApp',
      icon: Send,
      color: 'text-teal-700 bg-teal-50',
      summary: 'Delivers the diagnostic report to the patient’s WhatsApp phone via official WhatsApp Business API (+92 Gateway) with personalized greeting and direct secure PDF access.',
      tip: 'Staff can edit and verify the +92 phone number if delivery fails.',
    },
    {
      num: 9,
      title: 'Track Delivery & Report History',
      icon: Clock,
      color: 'text-purple-700 bg-purple-50',
      summary: 'Real-time WhatsApp audit trail: Sent → Delivered (two grey ticks) → Opened by patient → Downloaded PDF. Allows one-click resend, link copying, or phone call.',
      tip: 'Clinical and reception staff across Pakistan can assist patients who have connectivity issues.',
    },
    {
      num: 10,
      title: 'Search & Manage Patients',
      icon: Search,
      color: 'text-blue-700 bg-blue-50',
      summary: 'Search and filter all registered patients by name, WhatsApp mobile number, LF-ID, token number, or prescribed diagnostic test.',
      tip: 'Use quick status filters to view patients awaiting sample collection or reports ready for review.',
    },
    {
      num: 11,
      title: 'Patient Report History Archive',
      icon: History,
      color: 'text-slate-700 bg-slate-100',
      summary: 'Complete historical timeline of all past diagnostic reports for returning patients, allowing rapid re-sending or comparative clinical reviews.',
      tip: 'Open any patient detail modal to view their complete multi-visit history.',
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-700" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              LabFlow Staff Operations & Training Guide
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete step-by-step laboratory workflow manual designed for village and district diagnostic center staff.
          </p>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                    Step {s.num}
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">{s.title}</h2>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{s.summary}</p>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-700 flex items-start gap-1.5">
                <span className="font-bold text-teal-800 shrink-0">💡 Staff Tip:</span>
                <span>{s.tip}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
