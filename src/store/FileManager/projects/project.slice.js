import { createSlice } from "@reduxjs/toolkit"
import { getFileManagerProjects } from "./projects.thunk";

const initialState = {
  projects: [],
  loading: false,
  error: null
}

const fileManagerProjectsSlice = createSlice({
  name: "fileManagerProjects",
  initialState,
  reducers: {},
  extraReducers: (builder)=> {
    builder
      .addCase(getFileManagerProjects.pending, (s)=> {
        s.loading = true;
        s.error = null;
      })
      .addCase(getFileManagerProjects.fulfilled, (s, a)=> {
        s.loading = false;
        s.projects = a.payload;
      })
      .addCase(getFileManagerProjects.rejected, (s, a)=> {
        s.loading = false;
        s.error = a.payload || a.error.message || "Something wnet wrong"
      })
}});

export default fileManagerProjectsSlice.reducer;
