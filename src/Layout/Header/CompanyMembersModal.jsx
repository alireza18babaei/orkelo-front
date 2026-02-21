import React, { useMemo } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { resolveUserAvatarUrl } from "../../utils/mediaUrl.js";

const resolveInitials = (name) => {
  const n = String(name || "").trim();
  if (!n) return "NA";
  const parts = n.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("") || "NA";
};

const normalizeMembers = (members) =>
  (Array.isArray(members) ? members : []).map((member, index) => {
    const user =
      member?.user && typeof member.user === "object" ? member.user : member;

    const id =
      user?.id ??
      member?.id ??
      member?.user_id ??
      user?.email ??
      member?.email ??
      `company-member-${index + 1}`;
    const name =
      user?.name ??
      user?.full_name ??
      member?.name ??
      member?.full_name ??
      "-";
    const email = user?.email ?? member?.email ?? "-";
    const avatar =
      user?.avatar ??
      user?.avatar_url ??
      user?.image ??
      user?.image_url ??
      user?.profile_photo_url ??
      member?.avatar ??
      member?.avatar_url ??
      member?.image ??
      member?.image_url ??
      member?.profile_photo_url ??
      "";
    const userId =
      user?.id ??
      member?.user_id ??
      member?.id ??
      null;

    return {
      id: String(id),
      userId: userId != null ? String(userId) : "",
      name,
      email,
      avatar: resolveUserAvatarUrl(avatar),
      initials: resolveInitials(name),
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
}) => {
  const list = useMemo(() => normalizeMembers(members), [members]);

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
                <button
                  type="button"
                  className="btn company-member-row__delete"
                  onClick={() => onDeleteMember?.(member)}
                  disabled={
                    !member.userId || !!removingByUserId[String(member.userId)]
                  }
                  aria-label={`Remove ${member.name}`}
                >
                  {removingByUserId[String(member.userId)] ? (
                    <iconify-icon icon="line-md:loading-loop" />
                  ) : (
                    <i className="ph ph-trash"></i>
                  )}
                </button>
              </div>
            ))}
          </div>
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
