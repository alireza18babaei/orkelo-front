import React, { useMemo } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { resolveUserAvatarWithFallback } from "../../utils/mediaUrl.js";

const roleLabels = {
  company_owner: "Company Owner",
  company_supervisor: "Company Supervisor",
  member: "Member",
};

const getRoleLabel = (role) => {
  const value = String(role ?? "").trim();
  if (!value) return "Member";
  return roleLabels[value] ?? value.replace(/_/g, " ");
};

const resolveInitials = (name) => {
  const n = String(name || "").trim();
  if (!n) return "NA";
  const parts = n.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("") || "NA";
};

const normalizeMembers = (members) =>
  (Array.isArray(members) ? members : []).map((member, index) => {
    const src = member ?? {};
    const id = src?.id ?? src?.email ?? `company-member-${index + 1}`;
    const name = src?.name ?? "-";
    const email = src?.email ?? "-";
    const avatar = src?.avatar ?? "";
    const userId = src?.id ?? null;
    const role = src?.role ?? src?.membership?.role ?? "member";
    const status = src?.status ?? src?.membership?.status ?? null;
    const isCompanyOwner =
      Boolean(src?.is_company_owner) || role === "company_owner";

    return {
      id: String(id),
      userId: userId != null ? String(userId) : "",
      name,
      email,
      avatar: resolveUserAvatarWithFallback(avatar, userId ?? email ?? name),
      initials: resolveInitials(name),
      role,
      status,
      isCompanyOwner,
    };
  });

const CompanyMembersModal = ({
  isOpen,
  onClose,
  members = [],
  status = "idle",
  error = null,
  onReload,
  onDeleteMember,
  removingByUserId = {},
  roles = [],
  rolesStatus = "idle",
  rolesError = null,
  roleUpdatingByUserId = {},
  onChangeMemberRole,
}) => {
  const list = useMemo(() => normalizeMembers(members), [members]);
  const roleOptions = useMemo(() => {
    const assignableRoles = Array.isArray(roles) && roles.length
      ? roles
      : ["member", "company_supervisor"];

    return assignableRoles
      .map((role) => String(role ?? "").trim())
      .filter(Boolean)
      .map((role) => ({
        value: role,
        label: getRoleLabel(role),
      }));
  }, [roles]);

  const handleRoleChange = (member, nextRole) => {
    const role = String(nextRole ?? "").trim();
    if (!role || role === member.role || member.isCompanyOwner) return;
    onChangeMemberRole?.(member, role);
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered>
      <ModalHeader toggle={onClose}>Company Members</ModalHeader>
      <ModalBody>
        {status === "loading" ? (
          <div className="company-members-modal__state">
            <iconify-icon icon="line-md:loading-loop" />
          </div>
        ) : null}

        {status !== "loading" && error ? (
          <div className="company-members-modal__state">
            <p className="text-danger mb-2">
              {error?.message || "Failed to load members"}
            </p>
            <Button type="button" color="light" onClick={onReload}>
              Retry
            </Button>
          </div>
        ) : null}

        {status !== "loading" && !error && list.length === 0 ? (
          <div className="company-members-modal__state text-secondary">
            No members found
          </div>
        ) : null}

        {status !== "loading" && !error && list.length > 0 ? (
          <div className="company-members-modal__list app-scroll">
            {list.map((member) => (
              <div key={member.id} className="company-member-row">
                <div className="company-member-row__content">
                  <div className="company-member-row__avatar">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} />
                    ) : (
                      <span>{member.initials}</span>
                    )}
                  </div>
                  <div className="company-member-row__meta">
                    <h6>{member.name}</h6>
                    <p>{member.email}</p>
                  </div>
                </div>
                <div className="company-member-row__actions">
                  {member.isCompanyOwner ? (
                    <span className="company-member-row__role-badge">
                      {getRoleLabel(member.role)}
                    </span>
                  ) : (
                    <select
                      className="form-select form-select-sm company-member-row__role-select"
                      value={member.role || "member"}
                      onChange={(e) => handleRoleChange(member, e.target.value)}
                      disabled={
                        rolesStatus === "loading" ||
                        !!roleUpdatingByUserId[String(member.userId)]
                      }
                      aria-label={`Change ${member.name} role`}
                    >
                      {roleOptions.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    type="button"
                    className="btn company-member-row__delete"
                    onClick={() => onDeleteMember?.(member)}
                    disabled={
                      member.isCompanyOwner ||
                      !member.userId ||
                      !!removingByUserId[String(member.userId)] ||
                      !!roleUpdatingByUserId[String(member.userId)]
                    }
                    aria-label={`Remove ${member.name}`}
                    title={
                      member.isCompanyOwner
                        ? "Company owner cannot be removed"
                        : `Remove ${member.name}`
                    }
                  >
                    {removingByUserId[String(member.userId)] ? (
                      <iconify-icon icon="line-md:loading-loop" />
                    ) : (
                      <i className="ph ph-trash"></i>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {status !== "loading" && !error && rolesError ? (
          <p className="text-danger f-s-12 mt-2 mb-0">
            {rolesError?.message || "Failed to load company roles"}
          </p>
        ) : null}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" type="button" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CompanyMembersModal;
