export const APP_UPDATES = [
  {
    id: "2026-04-20-manage-projects-reports-roles-and-task-board-updates",
    version: "v1.0.3",
    releasedAt: "2026-04-20",
    title: "Latest Update",
    summary:
      "This release improves project management, daily reports, member roles, task boards, file uploads, and task detail workflows across Orkelo.",
    newFeatures: [
      {
        title: "Manage Projects Workspace",
        description:
          "Company owners and supervisors can now review accessible projects, open project reports, and view each member's daily reports from one place.",
        icon: "ph-duotone ph-kanban",
      },
      {
        title: "Member Daily Reports",
        description:
          "Clicking a member now opens all daily reports uploaded by that user across the active company.",
        icon: "ph-duotone ph-file-text",
      },
      {
        title: "Project Manager Assignment",
        description:
          "Company owners and supervisors can assign project manager access directly from the project board members sidebar.",
        icon: "ph-duotone ph-user-switch",
      },
      {
        title: "Company Role Management",
        description:
          "Company owners can manage member roles from the company members modal in the header.",
        icon: "ph-duotone ph-users-three",
      },
      {
        title: "Drag and Drop Task Uploads",
        description:
          "Task files can now be uploaded by dragging them directly into the task detail modal.",
        icon: "ph-duotone ph-upload-simple",
      },
      {
        title: "Shared Task Time Tracking",
        description:
          "Active task timers now calculate elapsed time from the tracker start time, so other users can see the running timer correctly.",
        icon: "ph-duotone ph-timer",
      },
      {
        title: "Shared Task Time Tracking",
        description:
          "Now removing a project requires to enter the name of the project",
        icon: "ph-duotone ph-file-text",
      },
    ],
    bugFixes: [
      "Fixed company image uploads by aligning the request flow with server-side multipart handling.",
      "Fixed unreadable dark mode text in the task detail modal sidebar.",
      "Fixed task activity labels for assignee assignment, assignee changes, assignee clearing, and task creation events.",
      "Fixed member report navigation from the Manage Projects page.",
      "Fixed loading spinner behavior when members are already visible.",
      "Fixed empty board item metadata by hiding due date and attachment icons when there is no due time and no files.",
    ],
    improvements: [
      "Added a clearer overdue style for tasks that have passed their due time.",
      "Improved Manage Projects loading states with larger, clearer project spinners.",
      "Formatted company member roles into readable labels such as Company Owner, Company Supervisor, and Member.",
      "Added My File Manager access in the user profile area.",
      "Added clearer report upload guidance so users know they can upload their reports.",
      "Improved project board member sidebar role display and dark mode styling.",
      "Improved task activity timeline readability by showing who created the task.",
    ],
    active: true,
  },
];

export const getLatestActiveAppUpdate = () =>
  APP_UPDATES.find((item) => item?.active) ?? null;
