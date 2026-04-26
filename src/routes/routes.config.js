import { elements } from 'chart.js';
import Layout from '../Layout';
import Login from '../Pages/AuthPages/Login';
import NotFound from '../Pages/AuthPages/NotFound';
import SignUp from '../Pages/AuthPages/SignUp';
import Home from '../Pages/Home';
import ManageProjects from '../Pages/ManageProjects';
import ProjectManager from '../Pages/ManageProjects/Project';
import Profile from '../Pages/Profile';
import MyProjects from '../Pages/Profile/MyProjects';
import ProjectBoard from '../Pages/Projects/ProjectBoard';
import ManageFinance from '../Pages/ManageFinance';
import RequireAuth from './auth/RequireAuth';
import RequireGuest from './auth/RequireGeust';
import UserReports from '../Pages/ManageProjects/Project/UserReports';

export const routesConfig = [
  {
    element: <RequireGuest />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <SignUp /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/manage-projects', element: <ManageProjects/> },
          { path: '/manage-finance', element: <ManageFinance /> },
          { path: '/manage-projects/user/:userId', element: <UserReports/>},
          { path: '/manage-projects/:projectId', element: <ProjectManager/> },
          { path: '/manage-projects/:projectId/user/:userId', element: <UserReports/>},
          { path: '/manage-projecets/:projectId/user/:userId', element: <UserReports/>},
          { path: '/projects/:id', element: <ProjectBoard /> },
          { path: '/projects/:id/task/:taskId', element: <ProjectBoard /> },
          { path: '/profile', element: <Profile /> },
          { path: '/profile/projects', element: <Profile /> },
          { path: '/my-projects/:projectId', element: <MyProjects /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
];
