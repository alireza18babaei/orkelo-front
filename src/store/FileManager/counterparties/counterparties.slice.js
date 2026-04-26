import { createSlice } from '@reduxjs/toolkit';
import {
  createFinancialCounterparty,
  deleteFinancialCounterparty,
  getFinancialCounterparties,
  updateFinancialCounterparty,
} from './counterparties.thunk';

const initialState = {
  items: [],
  loading: false,
  error: null,
  links: null,
  meta: null,
  total: 0,
  createStatus: 'idle',
  createError: null,
  updateStatus: 'idle',
  updateError: null,
  deleteStatus: 'idle',
  deleteError: null,
};

const financialCounterpartiesSlice = createSlice({
  name: 'financialCounterparties',
  initialState,
  reducers: {
    resetFinancialCounterpartyMutationState(state) {
      // Preserve list data while clearing modal and row action state.
      state.createStatus = 'idle';
      state.createError = null;
      state.updateStatus = 'idle';
      state.updateError = null;
      state.deleteStatus = 'idle';
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFinancialCounterparties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFinancialCounterparties.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = Array.isArray(action.payload?.counterparties)
          ? action.payload.counterparties
          : [];
        state.links = action.payload?.links ?? null;
        state.meta = action.payload?.meta ?? null;
        state.total = action.payload?.total ?? 0;
      })
      .addCase(getFinancialCounterparties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: 'Failed to load counterparties',
        };
        state.items = [];
        state.links = null;
        state.meta = null;
        state.total = 0;
      });

    builder
      .addCase(createFinancialCounterparty.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createFinancialCounterparty.fulfilled, (state, action) => {
        const nextCounterparty = action.payload?.counterparty ?? null;

        state.createStatus = 'succeeded';
        state.createError = null;

        if (nextCounterparty) {
          state.items = [nextCounterparty, ...(state.items || [])];
          state.total = Number(state.total ?? 0) + 1;
        }
      })
      .addCase(createFinancialCounterparty.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload || {
          message: 'Failed to create counterparty',
        };
      });

    builder
      .addCase(updateFinancialCounterparty.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateFinancialCounterparty.fulfilled, (state, action) => {
        const nextCounterparty = action.payload?.counterparty ?? null;

        state.updateStatus = 'succeeded';
        state.updateError = null;

        if (!nextCounterparty) return;

        state.items = (state.items || []).map((counterparty) =>
          String(counterparty?.id ?? '') === String(nextCounterparty?.id ?? '')
            ? nextCounterparty
            : counterparty,
        );
      })
      .addCase(updateFinancialCounterparty.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload || {
          message: 'Failed to update counterparty',
        };
      });

    builder
      .addCase(deleteFinancialCounterparty.pending, (state) => {
        state.deleteStatus = 'loading';
        state.deleteError = null;
      })
      .addCase(deleteFinancialCounterparty.fulfilled, (state, action) => {
        const counterpartyId = String(action.payload?.counterpartyId ?? '');

        state.deleteStatus = 'succeeded';
        state.deleteError = null;
        state.items = (state.items || []).filter(
          (counterparty) => String(counterparty?.id ?? '') !== counterpartyId,
        );
        state.total = Math.max(Number(state.total ?? 0) - 1, 0);
      })
      .addCase(deleteFinancialCounterparty.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload || {
          message: 'Failed to delete counterparty',
        };
      });
  },
});

export const { resetFinancialCounterpartyMutationState } =
  financialCounterpartiesSlice.actions;

export default financialCounterpartiesSlice.reducer;
