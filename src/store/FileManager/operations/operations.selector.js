export const financialOperationsSelector = (state) =>
  state.financialOperations.items;

export const financialOperationsLoadingSelector = (state) =>
  state.financialOperations.loading;

export const financialOperationsErrorSelector = (state) =>
  state.financialOperations.error;

export const financialOperationsMetaSelector = (state) =>
  state.financialOperations.meta;

export const financialOperationsTotalSelector = (state) =>
  state.financialOperations.total;

export const currentFinancialOperationSelector = (state) =>
  state.financialOperations.currentOperation;

export const currentFinancialOperationLoadingSelector = (state) =>
  state.financialOperations.currentOperationLoading;

export const currentFinancialOperationErrorSelector = (state) =>
  state.financialOperations.currentOperationError;

export const financialOperationCreateStatusSelector = (state) =>
  state.financialOperations.createStatus;

export const financialOperationCreateErrorSelector = (state) =>
  state.financialOperations.createError;

export const financialOperationUpdateStatusSelector = (state) =>
  state.financialOperations.updateStatus;

export const financialOperationUpdateErrorSelector = (state) =>
  state.financialOperations.updateError;

export const financialOperationRecordDeleteStatusSelector = (state) =>
  state.financialOperations.operationDeleteStatus;

export const financialOperationRecordDeleteErrorSelector = (state) =>
  state.financialOperations.operationDeleteError;

export const financialOperationFileUploadStatusSelector = (state) =>
  state.financialOperations.uploadStatus;

export const financialOperationFileUploadErrorSelector = (state) =>
  state.financialOperations.uploadError;

export const financialOperationDeletingFileIdsSelector = (state) =>
  state.financialOperations.deletingFileIds;

export const financialOperationDeleteErrorSelector = (state) =>
  state.financialOperations.deleteError;
