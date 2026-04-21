import { createSlice } from '@reduxjs/toolkit';
import {
  getProjectReports,
  getUserReports,
  getUserProjectReports,
} from './projectReports.thunk';

const initialState = {
  reports: [],
  loading: false,
  error: null,
  links: null,
  meta: null,
  total: 0,
};

const projectReportsSlice = createSlice({
  name: 'projectReport',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjectReports.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(getProjectReports.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.reports = action.payload.reports;
        state.links = action.payload.links;
        state.meta = action.payload.meta;
        state.total = action.payload.total;
      })
      .addCase(getProjectReports.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message || 'Something wnet wrong';
      });

    builder
      .addCase(getUserProjectReports.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(getUserProjectReports.fulfilled, (s, a) => {
        s.loading = false;
        s.error = null;
        s.reports = a.payload?.reports || [];
        s.total = a.payload?.total || 0;
        s.links = a.payload?.links || null;
        s.meta = a.payload?.meta || null;
      })
      .addCase(getUserProjectReports.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message || 'Something wnet wrong';
      });

    builder
      .addCase(getUserReports.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(getUserReports.fulfilled, (s, a) => {
        s.loading = false;
        s.error = null;
        s.reports = a.payload?.reports || [];
        s.total = a.payload?.total || 0;
        s.links = a.payload?.links || null;
        s.meta = a.payload?.meta || null;
      })
      .addCase(getUserReports.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message || 'Something wnet wrong';
      });
  },
});

export default projectReportsSlice.reducer;
