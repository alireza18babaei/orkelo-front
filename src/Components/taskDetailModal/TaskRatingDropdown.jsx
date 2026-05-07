import React, { useMemo, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
} from "reactstrap";

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
  const [open, setOpen] = useState(false);
  const selectedRating = normalizeTaskRating(value);
  const selectedLabel = useMemo(
    () => (selectedRating ? `${selectedRating}/5` : "Rate task"),
    [selectedRating],
  );

  const toggle = () => {
    if (disabled || saving) return;
    setOpen((current) => !current);
  };

  const selectRating = async (nextValue) => {
    if (disabled || saving) return;
    const nextRating = normalizeTaskRating(nextValue);
    if (!nextRating) return;

    if (nextRating === selectedRating) {
      setOpen(false);
      return;
    }

    await onChange?.(nextRating);
    setOpen(false);
  };

  return (
    <Dropdown isOpen={open} toggle={toggle}>
      <DropdownToggle
        tag="button"
        type="button"
        disabled={disabled || saving}
        className="btn d-flex align-items-center justify-content-between px-0 w-100"
        style={{ boxShadow: "none" }}
      >
        <span className="d-flex align-items-center gap-2">
          <i className="ti ti-star fs-5"></i>
          Rating
        </span>
        <span className="ms-auto me-2 d-inline-flex align-items-center">
          {saving ? (
            <span className="small text-muted d-inline-flex align-items-center gap-2">
              <Spinner size="sm" />
              <span>Saving...</span>
            </span>
          ) : selectedRating ? (
            <span className="task-rating-pill">{selectedLabel}</span>
          ) : (
            <span className="small text-muted">{selectedLabel}</span>
          )}
        </span>
        <i className="ti ti-chevron-down"></i>
      </DropdownToggle>

      <DropdownMenu end className="task-rating-menu p-2" style={{ minWidth: 260 }}>
        <div className="task-rating-menu__grid">
          {TASK_RATING_OPTIONS.map((option) => {
            const selected = option === selectedRating;

            return (
              <DropdownItem
                key={option}
                tag="button"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  selectRating(option);
                }}
                className={`task-rating-option ${selected ? "is-selected" : ""}`}
                disabled={saving}
              >
                {option}
              </DropdownItem>
            );
          })}
        </div>
      </DropdownMenu>
    </Dropdown>
  );
}
