import { createSlice } from '@reduxjs/toolkit';
import { getQuickAccessReports } from './quickAccess.thunks';

const initialState = {
  projectId: null,
  items: [],
  loading: false,
  error: null,
};

const quickAccessSlice = createSlice({
  name: 'quickAccess',
  initialState,
  reducers: {
    clearQuickAccessState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQuickAccessReports.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.projectId = String(action.meta?.arg ?? '');
      })
      .addCase(getQuickAccessReports.fulfilled, (state, action) => {
        state.loading = false;
        state.projectId = action.payload?.projectId ?? state.projectId;
        state.items = action.payload?.items ?? [];
      })
      .addCase(getQuickAccessReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Load failed.';
        state.items = [];
      });
  },
});

export const { clearQuickAccessState } = quickAccessSlice.actions;
export default quickAccessSlice.reducer;
