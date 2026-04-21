import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteProjectThunk, updateProjectThunk } from "./projectDetailsSlice";
import { logoutThunk } from "../auth/authSlice";
import api from "../../api/axios";
import { getErrorMessage } from "../../utils/getError";

export const getProjectsThunk = createAsyncThunk(
  "projects/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/projects");
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue({ message: error.message });
    }
  },
);

export const createProjectThunk = createAsyncThunk(
  "projects/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/projects", payload);
      return res.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  items: [],
  ownerUserId: null,
  loading: false,
  error: null,
  status : "idle"
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjectsErr: (state) => {
      state.error = null;
    },
    clearProjectState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(getProjectsThunk.pending, (state, action) => {
      const nextUserId = action.meta?.arg?.userId ?? state.ownerUserId ?? null;
      const isUserSwitched =
        state.ownerUserId != null &&
        nextUserId != null &&
        String(state.ownerUserId) !== String(nextUserId);

      state.loading = true;
      state.status = "loading";
      state.error = null;
      state.ownerUserId = nextUserId;

      if (isUserSwitched) {
        state.items = [];
      }
    });
    builder.addCase(getProjectsThunk.fulfilled, (state, action) => {
      const nextUserId = action.meta?.arg?.userId ?? state.ownerUserId ?? null;
      state.ownerUserId = nextUserId;
      state.items = action.payload?.data || [];
      state.loading = false;
      state.status = "succeeded";
    });
    builder.addCase(getProjectsThunk.rejected, (state, action)=> {
      state.loading = false;
      state.status = "failed";
      state.error = action.payload?.message || action.payload || "Fetching projects failed"
    })
    builder.addCase(createProjectThunk.fulfilled, (state, action) => {
      const created = action.payload;
      if (!created?.id) return;
      state.items = [created, ...state.items];
    })
    builder.addCase(createProjectThunk.rejected, (state, action) => {
      state.error = action.payload?.message || action.payload || "Create failed";
    })
    builder.addCase(updateProjectThunk.fulfilled, (state, action) => {
      const updated = action.payload;
      if (!updated?.id) return;
      state.items = state.items.map((p) =>
        String(p.id) === String(updated.id) ? { ...p, ...updated } : p
      );
    })
    builder.addCase(deleteProjectThunk.fulfilled, (state, action) => {
      const deletedId =
        action.payload?.deletedId ??
        action.meta?.arg?.id ??
        action.meta?.arg ??
        action.payload?.data?.id ??
        action.payload?.id;
      if (!deletedId) return;
      state.items = state.items.filter(
        (p) => String(p.id) !== String(deletedId)
      );
    })
    builder.addCase(logoutThunk.fulfilled, () => initialState)
    builder.addCase(logoutThunk.rejected, () => initialState)
  },
});

export const { clearProjectState, clearProjectsErr } = projectsSlice.actions;
 export default projectsSlice.reducer;
