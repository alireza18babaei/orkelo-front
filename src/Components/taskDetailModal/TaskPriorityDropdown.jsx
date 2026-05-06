import React, { useMemo, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
} from "reactstrap";

export const TASK_PRIORITY_OPTIONS = [
  {
    value: "low",
    label: "Low",
    badgeStyle: { backgroundColor: "#B0EECD", color: "#111" },
  },
  {
    value: "medium",
    label: "Medium",
    badgeStyle: { backgroundColor: "#7FE4E4", color: "#111" },
  },
  {
    value: "high",
    label: "High",
    badgeStyle: { backgroundColor: "#f97316", color: "#fff" },
  },
  {
    value: "urgent",
    label: "Urgent",
    badgeStyle: { backgroundColor: "#dc3545", color: "#fff" },
  },
];

export const normalizeTaskPriority = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  return TASK_PRIORITY_OPTIONS.some((option) => option.value === normalized)
    ? normalized
    : null;
};

export default function TaskPriorityDropdown({
  value = null,
  disabled = false,
  saving = false,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const selectedValue = normalizeTaskPriority(value);
  const selectedOption = useMemo(
    () =>
      TASK_PRIORITY_OPTIONS.find((option) => option.value === selectedValue) ||
      null,
    [selectedValue],
  );

  const toggle = () => {
    if (disabled || saving) return;
    setOpen((current) => !current);
  };

  const selectPriority = async (nextValue) => {
    if (disabled || saving) return;
    const normalizedNextValue = normalizeTaskPriority(nextValue);
    if (normalizedNextValue === selectedValue) {
      setOpen(false);
      return;
    }

    await onChange?.(normalizedNextValue);
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
          <i className="ti ti-flag fs-5"></i>
          Priority
        </span>
        <span className="ms-auto me-2 d-inline-flex align-items-center">
          {saving ? (
            <span className="small text-muted d-inline-flex align-items-center gap-2">
              <Spinner size="sm" />
              <span>Saving...</span>
            </span>
          ) : selectedOption ? (
            <span
              className="badge"
              style={{
                ...selectedOption.badgeStyle,
                minWidth: 72,
                borderRadius: 6,
              }}
            >
              {selectedOption.label}
            </span>
          ) : (
            <span className="small text-muted">No priority</span>
          )}
        </span>
        <i className="ti ti-chevron-down"></i>
      </DropdownToggle>

      <DropdownMenu end className="p-1" style={{ minWidth: 260 }}>
        <DropdownItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            selectPriority(null);
          }}
          className={!selectedValue ? "bg-light fw-semibold" : ""}
          disabled={saving}
        >
          <span className="text-muted">No priority</span>
        </DropdownItem>
        <DropdownItem divider />
        {TASK_PRIORITY_OPTIONS.map((option) => {
          const selected = option.value === selectedValue;

          return (
            <DropdownItem
              key={option.value}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                selectPriority(option.value);
              }}
              className={selected ? "bg-light fw-semibold" : ""}
              disabled={saving}
            >
              <div className="d-flex align-items-center justify-content-between gap-2">
                <span className="d-inline-flex align-items-center gap-2 w-100">
                  <span
                    className="badge w-100 text-start"
                    style={{
                      ...option.badgeStyle,
                      borderRadius: 6,
                      padding: "0.35rem 0.6rem",
                    }}
                  >
                    {option.label}
                  </span>
                </span>
              </div>
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
}
