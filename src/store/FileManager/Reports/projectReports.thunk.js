import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios';
import { getErrorMessage } from '../../../utils/getError';
import { normalizedProjectReport } from './projectReports.utils';

export const getProjectReports = createAsyncThunk(
  'get/projectReports',
  async ({ projectId, page = 1 }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/file-management/projects/${projectId}/reports`,
        {
          params: { page },
        },
      );

      return {
        reports: normalizedProjectReport(res.data?.data || []),
        links: res.data?.links || null,
        meta: res.data?.meta || null,
        total: res.data?.total || 0,
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const downloadProjectReport = createAsyncThunk(
  'download/projectReports',
  async ({ reportId }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/file-management/reports/${reportId}/download`,
        {
          responseType: 'blob',
        },
      );

      const contentType =
        res.headers['content-type'] || 'application/octet-stream';
      const contentDisposition = res.headers['content-disposition'];

      let fileName = 'report';

      if (contentDisposition) {
        const utf8Match = contentDisposition.match(
          /filename\*=UTF-8''([^;]+)/i,
        );
        const normalMatch = contentDisposition.match(/filename="?([^"]+)"?/i);

        if (utf8Match?.[1]) {
          fileName = decodeURIComponent(utf8Match[1]);
        } else if (normalMatch?.[1]) {
          fileName = normalMatch[1].trim();
        }
      }

      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      return { reportId, fileName };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const getUserProjectReports = createAsyncThunk(
  'getUserProjectReports',
  async ({ projectId, userId, page = 1 }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/file-management/projects/${projectId}/users/${userId}/reports`,
        { params: { page } },
      );

      const payload = res.data?.reports ?? res.data ?? {};

      return {
        reports: normalizedProjectReport(payload?.data || []),
        links: payload?.links || res.data?.links || null,
        meta: payload?.meta || res.data?.meta || null,
        total: payload?.total || res.data?.total || 0,
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const getUserReports = createAsyncThunk(
  'getUserReports',
  async ({ userId, page = 1 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/file-management/users/${userId}/reports`, {
        params: { page },
      });

      return {
        reports: normalizedProjectReport(res.data?.data || []),
        links: res.data?.links || null,
        meta: res.data?.meta || null,
        total: res.data?.total || 0,
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const deleteProjectReport = createAsyncThunk(
  'deleteProjectReport',
  async ({ reportId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/file-management/reports/${reportId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);
// projects/{project}/users/{user}/reports
