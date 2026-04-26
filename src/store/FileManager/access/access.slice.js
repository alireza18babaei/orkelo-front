import { createSlice } from '@reduxjs/toolkit';
import {
  getFileManagementAccessUsers,
  probeFileManagementSectionAccess,
  updateFileManagementAccessUsers,
} from './access.thunk';

const initialState = {
  companyId: null,
  members: [],
  selectedUserIds: [],
  status: 'idle',
  error: null,
  saveStatus: 'idle',
  saveError: null,
  accessProbeStatus: 'idle',
  accessProbeError: null,
  canView: false,
};

const fileManagementAccessSlice = createSlice({
  name: 'fileManagementAccess',
  initialState,
  reducers: {
    clearFileManagementAccessState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFileManagementAccessUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getFileManagementAccessUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.companyId = action.payload?.companyId ?? null;
        state.members = Array.isArray(action.payload?.members)
          ? action.payload.members
          : [];
        state.selectedUserIds = Array.isArray(action.payload?.selectedUserIds)
          ? action.payload.selectedUserIds
          : [];
        state.canView = true;
      })
      .addCase(getFileManagementAccessUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || { message: 'Failed to load access list' };
        state.members = [];
        state.selectedUserIds = [];
      });

    builder
      .addCase(updateFileManagementAccessUsers.pending, (state) => {
        state.saveStatus = 'loading';
        state.saveError = null;
      })
      .addCase(updateFileManagementAccessUsers.fulfilled, (state, action) => {
        const nextSelectedUserIds = Array.isArray(action.payload?.selectedUserIds)
          ? action.payload.selectedUserIds
          : [];
        const selectedMap = new Set(nextSelectedUserIds.map(String));

        state.saveStatus = 'succeeded';
        state.saveError = null;
        state.companyId = action.payload?.companyId ?? state.companyId;
        state.selectedUserIds = nextSelectedUserIds;
        state.members = (state.members || []).map((member) => ({
          ...member,
          hasFileManagementAccess:
            member?.role === 'company_owner'
              ? true
              : selectedMap.has(String(member?.id ?? '')),
        }));
      })
      .addCase(updateFileManagementAccessUsers.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.saveError = action.payload || {
          message: 'Failed to update access list',
        };
      });

    builder
      .addCase(probeFileManagementSectionAccess.pending, (state) => {
        state.accessProbeStatus = 'loading';
        state.accessProbeError = null;
        state.canView = false;
      })
      .addCase(probeFileManagementSectionAccess.fulfilled, (state, action) => {
        state.accessProbeStatus = 'succeeded';
        state.accessProbeError = null;
        state.canView = Boolean(action.payload?.canView);
      })
      .addCase(probeFileManagementSectionAccess.rejected, (state, action) => {
        state.accessProbeStatus = 'failed';
        state.accessProbeError = action.payload || {
          message: 'Failed to verify financial section access',
        };
        state.canView = false;
      });
  },
});

export const { clearFileManagementAccessState } =
  fileManagementAccessSlice.actions;

export default fileManagementAccessSlice.reducer;

