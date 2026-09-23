// src/store/slices/patientsSlice.js - Redux Toolkit Slice for Patients
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INITIAL_PATIENTS } from '../../data/initialData.js';

// Async Thunks connecting to Express REST API
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/patients');
      if (!res.ok) throw new Error('Failed to fetch patients');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerPatientApi = createAsyncThunk(
  'patients/registerPatientApi',
  async (patientData, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.message || 'Registration failed');
      }
      const json = await res.json();
      return json.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const collectSampleApi = createAsyncThunk(
  'patients/collectSampleApi',
  async ({ patientId, details }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/patients/${patientId}/sample`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      const json = await res.json();
      return { patientId, data: json.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateSampleStatusApi = createAsyncThunk(
  'patients/updateSampleStatusApi',
  async ({ patientId, status, reason }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/patients/${patientId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, needsAttentionReason: reason })
      });
      const json = await res.json();
      return { patientId, data: json.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveResultsApi = createAsyncThunk(
  'patients/saveResultsApi',
  async ({ patientId, details }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/patients/${patientId}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      const json = await res.json();
      return { patientId, data: json.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const approveReportApi = createAsyncThunk(
  'patients/approveReportApi',
  async ({ patientId, approverName }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/patients/${patientId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approverName })
      });
      const json = await res.json();
      return { patientId, data: json.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const sendWhatsAppApi = createAsyncThunk(
  'patients/sendWhatsAppApi',
  async (patientId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/patients/${patientId}/whatsapp`, { method: 'POST' });
      const json = await res.json();
      return { patientId, data: json.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const resendWhatsAppApi = createAsyncThunk(
  'patients/resendWhatsAppApi',
  async (patientId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/patients/${patientId}/resend`, { method: 'POST' });
      const json = await res.json();
      return { patientId, data: json.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updatePhoneApi = createAsyncThunk(
  'patients/updatePhoneApi',
  async ({ patientId, mobile }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/patients/${patientId}/phone`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      });
      const json = await res.json();
      return { patientId, data: json.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const patientPortalActionApi = createAsyncThunk(
  'patients/patientPortalActionApi',
  async ({ patientId, action }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/patients/${patientId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const json = await res.json();
      return { patientId, action, data: json.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const resetDemoDataApi = createAsyncThunk(
  'patients/resetDemoDataApi',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/patients/reset', { method: 'POST' });
      const json = await res.json();
      return json.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const patientsSlice = createSlice({
  name: 'patients',
  initialState: {
    items: INITIAL_PATIENTS,
    loading: false,
    error: null
  },
  reducers: {
    // Optimistic addition
    patientRegistered: (state, action) => {
      const nextToken = state.items.length > 0
        ? Math.max(...state.items.map((p) => p.tokenNumber || 0)) + 1
        : 49;
      const newId = `LF-${1000 + nextToken}`;
      const newPatient = {
        _id: newId,
        id: newId,
        tokenNumber: nextToken,
        ...action.payload,
        status: 'awaiting_sample',
        previousReports: []
      };
      state.items.unshift(newPatient);
    },

    // Sample marked collected
    sampleCollected: (state, action) => {
      const { patientId, details } = action.payload;
      const patient = state.items.find((p) => p.id === patientId || p._id === patientId);
      if (patient) {
        patient.status = 'collected';
        patient.sampleDetails = details;
      }
    },

    // Sample status updated (e.g. processing, ready_for_review, needs_attention)
    sampleStatusUpdated: (state, action) => {
      const { patientId, status, reason } = action.payload;
      const patient = state.items.find((p) => p.id === patientId || p._id === patientId);
      if (patient) {
        patient.status = status;
        if (reason !== undefined) {
          patient.needsAttentionReason = reason;
        }
      }
    },

    // Test results entered
    resultsSaved: (state, action) => {
      const { patientId, details } = action.payload;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const patient = state.items.find((p) => p.id === patientId || p._id === patientId);
      if (patient) {
        patient.status = 'ready_for_review';
        patient.reportDetails = {
          ...(patient.reportDetails || {}),
          ...details,
          reportId: patient.reportDetails?.reportId || `REP-${patient.tokenNumber}`,
          uploadedAt: patient.reportDetails?.uploadedAt || timeStr,
          isPdfReady: true
        };
      }
    },

    // Pathologist approval
    reportApproved: (state, action) => {
      const { patientId, approverName } = action.payload;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const patient = state.items.find((p) => p.id === patientId || p._id === patientId);
      if (patient) {
        patient.status = 'ready_for_review';
        patient.reportDetails = {
          ...(patient.reportDetails || {}),
          approvedAt: timeStr,
          approvedBy: approverName,
          isDraft: false
        };
      }
    },

    // WhatsApp sent
    whatsAppSent: (state, action) => {
      const { patientId } = action.payload;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const patient = state.items.find((p) => p.id === patientId || p._id === patientId);
      if (patient) {
        patient.status = 'sent';
        patient.deliveryDetails = {
          whatsappSentAt: timeStr,
          deliveredAt: timeStr,
          openedAt: null,
          downloadedAt: null,
          status: 'delivered',
          resendCount: 0
        };
      }
    },

    // WhatsApp re-sent
    whatsAppResent: (state, action) => {
      const { patientId } = action.payload;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const patient = state.items.find((p) => p.id === patientId || p._id === patientId);
      if (patient && patient.deliveryDetails) {
        patient.deliveryDetails.whatsappSentAt = timeStr;
        patient.deliveryDetails.resendCount = (patient.deliveryDetails.resendCount || 0) + 1;
      }
    },

    // Phone updated
    patientPhoneUpdated: (state, action) => {
      const { patientId, mobile } = action.payload;
      const patient = state.items.find((p) => p.id === patientId || p._id === patientId);
      if (patient) {
        patient.mobile = mobile;
      }
    },

    // Patient portal opened
    patientPortalOpened: (state, action) => {
      const { patientId } = action.payload;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const patient = state.items.find((p) => p.id === patientId || p._id === patientId);
      if (patient && patient.deliveryDetails) {
        patient.deliveryDetails.openedAt = timeStr;
        patient.deliveryDetails.status = 'opened';
      }
    },

    // Patient portal downloaded
    patientPortalDownloaded: (state, action) => {
      const { patientId } = action.payload;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const patient = state.items.find((p) => p.id === patientId || p._id === patientId);
      if (patient && patient.deliveryDetails) {
        patient.deliveryDetails.downloadedAt = timeStr;
        patient.deliveryDetails.status = 'downloaded';
      }
    },

    // Reset patients state directly
    setPatientsState: (state, action) => {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchPatients
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload;
        }
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // registerPatientApi
      .addCase(registerPatientApi.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.items.findIndex(
            (p) => p.id === action.payload.id || p._id === action.payload._id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      })

      // resetDemoDataApi
      .addCase(resetDemoDataApi.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload;
        } else {
          state.items = INITIAL_PATIENTS;
        }
      });
  }
});

export const {
  patientRegistered,
  sampleCollected,
  sampleStatusUpdated,
  resultsSaved,
  reportApproved,
  whatsAppSent,
  whatsAppResent,
  patientPhoneUpdated,
  patientPortalOpened,
  patientPortalDownloaded,
  setPatientsState
} = patientsSlice.actions;

export const selectPatients = (state) => state.patients.items;
export const selectPatientsLoading = (state) => state.patients.loading;

export default patientsSlice.reducer;
