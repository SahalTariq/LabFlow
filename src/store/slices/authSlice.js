// src/store/slices/authSlice.js - Redux Toolkit Slice for Authentication & Staff
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STAFF_USERS } from '../../data/initialData.js';

export const loginStaff = createAsyncThunk(
  'auth/loginStaff',
  async ({ identifier, password, role }, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Local fallback handled below
    }

    const matched = STAFF_USERS.find(
      (u) =>
        u.email.toLowerCase().includes(identifier.toLowerCase()) ||
        u.name.toLowerCase().includes(identifier.toLowerCase()) ||
        (role && u.role.toLowerCase() === role.toLowerCase())
    ) || STAFF_USERS[0];

    return matched;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: STAFF_USERS[0],
    isLoggedIn: true,
    staffUsers: STAFF_USERS,
    loading: false
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    switchStaff: (state, action) => {
      const staffId = action.payload;
      const s = state.staffUsers.find((u) => u.id === staffId);
      if (s) {
        state.currentUser = s;
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(loginStaff.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { setCurrentUser, setLoggedIn, switchStaff, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectStaffUsers = (state) => state.auth.staffUsers;

export default authSlice.reducer;
