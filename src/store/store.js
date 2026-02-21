import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import projectsReducer from "./projects/projectsSlice";
import projectDetailsReducer from "./projects/projectDetailsSlice";
import projectColumnsReducer from "./projects/projectColumnsSlice";
import projectMembersReducer from "./projects/projectMembersSlice";
import companyMembersReducer from "./company/companyMembersSlice";
import tagsReducer from "./tags/tagsSlice";
import commentsReducer from "./tasks/commentSlice";
import taskPeopleReducer from "./tasks/taskPeopleSlice";
import taskDetailReducer from "./tasks/taskDetailSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    projectDetails: projectDetailsReducer,
    projectColumns: projectColumnsReducer,
    projectMembers: projectMembersReducer,
    companyMembers: companyMembersReducer,
    tags: tagsReducer,
    comments: commentsReducer,
    taskPeople: taskPeopleReducer,
    taskDetail: taskDetailReducer,
  }
})
