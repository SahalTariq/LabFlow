// src/store/slices/uiSlice.js - Redux Toolkit Slice for UI, Modals, Stats, & Notifications
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchStats = createAsyncThunk(
  'ui/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      const json = await res.json();
      return json.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeTab: 'overview',
    searchQuery: '',
    stats: {
      patientsToday: 48,
      samplesCollected: 36,
      processing: 8,
      reportsReady: 12,
      reportsSent: 24,
      samplesWaitingCollection: 4,
      reportsWaitingApproval: 12,
      whatsappFailed: 3,
      phoneNeedsConfirmation: 2
    },
    // Modals
    isRegisterOpen: false,
    receiptPatient: null,
    collectionPatient: null,
    resultEntryPatient: null,
    reviewApprovePatient: null,
    sendWhatsAppPatient: null,
    deliveryTrackerPatient: null,
    detailPatient: null,
    pdfViewerPatient: null,
    isLoginModalOpen: false,

    // Toast Notifications
    friendlyNotification: null
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    adjustStat: (state, action) => {
      const { key, delta } = action.payload;
      if (typeof state.stats[key] === 'number') {
        state.stats[key] = Math.max(0, state.stats[key] + delta);
      }
    },
    setRegisterOpen: (state, action) => {
      state.isRegisterOpen = action.payload;
    },
    setReceiptPatient: (state, action) => {
      state.receiptPatient = action.payload;
    },
    setCollectionPatient: (state, action) => {
      state.collectionPatient = action.payload;
    },
    setResultEntryPatient: (state, action) => {
      state.resultEntryPatient = action.payload;
    },
    setReviewApprovePatient: (state, action) => {
      state.reviewApprovePatient = action.payload;
    },
    setSendWhatsAppPatient: (state, action) => {
      state.sendWhatsAppPatient = action.payload;
    },
    setDeliveryTrackerPatient: (state, action) => {
      state.deliveryTrackerPatient = action.payload;
    },
    setDetailPatient: (state, action) => {
      state.detailPatient = action.payload;
    },
    setPdfViewerPatient: (state, action) => {
      state.pdfViewerPatient = action.payload;
    },
    setLoginModalOpen: (state, action) => {
      state.isLoginModalOpen = action.payload;
    },
    setFriendlyNotification: (state, action) => {
      state.friendlyNotification = action.payload;
    },
    clearFriendlyNotification: (state) => {
      state.friendlyNotification = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStats.fulfilled, (state, action) => {
      if (action.payload) {
        state.stats = { ...state.stats, ...action.payload };
      }
    });
  }
});

export const {
  setActiveTab,
  setSearchQuery,
  setStats,
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
} = uiSlice.actions;

export const selectActiveTab = (state) => state.ui.activeTab;
export const selectSearchQuery = (state) => state.ui.searchQuery;
export const selectStats = (state) => state.ui.stats;
export const selectModals = (state) => ({
  isRegisterOpen: state.ui.isRegisterOpen,
  receiptPatient: state.ui.receiptPatient,
  collectionPatient: state.ui.collectionPatient,
  resultEntryPatient: state.ui.resultEntryPatient,
  reviewApprovePatient: state.ui.reviewApprovePatient,
  sendWhatsAppPatient: state.ui.sendWhatsAppPatient,
  deliveryTrackerPatient: state.ui.deliveryTrackerPatient,
  detailPatient: state.ui.detailPatient,
  pdfViewerPatient: state.ui.pdfViewerPatient,
  isLoginModalOpen: state.ui.isLoginModalOpen
});
export const selectFriendlyNotification = (state) => state.ui.friendlyNotification;

export default uiSlice.reducer;
