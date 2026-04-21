export const myProjectsInitialState = {
  items: [],
  meta: {
    currentPage: 1,
    lastPage: 1,
    perPage: 9,
    total: 0,
  },
  myProjectsLoading: false,
  myProjectsErr: null,
};

const normalizedMembers = (members) => {
  if (!members) return null;
  return members.map((m) => ({
    memberId: m.user_id,
    avatarUrl: m.avatar,
  }));
};

const normalizedMyProjectItem = (item) => {
  if (!item) return null;
  const tasksCount = item.tasks_count ?? 0;
  const completeTasksCount = item.completed_tasks_count ?? 0;
  return {
    id: item.id,
    title: item.title,
    image: item.image,
    completeTasksCount,
    description: item.description,
    membersCount: item.members_count,
    tasksCount,
    createdAt: item.created_at,
    members: normalizedMembers(item.members),
    progress: tasksCount
      ? Math.round((completeTasksCount / tasksCount) * 100)
      : 0,
  };
};

export const normalizeMyProjectsResponse = (payload = {}) => {
  const rawItems = Array.isArray(payload?.data) ? payload.data : [];
  const meta = payload?.meta ?? {};
  const fallbackPerPage = rawItems.length || 9;

  return {
    items: rawItems.map(normalizedMyProjectItem).filter(Boolean),
    meta: {
      currentPage: Number(meta?.current_page ?? 1),
      lastPage: Number(meta?.last_page ?? 1),
      perPage: Number(meta?.per_page ?? fallbackPerPage),
      total: Number(meta?.total ?? rawItems.length),
    },
  };
};
