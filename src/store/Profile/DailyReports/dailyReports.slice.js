import { createSlice } from '@reduxjs/toolkit';
import { getInitialState } from './dailyReports.utils';
import {
  deleteDailyReport,
  getDailyReports,
  uploadDailyReport,
} from './dailyReports.thunks';

const initialState = getInitialState();

const upsertReport = (items, report) => {
  if (!report) return Array.isArray(items) ? items : [];

  const next = Array.isArray(items) ? [...items] : [];
  const index = next.findIndex((item) => item.id === report.id);

  if (index === -1) {
    next.unshift(report);
  } else {
    next[index] = report;
  }

  return next;
};

const dailyReportsSlice = createSlice({
  name: 'dailyReports',
  initialState,
  reducers: {
    clearDailyReportsError: (state) => {
      state.error = null;
    },
    clearDailyReportsMessage: (state) => {
      state.successMessage = null;
    },
    resetDailyReportsState: () => getInitialState(),
  },
  extraReducers: (builder) => {
    // SECTION - Upload daily Reports
    builder
      .addCase(uploadDailyReport.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadDailyReport.fulfilled, (state, action) => {
        const uploadedReport = action.payload?.data ?? null;
        const alreadyExists = state.dailyReportsItems.some(
          (item) => item.id === uploadedReport?.id,
        );

        state.uploadLoading = false;
        state.successMessage =
          action.payload?.message || 'Report uploaded successfully.';

        if (uploadedReport) {
          state.dailyReportsItems = upsertReport(
            state.dailyReportsItems,
            uploadedReport,
          );

          if (!alreadyExists) {
            state.meta.total += 1;
          }
        }
      })
      .addCase(uploadDailyReport.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload || 'Upload failed.';
      });

      // SECTION - Get Daily Reports
      builder.addCase(getDailyReports.pending, (s) => {
        s.reportsLoading = true;
        s.error = null;
      })
      .addCase(getDailyReports.fulfilled, (s, a) => {
        s.reportsLoading = false;
        s.dailyReportsItems = a.payload?.items ?? [];
        s.meta = a.payload?.meta ?? s.meta;
      })
      .addCase(getDailyReports.rejected, (s, a) => {
        s.reportsLoading = false;
        s.error = a.payload || a.error.message || 'Something went wrong';
      })
      .addCase(deleteDailyReport.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteDailyReport.fulfilled, (state, action) => {
        const deletedId = action.payload;

        state.dailyReportsItems = state.dailyReportsItems.filter(
          (item) => item.id !== deletedId,
        );
        state.meta.total = Math.max(0, state.meta.total - 1);
        state.successMessage = 'Report deleted successfully.';
      })
      .addCase(deleteDailyReport.rejected, (state, action) => {
        state.error = action.payload || 'Delete failed.';
      })
  },
});

export const {
  clearDailyReportsError,
  clearDailyReportsMessage,
  resetDailyReportsState,
} = dailyReportsSlice.actions;

export default dailyReportsSlice.reducer;
