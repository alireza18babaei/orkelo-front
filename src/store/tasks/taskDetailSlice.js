import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { getErrorMessage } from "../../utils/getError";

const normalizeTaskPayload = (payload) => {
  const root = payload?.data ?? payload ?? null;
  if (!root || typeof root !== "object" || Array.isArray(root)) return null;
  return root?.task ?? root?.data?.task ?? root;
};

const reviewStateKeys = [
  "review_status",
  "completion_status",
  "approval_status",
  "task_review_status",
  "completion_submitted_at",
  "completion_submitted_by",
  "reviewed_at",
  "reviewed_by",
  "rejection_note",
];

const hasExplicitReviewState = (task) =>
  reviewStateKeys.some((key) =>
    Object.prototype.hasOwnProperty.call(task || {}, key),
  );

const preserveLocalReviewState = (incomingTask, currentTask) => {
  if (!incomingTask || !currentTask) return incomingTask;
  if (String(incomingTask.id) !== String(currentTask.id)) return incomingTask;
  if (hasExplicitReviewState(incomingTask) || !hasExplicitReviewState(currentTask)) {
    return incomingTask;
  }

  const preserved = reviewStateKeys.reduce((carry, key) => {
    if (Object.prototype.hasOwnProperty.call(currentTask, key)) {
      carry[key] = currentTask[key];
    }
    return carry;
  }, {});

  return {
    ...incomingTask,
    ...preserved,
  };
};

export const getTaskDetailThunk = createAsyncThunk(
  "taskDetail/get",
  async ({ projectId, taskId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/projects/${projectId}/tasks/${taskId}`);
      const raw = res?.data?.data ?? res?.data ?? null;
      return {
        projectId,
        taskId,
        task: normalizeTaskPayload(raw),
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

const initialState = {
  projectId: null,
  taskId: null,
  task: null,
  creator: null,
  status: "idle",
  error: null,
};

const taskDetailSlice = createSlice({
  name: "taskDetail",
  initialState,
  reducers: {
    clearTaskDetail: () => initialState,
    patchTaskDetail: (state, action) => {
      const patch = action.payload || {};
      if (!state.task || !patch || typeof patch !== "object") return;
      state.task = {
        ...state.task,
        ...patch,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTaskDetailThunk.pending, (state, action) => {
      const nextProjectId = action.meta?.arg?.projectId ?? null;
      const nextTaskId = action.meta?.arg?.taskId ?? null;
      const sameTask =
        state.projectId != null &&
        state.taskId != null &&
        nextProjectId != null &&
        nextTaskId != null &&
        String(state.projectId) === String(nextProjectId) &&
        String(state.taskId) === String(nextTaskId);

      state.status = "loading";
      state.error = null;
      state.projectId = nextProjectId;
      state.taskId = nextTaskId;
      if (!sameTask) state.task = null;
    });
    builder.addCase(getTaskDetailThunk.fulfilled, (state, action) => {
      const incomingTask = action.payload?.task ?? null;
      state.status = "succeeded";
      state.projectId = action.payload?.projectId ?? null;
      state.taskId = action.payload?.taskId ?? null;
      state.task = preserveLocalReviewState(incomingTask, state.task);

      state.creator = state.task?.creator ?? null;
    });
    builder.addCase(getTaskDetailThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || { message: "Somthing went wrong" };
      state.task = null;
    });
  },
});

export const { clearTaskDetail, patchTaskDetail } = taskDetailSlice.actions;
export default taskDetailSlice.reducer;
