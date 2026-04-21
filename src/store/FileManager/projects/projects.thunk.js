import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";
import { getErrorMessage } from "../../../utils/getError";

export const getFileManagerProjects = createAsyncThunk(
  "get/fileManagerProjects",
  async(_, {rejectWithValue})=> {
    try {
      const res = await api.get('/file-management/projects');
      return res.data?.data?.projects;
    } catch(err) {
      return rejectWithValue(getErrorMessage(err))
    }
  }
)
