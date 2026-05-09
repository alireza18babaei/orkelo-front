import React, { useState } from "react";
import { Spinner } from "reactstrap";

export const TASK_RATING_OPTIONS = Array.from({ length: 5 }, (_, index) => index + 1);

export const normalizeTaskRating = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;

  const rating = Math.trunc(parsed);
  return rating >= 1 && rating <= 5 ? rating : null;
};

export default function TaskRatingDropdown({
  value = null,
  disabled = false,
  saving = false,
  onChange,
}) {
  const [hoveredRating, setHoveredRating] = useState(null);
  const selectedRating = normalizeTaskRating(value);
  const displayRating = hoveredRating ?? selectedRating ?? 0;

  const selectRating = async (nextValue) => {
    if (disabled || saving) return;
    const nextRating = normalizeTaskRating(nextValue);
    if (!nextRating || nextRating === selectedRating) return;

    await onChange?.(nextRating);
  };

  return (
    <div className="task-rating-stars-row">
      <div
        className="task-rating-stars"
        onMouseLeave={() => setHoveredRating(null)}
      >
        {TASK_RATING_OPTIONS.map((option) => {
          const filled = option <= displayRating;

          return (
            <button
              key={option}
              type="button"
              className={`task-rating-star ${filled ? "is-filled" : ""}`}
              aria-label={`Rate ${option} out of 5`}
              title={`${option}/5`}
              disabled={disabled || saving}
              onMouseEnter={() => setHoveredRating(option)}
              onFocus={() => setHoveredRating(option)}
              onBlur={() => setHoveredRating(null)}
              onClick={() => selectRating(option)}
            >
              <i className={`ti ${filled ? "ti-star-filled" : "ti-star"}`}></i>
            </button>
          );
        })}
      </div>
    </div>
  );
}
