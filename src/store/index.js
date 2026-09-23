// src/store/index.js - Redux Toolkit Store Configuration
import { configureStore } from '@reduxjs/toolkit';
import patientsReducer from './slices/patientsSlice.js';
import authReducer from './slices/authSlice.js';
import uiReducer from './slices/uiSlice.js';

export const store = configureStore({
  reducer: {
    patients: patientsReducer,
    auth: authReducer,
    ui: uiReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
