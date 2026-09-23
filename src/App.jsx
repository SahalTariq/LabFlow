import React from 'react';
import { LabProvider, useLab } from './context/LabContext.jsx';
import { Header } from './components/Header.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { LoginModal } from './components/LoginModal.jsx';
import { RegisterPatientModal } from './components/RegisterPatientModal.jsx';
import { PrintReceiptModal } from './components/PrintReceiptModal.jsx';
import { SampleCollectionModal } from './components/SampleCollectionModal.jsx';
import { ResultEntryModal } from './components/ResultEntryModal.jsx';
import { ReviewApproveModal } from './components/ReviewApproveModal.jsx';
import { SendWhatsAppModal } from './components/SendWhatsAppModal.jsx';
import { DeliveryTrackerModal } from './components/DeliveryTrackerModal.jsx';
import { PatientDetailModal } from './components/PatientDetailModal.jsx';
import { LabReportPdfViewer } from './components/LabReportPdfViewer.jsx';

import { OverviewView } from './views/OverviewView.jsx';
import { PatientsView } from './views/PatientsView.jsx';
import { SampleBoardView } from './views/SampleBoardView.jsx';
import { ReportsToReviewView } from './views/ReportsToReviewView.jsx';
import { SentReportsView } from './views/SentReportsView.jsx';
import { PatientPortalView } from './views/PatientPortalView.jsx';
import { HelpGuideView } from './views/HelpGuideView.jsx';
import { SettingsView } from './views/SettingsView.jsx';

import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const LabFlowApp = () => {
  const { activeTab, friendlyNotification } = useLab();

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col font-sans">
      {/* Toast Notification */}
      {friendlyNotification && (
        <div className="fixed top-4 right-4 z-70 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 ${
              friendlyNotification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : friendlyNotification.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : friendlyNotification.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-teal-50 border-teal-200 text-teal-900'
            }`}
          >
            {friendlyNotification.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            {friendlyNotification.type === 'warning' && (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            {friendlyNotification.type === 'info' && (
              <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs font-medium leading-relaxed flex-1">
              {friendlyNotification.message}
            </div>
          </div>
        </div>
      )}

      {/* Global Top Navigation Header */}
      <Header />

      {/* App Body: Sidebar + Active View */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-slate-100/50 min-h-[calc(100vh-65px)]">
          {activeTab === 'overview' && <OverviewView />}
          {activeTab === 'patients' && <PatientsView />}
          {activeTab === 'samples' && <SampleBoardView />}
          {activeTab === 'review' && <ReportsToReviewView />}
          {activeTab === 'sent' && <SentReportsView />}
          {activeTab === 'portal' && <PatientPortalView />}
          {activeTab === 'help' && <HelpGuideView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals for complete 9-step laboratory lifecycle */}
      <LoginModal />
      <RegisterPatientModal />
      <PrintReceiptModal />
      <SampleCollectionModal />
      <ResultEntryModal />
      <ReviewApproveModal />
      <SendWhatsAppModal />
      <DeliveryTrackerModal />
      <PatientDetailModal />
      <LabReportPdfViewer />
    </div>
  );
};

export const App = () => {
  return (
    <LabProvider>
      <LabFlowApp />
    </LabProvider>
  );
};

export default App;
