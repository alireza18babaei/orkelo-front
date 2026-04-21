import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import { toastError } from "../../utils/sweetAlert";

const clampNonNegativeInt = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.floor(parsed));
};

const parseDateMs = (value) => {
  if (!value) return null;
  const ms = new Date(value).getTime();
  return Number.isFinite(ms) ? ms : null;
};

const getTrackerStartMs = (tracker) =>
  parseDateMs(tracker?.created_at ?? tracker?.createdAt ?? tracker?.start_track);

const formatElapsed = (totalSeconds) => {
  const safeSeconds = clampNonNegativeInt(totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const pad2 = (value) => String(value).padStart(2, "0");
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
};

const getElapsedSeconds = ({
  running,
  startedAtMs,
  elapsedBeforeSeconds,
  nowMs = Date.now(),
}) => {
  const baseSeconds = clampNonNegativeInt(elapsedBeforeSeconds);
  if (!running || !startedAtMs) return baseSeconds;

  const deltaSeconds = Math.floor((nowMs - startedAtMs) / 1000);
  return baseSeconds + Math.max(0, deltaSeconds);
};

const pickActiveTracker = (trackers) =>
  [...(Array.isArray(trackers) ? trackers : [])]
    .filter((item) => item && item.stop_track == null)
    .sort((a, b) => Number(b?.id ?? 0) - Number(a?.id ?? 0))[0] ?? null;

const pickLatestTracker = (trackers) =>
  [...(Array.isArray(trackers) ? trackers : [])]
    .filter((item) => item)
    .sort((a, b) => Number(b?.id ?? 0) - Number(a?.id ?? 0))[0] ?? null;

const toTrackerTotalSeconds = (tracker) => {
  const total = Number(tracker?.total_time);
  if (Number.isFinite(total) && total >= 0) return Math.floor(total);

  const startMs = getTrackerStartMs(tracker);
  const stopMs = parseDateMs(tracker?.stop_track);
  if (!startMs || !stopMs || stopMs < startMs) return 0;
  return Math.floor((stopMs - startMs) / 1000);
};

const sumTrackerTotals = (trackers) =>
  (Array.isArray(trackers) ? trackers : [])
    .reduce((sum, item) => sum + toTrackerTotalSeconds(item), 0);

const createEmptyTimerState = () => ({
  running: false,
  startedAtMs: null,
  elapsedBeforeSeconds: 0,
});

const getApiErrorMessage = (err, fallback) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  fallback;

const TaskTimer = ({
  taskId,
  projectId,
  isOpen,
  timeTrackers = [],
  onStateChanged,
  onChanged,
}) => {
  const currentUserId = useSelector((s) => s.auth?.user?.id ?? null);
  const [timerState, setTimerState] = useState(createEmptyTimerState);
  const [nowMs, setNowMs] = useState(Date.now());
  const [saving, setSaving] = useState(false);

  const latestTaskTracker = useMemo(
    () => pickLatestTracker(timeTrackers),
    [timeTrackers],
  );
  const activeTaskTracker = useMemo(
    () => pickActiveTracker(timeTrackers),
    [timeTrackers],
  );
  const hasTaskTrackerHistory = Boolean(latestTaskTracker);
  const taskTrackerIsRunning = Boolean(activeTaskTracker);
  const activeTrackerBelongsToCurrentUser = Boolean(
    activeTaskTracker &&
      currentUserId != null &&
      String(activeTaskTracker?.user_id ?? "") === String(currentUserId),
  );

  useEffect(() => {
    if (!isOpen || !taskId) return;

    const backendElapsed = sumTrackerTotals(timeTrackers);

    setTimerState({
      running: Boolean(activeTaskTracker),
      startedAtMs: getTrackerStartMs(activeTaskTracker),
      elapsedBeforeSeconds: backendElapsed,
    });
    setNowMs(Date.now());
  }, [isOpen, taskId, timeTrackers, activeTaskTracker]);

  useEffect(() => {
    if (!isOpen || !timerState.running) return undefined;

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isOpen, timerState.running]);

  const elapsedSeconds = useMemo(
    () =>
      getElapsedSeconds({
        running: timerState.running,
        startedAtMs: timerState.startedAtMs,
        elapsedBeforeSeconds: timerState.elapsedBeforeSeconds,
        nowMs,
      }),
    [
      timerState.running,
      timerState.startedAtMs,
      timerState.elapsedBeforeSeconds,
      nowMs,
    ],
  );

  const startInitialTracker = useCallback(async () => {
    if (!projectId || !taskId) return;
    const now = Date.now();

    setSaving(true);
    try {
      const res = await api.post(
        `/projects/${projectId}/tasks/${taskId}/time-trackers/start`,
        { start_track: new Date(now).toISOString() },
      );
      const data = res?.data?.data ?? res?.data ?? {};
      const tracker = data?.tracker ?? null;
      const startAtMs = getTrackerStartMs(tracker) ?? now;
      const nextTotal = clampNonNegativeInt(
        data?.task_total_time ?? timerState.elapsedBeforeSeconds,
      );

      setTimerState((prev) => ({
        ...prev,
        running: true,
        startedAtMs: startAtMs,
        elapsedBeforeSeconds: nextTotal,
      }));
      setNowMs(now);
      onStateChanged?.({
        running: true,
        type: "start",
        startedAtMs: startAtMs,
        taskTotalSeconds: nextTotal,
      });
      onChanged?.();
    } catch (err) {
      toastError(getApiErrorMessage(err, "Start tracker failed"));
    } finally {
      setSaving(false);
    }
  }, [projectId, taskId, timerState.elapsedBeforeSeconds, onStateChanged, onChanged]);

  const resumeTracker = useCallback(async () => {
    if (!projectId || !taskId) return;
    if (timerState.running) return;

    const now = Date.now();
    setSaving(true);
    try {
      const res = await api.patch(
        `/projects/${projectId}/tasks/${taskId}/time-trackers/resume`,
        { start_track: new Date(now).toISOString() },
      );

      const data = res?.data?.data ?? res?.data ?? {};
      const tracker = data?.tracker ?? null;
      const startedAtMs = getTrackerStartMs(tracker) ?? now;
      const nextTotal = clampNonNegativeInt(
        data?.task_total_time ?? timerState.elapsedBeforeSeconds,
      );

      setTimerState((prev) => ({
        ...prev,
        running: true,
        startedAtMs,
        elapsedBeforeSeconds: nextTotal,
      }));
      setNowMs(now);
      onStateChanged?.({
        running: true,
        type: "start",
        startedAtMs,
        taskTotalSeconds: nextTotal,
      });
      onChanged?.();
    } catch (err) {
      toastError(getApiErrorMessage(err, "Resume tracker failed"));
    } finally {
      setSaving(false);
    }
  }, [projectId, taskId, timerState.running, timerState.elapsedBeforeSeconds, onStateChanged, onChanged]);

  const handleStart = useCallback(async () => {
    if (saving || timerState.running) return;
    if (taskTrackerIsRunning) {
      toastError("Tracker is already running.");
      return;
    }
    if (hasTaskTrackerHistory) {
      await resumeTracker();
      return;
    }
    await startInitialTracker();
  }, [
    saving,
    timerState.running,
    taskTrackerIsRunning,
    hasTaskTrackerHistory,
    resumeTracker,
    startInitialTracker,
  ]);

  const stopTimer = useCallback(async () => {
    if (!projectId || !taskId) return;
    if (!timerState.running) return;
    if (!activeTrackerBelongsToCurrentUser) return;

    const now = Date.now();
    setSaving(true);
    try {
      const res = await api.patch(
        `/projects/${projectId}/tasks/${taskId}/time-trackers/stop`,
        { stop_track: new Date(now).toISOString() },
      );

      const data = res?.data?.data ?? res?.data ?? {};
      const fallbackElapsed = getElapsedSeconds({
        running: true,
        startedAtMs: timerState.startedAtMs,
        elapsedBeforeSeconds: timerState.elapsedBeforeSeconds,
        nowMs: now,
      });
      const nextTotal = clampNonNegativeInt(
        data?.task_total_time ?? fallbackElapsed,
      );

      setTimerState((prev) => ({
        ...prev,
        running: false,
        startedAtMs: null,
        elapsedBeforeSeconds: nextTotal,
      }));
      setNowMs(now);
      onStateChanged?.({
        running: false,
        type: "stop",
        startedAtMs: null,
        taskTotalSeconds: nextTotal,
      });
      onChanged?.();
    } catch (err) {
      toastError(getApiErrorMessage(err, "Stop tracker failed"));
    } finally {
      setSaving(false);
    }
  }, [projectId, taskId, timerState.running, timerState.startedAtMs, timerState.elapsedBeforeSeconds, activeTrackerBelongsToCurrentUser, onStateChanged, onChanged]);

  const statusLabel = timerState.running
    ? "Running"
    : elapsedSeconds > 0
      ? "Stopped"
      : "Idle";
  const disabled = saving || !projectId || !taskId;

  return (
    <div className="task-detail-timer" aria-label="Task timer">
      <div className="task-detail-timer__head">
        <span className="task-detail-timer__label">
          <i className="ph ph-timer"></i>
          Timer
        </span>
        <span
          className={`task-detail-timer__status ${
            timerState.running ? "is-running" : ""
          }`}
        >
          {statusLabel}
        </span>
      </div>
      <div className="task-detail-timer__value" aria-live="polite">
        {formatElapsed(elapsedSeconds)}
      </div>
      <div className="task-detail-timer__actions">
        <button
          type="button"
          className={`btn task-detail-timer__icon-btn ${
            timerState.running ? "btn-outline-primary" : "btn-primary"
          }`}
          onClick={handleStart}
          disabled={disabled || timerState.running || taskTrackerIsRunning}
          aria-label="Start timer"
          title="Start"
        >
          <i className="ph-fill ph-play"></i>
        </button>
        <button
          type="button"
          className={`btn task-detail-timer__icon-btn ${
            timerState.running ? "btn-danger" : "btn-outline-danger"
          }`}
          onClick={stopTimer}
          disabled={disabled || !timerState.running || !activeTrackerBelongsToCurrentUser}
          aria-label="Stop timer"
          title={
            timerState.running && !activeTrackerBelongsToCurrentUser
              ? "Timer is running by another user"
              : "Stop"
          }
        >
          <i className="ph-fill ph-stop"></i>
        </button>
      </div>
    </div>
  );
};

export default TaskTimer;
