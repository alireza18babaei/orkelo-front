export const financialCounterpartiesSelector = (state) =>
  state.financialCounterparties.items;

export const financialCounterpartiesLoadingSelector = (state) =>
  state.financialCounterparties.loading;

export const financialCounterpartiesErrorSelector = (state) =>
  state.financialCounterparties.error;

export const financialCounterpartiesMetaSelector = (state) =>
  state.financialCounterparties.meta;

export const financialCounterpartiesTotalSelector = (state) =>
  state.financialCounterparties.total;

export const financialCounterpartyCreateStatusSelector = (state) =>
  state.financialCounterparties.createStatus;

export const financialCounterpartyCreateErrorSelector = (state) =>
  state.financialCounterparties.createError;

export const financialCounterpartyUpdateStatusSelector = (state) =>
  state.financialCounterparties.updateStatus;

export const financialCounterpartyUpdateErrorSelector = (state) =>
  state.financialCounterparties.updateError;

export const financialCounterpartyDeleteStatusSelector = (state) =>
  state.financialCounterparties.deleteStatus;

export const financialCounterpartyDeleteErrorSelector = (state) =>
  state.financialCounterparties.deleteError;
