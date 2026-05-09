export const TASK_REVIEW_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const TASK_REVIEW_STORAGE_KEY = 'orkelo_task_review_state_v1';

const normalizeText = (value) => String(value ?? '').trim();

const normalizeStatusText = (value) =>
  normalizeText(value).toLowerCase().replace(/[\s-]+/g, '_');

const getStoredReviewMap = () => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(TASK_REVIEW_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const hasTaskReviewState = (task) =>
  [
    'review_status',
    'completion_status',
    'approval_status',
    'task_review_status',
    'completion_submitted_at',
    'reviewed_at',
    'rejection_note',
  ].some((key) => normalizeText(task?.[key]));

export const getStoredTaskReviewState = (task) => {
  const taskId = typeof task === 'object' ? task?.id : task;
  if (!taskId) return null;
  return getStoredReviewMap()[String(taskId)] ?? null;
};

export const persistTaskReviewState = (taskId, state) => {
  if (typeof window === 'undefined' || !taskId) return;
  try {
    const map = getStoredReviewMap();
    map[String(taskId)] = {
      ...(map[String(taskId)] || {}),
      ...(state || {}),
      id: taskId,
      review_state_saved_at: new Date().toISOString(),
    };
    window.localStorage.setItem(TASK_REVIEW_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Local persistence is only a frontend fallback until backend review fields exist.
  }
};

const mergeStoredReviewState = (task) => {
  if (!task || hasTaskReviewState(task)) return task;
  const stored = getStoredTaskReviewState(task);
  return stored ? { ...task, ...stored } : task;
};

const getUserName = (value) => {
  if (!value) return '';
  if (typeof value === 'object') {
    return normalizeText(value.name ?? value.full_name ?? value.email);
  }
  return normalizeText(value);
};

export const getTaskReviewStatus = (task) => {
  const taskWithStoredState = mergeStoredReviewState(task);
  const raw = normalizeStatusText(
    taskWithStoredState?.review_status ??
      taskWithStoredState?.completion_status ??
      taskWithStoredState?.approval_status ??
      taskWithStoredState?.task_review_status,
  );

  if (['pending_approval', 'pending', 'waiting', 'submitted', 'under_review'].includes(raw)) {
    return TASK_REVIEW_STATUS.PENDING;
  }

  if (['approved', 'accepted'].includes(raw)) {
    return TASK_REVIEW_STATUS.APPROVED;
  }

  if (['rejected', 'changes_requested', 'declined'].includes(raw)) {
    return TASK_REVIEW_STATUS.REJECTED;
  }

  if (['active', 'open', 'not_submitted'].includes(raw)) {
    return TASK_REVIEW_STATUS.ACTIVE;
  }

  const legacyStatus = normalizeStatusText(taskWithStoredState?.status);
  if (
    taskWithStoredState?.is_completed ||
    legacyStatus === 'done' ||
    legacyStatus === 'completed'
  ) {
    return TASK_REVIEW_STATUS.APPROVED;
  }

  return TASK_REVIEW_STATUS.ACTIVE;
};

export const isTaskApproved = (task) =>
  getTaskReviewStatus(task) === TASK_REVIEW_STATUS.APPROVED;

export const getTaskReviewNote = (task) =>
  normalizeText(
    mergeStoredReviewState(task)?.rejection_note ??
      mergeStoredReviewState(task)?.review_note ??
      mergeStoredReviewState(task)?.rejection_reason ??
      mergeStoredReviewState(task)?.approval_note,
  );

export const getTaskReviewSubmittedAt = (task) =>
  mergeStoredReviewState(task)?.completion_submitted_at ??
  mergeStoredReviewState(task)?.review_requested_at ??
  mergeStoredReviewState(task)?.submitted_at ??
  null;

export const getTaskReviewReviewedAt = (task) =>
  mergeStoredReviewState(task)?.reviewed_at ??
  mergeStoredReviewState(task)?.approved_at ??
  mergeStoredReviewState(task)?.rejected_at ??
  null;

export const getTaskReviewSubmittedByName = (task) =>
  getUserName(
    mergeStoredReviewState(task)?.completion_submitted_by ??
      mergeStoredReviewState(task)?.review_requested_by ??
      mergeStoredReviewState(task)?.submitted_by ??
      mergeStoredReviewState(task)?.submitter,
  );

export const getTaskReviewReviewerName = (task) =>
  getUserName(
    mergeStoredReviewState(task)?.reviewed_by ??
      mergeStoredReviewState(task)?.reviewer ??
      mergeStoredReviewState(task)?.approved_by ??
      mergeStoredReviewState(task)?.rejected_by,
  );
