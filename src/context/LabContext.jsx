// src/context/LabContext.jsx - React-Redux connector & hook using Redux Toolkit
import React, { createContext, useContext, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '../store/index.js';
import {
  selectPatients,
  selectPatientsLoading,
  fetchPatients,
  registerPatientApi,
  patientRegistered,
  collectSampleApi,
  sampleCollected,
  updateSampleStatusApi,
  sampleStatusUpdated,
  saveResultsApi,
  resultsSaved,
  approveReportApi,
  reportApproved,
  sendWhatsAppApi,
  whatsAppSent,
  resendWhatsAppApi,
  whatsAppResent,
  updatePhoneApi,
  patientPhoneUpdated,
  patientPortalActionApi,
  patientPortalOpened,
  patientPortalDownloaded,
  resetDemoDataApi
} from '../store/slices/patientsSlice.js';
import {
  selectCurrentUser,
  selectIsLoggedIn,
  selectStaffUsers,
  loginStaff,
  switchStaff as switchStaffAction,
  logout as logoutAction
} from '../store/slices/authSlice.js';
import {
  selectActiveTab,
  selectSearchQuery,
  selectStats,
  selectFriendlyNotification,
  fetchStats,
  setActiveTab as setActiveTabAction,
  setSearchQuery as setSearchQueryAction,
  adjustStat,
  setRegisterOpen,
  setReceiptPatient,
  setCollectionPatient,
  setResultEntryPatient,
  setReviewApprovePatient,
  setSendWhatsAppPatient,
  setDeliveryTrackerPatient,
  setDetailPatient,
  setPdfViewerPatient,
  setLoginModalOpen,
  setFriendlyNotification,
  clearFriendlyNotification
} from '../store/slices/uiSlice.js';

const LabContext = createContext(null);

const LabInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPatients());
    dispatch(fetchStats());
  }, [dispatch]);

  return <>{children}</>;
};

export const LabProvider = ({ children }) => {
  return <LabInitializer>{children}</LabInitializer>;
};

export const useLab = () => {
  const dispatch = useDispatch();

  // Redux Selectors
  const patients = useSelector(selectPatients);
  const loading = useSelector(selectPatientsLoading);
  const currentUser = useSelector(selectCurrentUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const staffUsers = useSelector(selectStaffUsers);

  const activeTab = useSelector(selectActiveTab);
  const searchQuery = useSelector(selectSearchQuery);
  const stats = useSelector(selectStats);
  const friendlyNotification = useSelector(selectFriendlyNotification);

  const isRegisterOpen = useSelector((s) => s.ui.isRegisterOpen);
  const receiptPatient = useSelector((s) => s.ui.receiptPatient);
  const collectionPatient = useSelector((s) => s.ui.collectionPatient);
  const resultEntryPatient = useSelector((s) => s.ui.resultEntryPatient);
  const reviewApprovePatient = useSelector((s) => s.ui.reviewApprovePatient);
  const sendWhatsAppPatient = useSelector((s) => s.ui.sendWhatsAppPatient);
  const deliveryTrackerPatient = useSelector((s) => s.ui.deliveryTrackerPatient);
  const detailPatient = useSelector((s) => s.ui.detailPatient);
  const pdfViewerPatient = useSelector((s) => s.ui.pdfViewerPatient);
  const isLoginModalOpen = useSelector((s) => s.ui.isLoginModalOpen);

  // Friendly toast notifications
  const showNotification = (message, type = 'info') => {
    dispatch(setFriendlyNotification({ message, type }));
    setTimeout(() => {
      dispatch(clearFriendlyNotification());
    }, 4500);
  };

  // Tab & Search setters
  const setActiveTab = (tab) => dispatch(setActiveTabAction(tab));
  const setSearchQuery = (query) => dispatch(setSearchQueryAction(query));

  // Auth actions
  const login = async (identifier, pass, role) => {
    try {
      const resultAction = await dispatch(loginStaff({ identifier, password: pass, role }));
      if (loginStaff.fulfilled.match(resultAction)) {
        dispatch(setLoginModalOpen(false));
        showNotification(
          `Welcome back, ${resultAction.payload.name.split(' ')[0]}! Logged in as ${resultAction.payload.roleTitle}.`,
          'success'
        );
        return true;
      }
    } catch {
      // Local fallback in slice
    }
    return true;
  };

  const logout = () => {
    dispatch(logoutAction());
    dispatch(setLoginModalOpen(true));
    showNotification('Logged out successfully. Authorized staff only.', 'info');
  };

  const switchStaff = (staffId) => {
    const s = staffUsers.find((u) => u.id === staffId);
    dispatch(switchStaffAction(staffId));
    if (s) {
      showNotification(`Switched role to ${s.name} (${s.roleTitle})`, 'info');
    }
  };

  // Register Patient (Optimistic + Redux + Backend sync)
  const registerPatient = async (data) => {
    const nextToken =
      patients.length > 0
        ? Math.max(...patients.map((p) => p.tokenNumber || 0)) + 1
        : 49;
    const newId = `LF-${1000 + nextToken}`;
    const newPatient = {
      _id: newId,
      id: newId,
      tokenNumber: nextToken,
      ...data,
      status: 'awaiting_sample',
      previousReports: []
    };

    // Redux optimistic actions
    dispatch(patientRegistered(data));
    dispatch(adjustStat({ key: 'patientsToday', delta: 1 }));
    dispatch(adjustStat({ key: 'samplesWaitingCollection', delta: 1 }));

    // Redux API thunk
    dispatch(registerPatientApi(data));

    showNotification(
      `Patient ${newPatient.name} (Token #${newPatient.tokenNumber}) registered successfully.`,
      'success'
    );
    return newPatient;
  };

  // Mark Sample Collected
  const markSampleCollected = async (patientId, details) => {
    dispatch(sampleCollected({ patientId, details }));
    dispatch(adjustStat({ key: 'samplesCollected', delta: 1 }));
    dispatch(adjustStat({ key: 'samplesWaitingCollection', delta: -1 }));
    dispatch(collectSampleApi({ patientId, details }));
    showNotification('Sample marked collected and barcode generated.', 'success');
  };

  // Update Sample Status
  const updateSampleStatus = async (patientId, status, reason = '') => {
    dispatch(sampleStatusUpdated({ patientId, status, reason }));
    dispatch(updateSampleStatusApi({ patientId, status, reason }));
    showNotification(`Sample status updated to ${status.replace(/_/g, ' ')}.`, 'info');
  };

  // Save Report Details
  const saveReportDetails = async (patientId, details) => {
    dispatch(resultsSaved({ patientId, details }));
    dispatch(adjustStat({ key: 'reportsReady', delta: 1 }));
    dispatch(adjustStat({ key: 'reportsWaitingApproval', delta: 1 }));
    dispatch(saveResultsApi({ patientId, details }));
    showNotification('Test results and report saved successfully.', 'success');
  };

  // Pathologist Approval
  const approveReport = async (patientId, approverName) => {
    dispatch(reportApproved({ patientId, approverName }));
    dispatch(approveReportApi({ patientId, approverName }));
    showNotification('Report verified and approved for WhatsApp dispatch.', 'success');
  };

  // Send WhatsApp Report
  const sendWhatsAppReport = async (patientId) => {
    dispatch(whatsAppSent({ patientId }));
    dispatch(adjustStat({ key: 'reportsSent', delta: 1 }));
    dispatch(adjustStat({ key: 'reportsWaitingApproval', delta: -1 }));
    dispatch(sendWhatsAppApi(patientId));
    showNotification('Report sent via WhatsApp successfully!', 'success');
  };

  // Resend WhatsApp Report
  const resendWhatsAppReport = async (patientId) => {
    dispatch(whatsAppResent({ patientId }));
    dispatch(resendWhatsAppApi(patientId));
    showNotification('WhatsApp report link re-dispatched to patient.', 'info');
  };

  // Update Patient Phone
  const updatePatientPhone = async (patientId, newPhone) => {
    dispatch(patientPhoneUpdated({ patientId, mobile: newPhone }));
    dispatch(updatePhoneApi({ patientId, mobile: newPhone }));
    showNotification("Patient's WhatsApp phone number updated.", 'success');
  };

  // Simulate Patient Portal Open / Download
  const simulatePatientOpen = async (patientId) => {
    dispatch(patientPortalOpened({ patientId }));
    dispatch(patientPortalActionApi({ patientId, action: 'open' }));
  };

  const simulatePatientDownload = async (patientId) => {
    dispatch(patientPortalDownloaded({ patientId }));
    dispatch(patientPortalActionApi({ patientId, action: 'download' }));
  };

  // Reset Demo Data
  const resetDemoData = async () => {
    try {
      await dispatch(resetDemoDataApi());
      dispatch(fetchPatients());
      dispatch(fetchStats());
      showNotification('Laboratory demo data reset to default.', 'info');
    } catch {
      showNotification('Reset failed.', 'warning');
    }
  };

  return {
    // Redux State
    patients,
    loading,
    currentUser,
    isLoggedIn,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    staffUsers,
    stats,

    // Redux Actions
    login,
    logout,
    switchStaff,
    registerPatient,
    markSampleCollected,
    updateSampleStatus,
    saveReportDetails,
    approveReport,
    sendWhatsAppReport,
    resendWhatsAppReport,
    updatePatientPhone,
    simulatePatientOpen,
    simulatePatientDownload,
    resetDemoData,

    // Modal & Toast Selectors / Setters
    isRegisterOpen,
    setIsRegisterOpen: (val) => dispatch(setRegisterOpen(val)),
    receiptPatient,
    setReceiptPatient: (val) => dispatch(setReceiptPatient(val)),
    collectionPatient,
    setCollectionPatient: (val) => dispatch(setCollectionPatient(val)),
    resultEntryPatient,
    setResultEntryPatient: (val) => dispatch(setResultEntryPatient(val)),
    reviewApprovePatient,
    setReviewApprovePatient: (val) => dispatch(setReviewApprovePatient(val)),
    sendWhatsAppPatient,
    setSendWhatsAppPatient: (val) => dispatch(setSendWhatsAppPatient(val)),
    deliveryTrackerPatient,
    setDeliveryTrackerPatient: (val) => dispatch(setDeliveryTrackerPatient(val)),
    detailPatient,
    setDetailPatient: (val) => dispatch(setDetailPatient(val)),
    pdfViewerPatient,
    setPdfViewerPatient: (val) => dispatch(setPdfViewerPatient(val)),
    isLoginModalOpen,
    setIsLoginModalOpen: (val) => dispatch(setLoginModalOpen(val)),
    friendlyNotification,
    showNotification
  };
};

export default LabContext;
