import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios';
import { getErrorMessage } from '../../../utils/getError';
import {
  normalizeFinancialOperation,
  normalizeFinancialOperationFile,
  normalizeFinancialOperationsResponse,
} from './operations.utils';

export const getFinancialOperations = createAsyncThunk(
  'financialOperations/getAll',
  async ({ page = 1, title = '' } = {}, { rejectWithValue }) => {
    try {
      const params = { page };
      const normalizedTitle = String(title ?? '').trim();

      if (normalizedTitle) {
        params.title = normalizedTitle;
      }

      const res = await api.get('/file-management/operations', { params });
      return normalizeFinancialOperationsResponse(res?.data);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const getFinancialOperationDetail = createAsyncThunk(
  'financialOperations/getDetail',
  async ({ operationId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/file-management/operations/${operationId}`);
      return normalizeFinancialOperation(res?.data?.data);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const createFinancialOperation = createAsyncThunk(
  'financialOperations/create',
  async (payload, { rejectWithValue }) => {
    try {
      const body = {
        title: String(payload?.title ?? '').trim(),
        type: String(payload?.type ?? 'withdrawal').trim().toLowerCase(),
        amount: payload?.amount,
        operated_at: payload?.operatedAt,
        account: String(payload?.account ?? '').trim(),
        description: String(payload?.description ?? '').trim() || undefined,
      };

      if (body.type === 'deposit') {
        const depositSource = String(payload?.depositSource ?? '').trim();
        if (depositSource) {
          body.deposit_source = depositSource;
        }
      }

      const res = await api.post('/file-management/operations', body);

      return {
        operation: normalizeFinancialOperation(res?.data?.data),
        message: res?.data?.message || 'Financial operation created successfully.',
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const updateFinancialOperation = createAsyncThunk(
  'financialOperations/update',
  async ({ operationId, payload }, { rejectWithValue }) => {
    try {
      const body = {
        title: String(payload?.title ?? '').trim(),
        type: String(payload?.type ?? 'withdrawal').trim().toLowerCase(),
        amount: payload?.amount,
        operated_at: payload?.operatedAt,
        account: String(payload?.account ?? '').trim(),
        description: String(payload?.description ?? '').trim() || null,
      };

      if (body.type === 'deposit') {
        body.deposit_source =
          String(payload?.depositSource ?? '').trim() || null;
      }

      const res = await api.patch(
        `/file-management/operations/${operationId}`,
        body,
      );

      return {
        operation: normalizeFinancialOperation(res?.data?.data),
        message: res?.data?.message || 'Financial operation updated successfully.',
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const deleteFinancialOperation = createAsyncThunk(
  'financialOperations/delete',
  async ({ operationId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/file-management/operations/${operationId}`);

      return {
        operationId,
        message: res?.data?.message || 'Financial operation deleted successfully.',
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const uploadFinancialOperationFile = createAsyncThunk(
  'financialOperations/uploadFile',
  async ({ operationId, file }, { rejectWithValue }) => {
    if (!file) {
      return rejectWithValue({ status: 0, message: 'File is required.' });
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post(
        `/file-management/operations/${operationId}/files`,
        formData,
      );

      return {
        operationId,
        file: normalizeFinancialOperationFile(res?.data?.data),
        message: res?.data?.message || 'File uploaded successfully.',
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const deleteFinancialOperationFile = createAsyncThunk(
  'financialOperations/deleteFile',
  async ({ operationId, fileId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(
        `/file-management/operations/${operationId}/files/${fileId}`,
      );

      return {
        operationId,
        fileId,
        message: res?.data?.message || 'File deleted successfully.',
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);
