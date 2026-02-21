import React, { useMemo } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { resolveUserAvatarUrl } from "../../../../utils/mediaUrl.js";

const resolveInitials = (name) => {
  const n = String(name || "").trim();
  if (!n) return "NA";
  const parts = n.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("") || "NA";
};

const normalizeCompanyMembers = (members) =>
  (Array.isArray(members) ? members : []).map((member, index) => {
    const user =
      member?.user && typeof member.user === "object" ? member.user : member;

    const userId =
      user?.id ??
      member?.user_id ??
      member?.id ??
      null;
    const id =
      userId ??
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

    return {
      id: String(id),
      userId: userId != null ? String(userId) : "",
      name,
      email,
      emailNormalized: String(email || "").trim().toLowerCase(),
      avatar: resolveUserAvatarUrl(avatar),
      initials: resolveInitials(name),
    };
  });

const normalizeProjectMemberIdentities = (members) => {
  const set = new Set();
  (Array.isArray(members) ? members : []).forEach((member) => {
    const userId = String(
      member?.user?.id ??
        member?.user_id ??
        member?.id ??
        "",
    ).trim();
    const email = String(
      member?.user?.email ??
        member?.email ??
        "",
    )
      .trim()
      .toLowerCase();

    if (userId) set.add(`id:${userId}`);
    if (email) set.add(`email:${email}`);
  });
  return set;
};

const ProjectAddMemberModal = ({
  isOpen,
  onClose,
  companyMembers = [],
  companyStatus = "idle",
  companyError = null,
  onReloadCompanyMembers,
  onAddMember,
  projectMembers = [],
  addingByEmail = {},
}) => {
  const list = useMemo(
    () => normalizeCompanyMembers(companyMembers),
    [companyMembers],
  );
  const projectMemberIdentities = useMemo(
    () => normalizeProjectMemberIdentities(projectMembers),
    [projectMembers],
  );

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered>
      <ModalHeader toggle={onClose}>Add Member</ModalHeader>
      <ModalBody>
        {companyStatus === "loading" ? (
          <div className="project-add-member-modal__state">
            <iconify-icon icon="line-md:loading-loop" />
          </div>
        ) : null}

        {companyStatus !== "loading" && companyError ? (
          <div className="project-add-member-modal__state">
            <p className="text-danger mb-2">
              {companyError?.message || "Failed to load company members"}
            </p>
            <Button type="button" color="light" onClick={onReloadCompanyMembers}>
              Retry
            </Button>
          </div>
        ) : null}

        {companyStatus !== "loading" && !companyError && list.length === 0 ? (
          <div className="project-add-member-modal__state text-secondary">
            No company members found
          </div>
        ) : null}

        {companyStatus !== "loading" && !companyError && list.length > 0 ? (
          <div className="project-add-member-modal__list app-scroll">
            {list.map((member) => {
              const isAdded =
                (member.userId &&
                  projectMemberIdentities.has(`id:${String(member.userId)}`)) ||
                (member.emailNormalized &&
                  projectMemberIdentities.has(`email:${member.emailNormalized}`));
              const isAdding = !!addingByEmail[member.emailNormalized];
              const canAdd = !!member.emailNormalized && !isAdded && !isAdding;

              return (
                <div
                  key={member.id}
                  className={`project-add-member-row ${canAdd ? "can-add" : ""}`}
                  role={canAdd ? "button" : undefined}
                  tabIndex={canAdd ? 0 : -1}
                  onClick={() => {
                    if (!canAdd) return;
                    onAddMember?.(member);
                  }}
                  onKeyDown={(e) => {
                    if (!canAdd) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onAddMember?.(member);
                    }
                  }}
                >
                  <div className="project-add-member-row__avatar">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} />
                    ) : (
                      <span>{member.initials}</span>
                    )}
                  </div>
                  <div className="project-add-member-row__meta">
                    <h6>{member.name}</h6>
                    <p>{member.email}</p>
                  </div>
                  <div className="project-add-member-row__action">
                    <Button
                      type="button"
                      size="sm"
                      color={isAdded ? "secondary" : "primary"}
                      disabled={!canAdd}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!canAdd) return;
                        onAddMember?.(member);
                      }}
                    >
                      {isAdded ? "Added" : isAdding ? "Adding..." : "Add"}
                    </Button>
                  </div>
                </div>
              );
            })}
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

export default ProjectAddMemberModal;
