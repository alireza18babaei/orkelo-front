import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios';
import { normalizeDailyReportsResponse } from '../DailyReports/dailyReports.utils';
import { getErrorMessage } from '../../../utils/getError';

export const getQuickAccessReports = createAsyncThunk(
  'quickAccess/getQuickAccessReports',
  async (projectId, { rejectWithValue }) => {
    if (!projectId) {
      return rejectWithValue('Project id is required.');
    }

    try {
      const res = await api.get('/file-management/reports/my', {
        params: {
          project_id: projectId,
        },
      });

      const normalized = normalizeDailyReportsResponse(res.data);

      return {
        projectId: String(projectId),
        items: normalized.items.slice(0, 4),
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);
