export const APP_UPDATES = [
  {
    id: "2026-05-13-task-review-leave-requests-performance-analysis-and-file-download-updates",
    version: "v1.2.0",
    releasedAt: "2026-05-13",
    title: "Product Update",
    summary:
      "This update adds task review controls, leave request management, user performance analysis, Home summary improvements, and cleaner file download behavior.",
    newFeatures: [
      {
        title: "Task Priority",
        description:
          "Tasks can now be assigned a priority so teams can identify important work faster and keep boards better organized.",
        icon: "ph-duotone ph-flag",
      },
      {
        title: "Task Approval Workflow",
        description:
          "Employers and authorized reviewers can now approve or reject completed tasks directly from the task workflow.",
        icon: "ph-duotone ph-seal-check",
      },
      {
        title: "Task Rating Modal",
        description:
          "A dedicated rating modal was added so approved tasks can be reviewed and scored in a clear, focused step.",
        icon: "ph-duotone ph-star",
      },
      {
        title: "Leave Request Management",
        description:
          "A complete leave request section is now available for submitting, reviewing, approving, rejecting, and tracking employee leave requests.",
        icon: "ph-duotone ph-calendar-check",
      },
      {
        title: "Leave Status Tabs",
        description:
          "Leave requests are grouped into pending approvals, active leaves, upcoming leaves, leave history, and rejected requests for easier review.",
        icon: "ph-duotone ph-tabs",
      },
      {
        title: "Home Summary",
        description:
          "New summary information was added to Home so key team and company activity can be reviewed faster.",
        icon: "ph-duotone ph-house-line",
      },
      {
        title: "User Performance Analysis",
        description:
          "A full user performance analysis section was added with date range, project, and user filters for reviewing tracked time and task metrics.",
        icon: "ph-duotone ph-chart-line-up",
      },
      {
        title: "Filtered Tracked Time",
        description:
          "Tracked time totals now reflect the selected date range and can be narrowed by project and user.",
        icon: "ph-duotone ph-timer",
      },
    ],
    bugFixes: [
      "Fixed uploaded file downloads so files now download with their original uploaded names.",
      "Fixed tracked time calculations so selected date ranges only count time that happened inside the selected period.",
      "Fixed performance filters so project and user selections are applied to tracked time totals.",
      "Fixed leave request grouping so active, upcoming, history, and rejected requests match their actual status and dates.",
    ],
    improvements: [
      "Improved task review flow with clearer approval, rejection, and rating states.",
      "Improved leave request summaries with monthly approved, rejected, and pending counts.",
      "Improved user performance reporting with clearer tracked time, tracked days, leave days, task counts, overdue tasks, and ratings.",
      "Improved Home visibility by adding summary information for faster status review.",
      "Improved file handling consistency across uploaded reports and attachments.",
    ],
    active: true,
  },
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
    active: false,
  },
];

export const getLatestActiveAppUpdate = () =>
  APP_UPDATES.find((item) => item?.active) ?? null;
