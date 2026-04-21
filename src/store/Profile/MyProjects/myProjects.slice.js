import { createSlice } from "@reduxjs/toolkit";
import { myProjectsInitialState } from "./myProjects.utils";
import { getMyProjects } from "./myProjects.thunk";

const initialState = myProjectsInitialState;

const myProjectsSlice = createSlice({
  name: "myProjects",
  initialState,
  reducers: {},
  extraReducers: (buidler) => {
    buidler.addCase(getMyProjects.pending, (s) => {
      s.myProjectsLoading = true;
      s.myProjectsErr = null;
    });
    buidler.addCase(getMyProjects.fulfilled, (s, a) => {
      s.myProjectsLoading = false;
      s.items = a.payload?.items ?? [];
      s.meta = a.payload?.meta ?? s.meta;
    });
    buidler.addCase(getMyProjects.rejected, (s, a) => {
      s.myProjectsLoading = false;
      s.myProjectsErr = a.payload || a.error.message || "Failed to load projects";
    });
  },
});

export default myProjectsSlice.reducer;
