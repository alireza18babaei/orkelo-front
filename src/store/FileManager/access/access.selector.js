export const fileManagementAccessMembersSelector = (state) =>
  state.fileManagementAccess.members;

export const fileManagementAccessSelectedUserIdsSelector = (state) =>
  state.fileManagementAccess.selectedUserIds;

export const fileManagementAccessStatusSelector = (state) =>
  state.fileManagementAccess.status;

export const fileManagementAccessErrorSelector = (state) =>
  state.fileManagementAccess.error;

export const fileManagementAccessSaveStatusSelector = (state) =>
  state.fileManagementAccess.saveStatus;

export const fileManagementAccessSaveErrorSelector = (state) =>
  state.fileManagementAccess.saveError;

export const fileManagementCanViewSelector = (state) =>
  state.fileManagementAccess.canView;

export const fileManagementAccessProbeStatusSelector = (state) =>
  state.fileManagementAccess.accessProbeStatus;

export const fileManagementAccessProbeErrorSelector = (state) =>
  state.fileManagementAccess.accessProbeError;
