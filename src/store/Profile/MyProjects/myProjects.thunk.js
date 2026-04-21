import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";
import { getErrorMessage } from "../../../utils/getError";
import { normalizeMyProjectsResponse } from "./myProjects.utils";

export const getMyProjects = createAsyncThunk(
  "get/myProjects",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("profile/user-projects", { params });
      return normalizeMyProjectsResponse(res.data);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);
