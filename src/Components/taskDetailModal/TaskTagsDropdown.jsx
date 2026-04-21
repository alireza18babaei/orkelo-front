import React, { useEffect, useMemo, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Spinner } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getProjectTagsThunk,
  toggleTaskTagThunk,
} from "../../store/tags/tagsSlice";
import { toastError } from "../../utils/sweetAlert";
import TaskTagsManagerModal from "./TaskTagsManagerModal";

const getTagLabel = (tag) => tag?.name ?? `Tag ${tag?.id ?? ""}`;

const getTagKey = (tag) => String(tag?.id ?? "");

const getContrastText = (hex) => {
  const raw = String(hex || "").trim();
  if (!raw) return "#111";
  const m = raw.startsWith("#") ? raw.slice(1) : raw;
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return "#fff";
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  // perceived luminance
  const y = (r * 299 + g * 587 + b * 114) / 1000;
  return y >= 170 ? "#111" : "#fff";
};

export default function TaskTagsDropdown({
  projectId,
  taskId,
  selectedTags = [],
  disabled = false,
  onSelect,
  onChanged,
}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [localSelectedTags, setLocalSelectedTags] = useState(
    Array.isArray(selectedTags) ? selectedTags : [],
  );

  const tagsState = useSelector((s) => s.tags);

  const projectTags =
    tagsState?.projectId != null && String(tagsState.projectId) === String(projectId)
      ? tagsState?.items || []
      : [];

  useEffect(() => {
    setLocalSelectedTags(Array.isArray(selectedTags) ? selectedTags : []);
  }, [selectedTags]);

  const selectedTagItems = useMemo(
    () => (Array.isArray(localSelectedTags) ? localSelectedTags : []),
    [localSelectedTags],
  );

  const tagIds = useMemo(
    () => new Set(selectedTagItems.map((t) => getTagKey(t)).filter(Boolean)),
    [selectedTagItems],
  );

  const loading = open && tagsState?.status === "loading";
  const togglingByTagId = tagsState?.togglingByTagId || {};

  const toggle = () => {
    if (disabled) return;
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    if (projectId) dispatch(getProjectTagsThunk(projectId));
  }, [open, dispatch, projectId, taskId]);

  const items = useMemo(() => projectTags || [], [projectTags]);
  const tagLookup = useMemo(() => {
    const map = new Map();

    [...items, ...selectedTagItems, ...(selectedTags || [])].forEach((tag) => {
      const key = getTagKey(tag);
      if (!key || map.has(key)) return;
      map.set(key, tag);
    });

    return map;
  }, [items, selectedTagItems, selectedTags]);

  const handleSelectTag = async (tag) => {
    if (!projectId) return;

    if (!taskId) {
      onSelect?.(tag);
      setOpen(false);
      return;
    }

    const tagId = tag?.id ?? null;
    if (tagId == null) return;
    const tagProjectId = tag?.project_id ?? tag?.projectId ?? null;
    if (tagProjectId != null && String(tagProjectId) !== String(projectId)) {
      toastError("This tag belongs to another project.");
      return;
    }
    const key = String(tagId);
    const wasAssigned = tagIds.has(key);

    try {
      const res = await dispatch(
        toggleTaskTagThunk({ projectId, taskId, tagId, detach: wasAssigned }),
      ).unwrap();

      const next =
        Array.isArray(res?.tagIds)
          ? res.tagIds.map((id) => {
              const normalizedId = String(id);
              return (
                tagLookup.get(normalizedId) ||
                { id }
              );
            })
          : wasAssigned
            ? selectedTagItems.filter(
                (candidate) => getTagKey(candidate) !== key,
              )
            : [...selectedTagItems, tag];

      setLocalSelectedTags(next);
      onChanged?.(next);
      setOpen(false);
    } catch (err) {
      const msg =
        (typeof err === "string" ? err : null) ||
        err?.message ||
        err?.data?.message ||
        "Toggle tag failed";
      toastError(msg);
    }
  };

  return (
    <>
      <div className="d-flex flex-column gap-2">
        <Dropdown isOpen={open} toggle={toggle}>
          <DropdownToggle
            tag="button"
            type="button"
            disabled={disabled}
            className="btn d-flex align-items-center justify-content-between px-0 w-100"
          >
            <span className="d-flex align-items-center gap-2">
              <i className="ti ti-tag fs-5"></i>
              Tags
            </span>
            <i className="ti ti-chevron-down"></i>
          </DropdownToggle>
          <DropdownMenu end className="p-1" style={{ minWidth: 260 }}>
            {loading ? (
              <div className="d-flex align-items-center gap-2 px-2 py-2 text-muted small">
                <Spinner size="sm" color="primary" />
                <span>Loading...</span>
              </div>
            ) : items.length ? (
              <div className="d-flex flex-wrap align-items-center justify-content-start gap-2 px-2 py-2">
                {items.map((t, idx) => {
                  const label = getTagLabel(t);
                  const key = getTagKey(t);
                  const assigned = key ? tagIds.has(String(key)) : false;
                  const color = String(t?.color || "").trim();
                  const badgeText = getContrastText(color);
                  const busy = !!togglingByTagId[String(key)];

                  return (
                    <button
                      key={t?.id ?? `${label}-${idx}`}
                      type="button"
                      className={`btn btn-sm d-inline-flex align-items-center gap-2 ${
                        assigned ? "border border-2" : "border"
                      }`}
                      style={{
                        background: color || "rgba(var(--secondary), 0.06)",
                        color: color ? badgeText : "rgba(var(--dark), 0.8)",
                        borderColor: assigned
                          ? "rgba(var(--primary), 0.55)"
                          : "rgba(var(--secondary), 0.18)",
                        maxWidth: 240,
                        borderRadius: 8,
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelectTag(t);
                      }}
                      title={label}
                      aria-pressed={assigned}
                      disabled={busy}
                    >
                      {busy ? <Spinner size="sm" /> : assigned ? <i className="ti ti-check" /> : null}
                      <span className="text-truncate" style={{ maxWidth: 200 }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-2 py-2 text-muted small">No tags.</div>
            )}

            <DropdownItem divider />
            <DropdownItem
              onClick={() => {
                setOpen(false);
                setManageOpen(true);
              }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <span className="d-inline-flex align-items-center gap-2">
                  <i className="ti ti-settings fs-5"></i>
                  Manage
                </span>
                <i className="ti ti-chevron-right"></i>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {selectedTagItems.length ? (
          <div className="d-flex flex-wrap gap-2">
            {selectedTagItems.map((tag, idx) => {
              const label = getTagLabel(tag);
              const key = getTagKey(tag) || `${idx}`;
              const color = String(tag?.color || "").trim();
              const badgeText = getContrastText(color);
              const busy = !!togglingByTagId[String(key)];

              return (
                <button
                  key={key}
                  type="button"
                  className="btn btn-sm d-inline-flex align-items-center gap-2 border"
                  style={{
                    background: color || "rgba(var(--secondary), 0.08)",
                    color: color ? badgeText : "rgba(var(--dark), 0.85)",
                    borderColor: "rgba(var(--secondary), 0.18)",
                    maxWidth: "100%",
                    borderRadius: 8,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectTag(tag);
                  }}
                  disabled={disabled || busy}
                  title={`${label} - click to remove`}
                >
                  {busy ? <Spinner size="sm" /> : <i className="ti ti-x fs-6" />}
                  <span className="text-truncate" style={{ maxWidth: 220 }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <TaskTagsManagerModal
        projectId={projectId}
        isOpen={manageOpen}
        toggle={() => setManageOpen(false)}
        onChanged={() => {
          if (projectId) dispatch(getProjectTagsThunk(projectId));
        }}
      />
    </>
  );
}
