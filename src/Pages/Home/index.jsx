import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toastSuccess } from '../../utils/sweetAlert';
import HomePanel from './components/HomePanel';
import { HOME_PROJECT_FALLBACK_ITEMS, HOME_TASK_ITEMS } from './data/home.data';
import './home.css';
import TrackingTasks from './components/TrackingTasks';
import { formatFullDate } from '../../utils/date';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector((s) => s.auth?.user ?? null);
  const projects = useSelector((s) => s.projects?.items ?? []);
  const notifications = useSelector((s) => s.notifications ?? []);
  const flash = location.state?.flash;
  useEffect(() => {
    if (!flash) return;

    toastSuccess(flash);
    navigate(location.pathname, { replace: true, state: null });
  }, [flash, location.pathname, navigate]);

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }).format(new Date()),
    [],
  );

  const projectItems = useMemo(() => {
    if (projects.length) {
      return projects.slice(0, 3).map((project) => ({
        id: `project-${project.id}`,
        title: project.name ?? 'Untitled project',
        meta: project.status ?? 'Active',
      }));
    }
    return HOME_PROJECT_FALLBACK_ITEMS;
  }, [projects]);

  const notificationItems = useMemo(() => {
    if (notifications.items.length) {
      return notifications.items.slice(0, 3).map((notification) => ({
        id: notification.id,
        title: notification.title,
        body: notification.body,
        time: formatFullDate(notification.created_at),
      }));
    } else {
      return 'You dont have any notification yet.';
    }
  }, [notifications]);

  const userName = String(user?.name || 'there').trim() || 'there';

  return (
    <section className='home-dashboard' aria-label='Home dashboard'>
      <header className='home-dashboard__header'>
        <p className='home-dashboard__date'>{todayLabel}</p>
        <h1 className='home-dashboard__welcome'>Welcome, {userName}</h1>
      </header>
      <TrackingTasks />
      <div className='home-dashboard__grid'>
        <section
          className='home-dashboard__primary'
          aria-label='Tasks and projects'
        >
          <HomePanel title='Tasks'>
            <ul className='home-list'>
              {HOME_TASK_ITEMS.map((task) => (
                <li key={task.id} className='home-list__item'>
                  <span className='home-list__title'>{task.title}</span>
                  <span className='home-list__meta'>{task.meta}</span>
                </li>
              ))}
            </ul>
          </HomePanel>

          <HomePanel title='Latest Notifications'>
            <ul className='home-list'>
              {Array.isArray(notificationItems) ? (
                notificationItems.map((notification) => (
                  <li
                    key={notification.id || notification.title}
                    className='home-list__item'
                  >
                    <span className='home-list__title'>
                      {notification.title}
                    </span>
                    <span className='home-list__meta'>{notification.time}</span>
                  </li>
                ))
              ) : (
                <li className='home-list__item'>
                  <span className='home-list__title'>{notificationItems}</span>
                </li>
              )}
            </ul>
          </HomePanel>
        </section>

        <aside
          className='home-dashboard__notifications'
          aria-label='Notifications'
        >
          <HomePanel title='Projects'>
            <ul className='home-list'>
              {projectItems.map((project) => (
                <li key={project.id} className='home-list__item'>
                  <span className='home-list__title'>{project.title}</span>
                  <span className='home-list__meta'>{project.meta}</span>
                </li>
              ))}
            </ul>
          </HomePanel>
        </aside>
      </div>
    </section>
  );
};

export default Home;
