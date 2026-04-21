import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { getErrorMessage } from "../../utils/getError";

const normalizeMembersPayload = (payload) => {
  const root = payload?.data ?? payload ?? {};
  const data = root?.data ?? root;
  if (Array.isArray(data)) return data;
  return [];
};

const getMemberKey = (member) =>
  String(
      member?.id ??
      member?.email ??
      "",
  );

const getMemberRouteId = (member) =>
  String(
    member?.id ??
      "",
  );

const normalizeRoleAssignmentPayload = (payload) => {
  const root = payload?.data ?? payload ?? {};
  const data = root?.data ?? root;
  const user = data?.user && typeof data.user === "object" ? data.user : {};

  return {
    id: data?.user_id ?? user?.id ?? null,
    name: user?.name ?? "",
    email: user?.email ?? "",
    avatar: user?.avatar ?? null,
    project_member_id: data?.project_member_id ?? null,
    project_role: data?.role ?? "",
    membership_status: data?.status ?? "",
  };
};

export const getProjectMembersThunk = createAsyncThunk(
  "projectMembers/getByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/projects/${projectId}/members`);
      return {
        projectId,
        items: normalizeMembersPayload(res?.data),
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const addProjectMemberThunk = createAsyncThunk(
  "projectMembers/add",
  async ({ projectId, email }, { rejectWithValue }) => {
    try {
      const payload = {
        email,
      };

      await api.post(`/projects/${projectId}/members`, payload);

      return {
        projectId,
        email: String(email || "").trim().toLowerCase(),
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const deleteProjectMemberThunk = createAsyncThunk(
  "projectMembers/delete",
  async ({ projectId, memberId }, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${projectId}/members/${memberId}`);
      return {
        projectId,
        memberId: String(memberId),
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const updateProjectMemberRoleThunk = createAsyncThunk(
  "projectMembers/updateRole",
  async ({ projectId, memberId, role }, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/projects/${projectId}/members/${memberId}/role`,
        { role },
      );

      return {
        projectId,
        memberId: String(memberId),
        member: normalizeRoleAssignmentPayload(res?.data),
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

const initialState = {
  items: [],
  projectId: null,
  status: "idle",
  error: null,
  addingByEmail: {},
  addError: null,
  removingByMemberId: {},
  removeError: null,
  roleUpdatingByMemberId: {},
  roleUpdateError: null,
};

const projectMembersSlice = createSlice({
  name: "projectMembers",
  initialState,
  reducers: {
    clearProjectMembersState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getProjectMembersThunk.pending, (state, action) => {
      const nextProjectId = action.meta?.arg ?? null;
      state.status = "loading";
      state.error = null;
      state.projectId = nextProjectId;
      state.items = [];
    });
    builder.addCase(getProjectMembersThunk.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.projectId = action.payload?.projectId ?? state.projectId;
      state.items = Array.isArray(action.payload?.items)
        ? action.payload.items
        : [];
    });
    builder.addCase(getProjectMembersThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || { message: "Somthing went wrong" };
      state.items = [];
    });

    builder.addCase(addProjectMemberThunk.pending, (state, action) => {
      const email = String(action.meta?.arg?.email ?? "").trim().toLowerCase();
      if (!email) return;
      state.addError = null;
      state.addingByEmail[email] = true;
    });
    builder.addCase(addProjectMemberThunk.fulfilled, (state, action) => {
      const email = String(action.payload?.email ?? "").trim().toLowerCase();
      if (email) delete state.addingByEmail[email];
      state.addError = null;
      state.projectId = action.payload?.projectId ?? state.projectId;
    });
    builder.addCase(addProjectMemberThunk.rejected, (state, action) => {
      const email = String(action.meta?.arg?.email ?? "").trim().toLowerCase();
      if (email) delete state.addingByEmail[email];
      state.addError = action.payload || { message: "Somthing went wrong" };
    });

    builder.addCase(deleteProjectMemberThunk.pending, (state, action) => {
      const memberId = String(action.meta?.arg?.memberId ?? "");
      if (!memberId) return;
      state.removeError = null;
      state.removingByMemberId[memberId] = true;
    });
    builder.addCase(deleteProjectMemberThunk.fulfilled, (state, action) => {
      const memberId = String(action.payload?.memberId ?? "");
      if (!memberId) return;
      delete state.removingByMemberId[memberId];
      state.removeError = null;
      state.projectId = action.payload?.projectId ?? state.projectId;
      state.items = (state.items || []).filter((member) => {
        const routeId = getMemberRouteId(member);
        const key = getMemberKey(member);
        return routeId !== memberId && key !== memberId;
      });
    });
    builder.addCase(deleteProjectMemberThunk.rejected, (state, action) => {
      const memberId = String(action.meta?.arg?.memberId ?? "");
      if (memberId) delete state.removingByMemberId[memberId];
      state.removeError = action.payload || { message: "Somthing went wrong" };
    });

    builder.addCase(updateProjectMemberRoleThunk.pending, (state, action) => {
      const memberId = String(action.meta?.arg?.memberId ?? "");
      if (!memberId) return;
      state.roleUpdateError = null;
      state.roleUpdatingByMemberId[memberId] = true;
    });
    builder.addCase(updateProjectMemberRoleThunk.fulfilled, (state, action) => {
      const memberId = String(action.payload?.memberId ?? "");
      if (memberId) delete state.roleUpdatingByMemberId[memberId];
      state.roleUpdateError = null;
      state.projectId = action.payload?.projectId ?? state.projectId;

      const updated = action.payload?.member || {};
      const updatedId = String(updated?.id ?? memberId);
      state.items = (state.items || []).map((member) => {
        const routeId = getMemberRouteId(member);
        const key = getMemberKey(member);
        if (routeId !== updatedId && key !== updatedId) return member;

        return {
          ...member,
          ...updated,
          id: member?.id ?? updated?.id,
          name: updated?.name || member?.name,
          email: updated?.email || member?.email,
          avatar: updated?.avatar ?? member?.avatar,
          project_role: updated?.project_role || member?.project_role,
          membership_status:
            updated?.membership_status || member?.membership_status,
        };
      });
    });
    builder.addCase(updateProjectMemberRoleThunk.rejected, (state, action) => {
      const memberId = String(action.meta?.arg?.memberId ?? "");
      if (memberId) delete state.roleUpdatingByMemberId[memberId];
      state.roleUpdateError = action.payload || { message: "Somthing went wrong" };
    });
  },
});

export const { clearProjectMembersState } = projectMembersSlice.actions;
export default projectMembersSlice.reducer;
