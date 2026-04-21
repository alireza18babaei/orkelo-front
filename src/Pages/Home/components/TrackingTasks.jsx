import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrackingTasks } from "../../../store/tasks/trackingTasksSlice";
import { formatMonthDayTime, trackerTimeFormat } from "../../../utils/date";
import { Link } from "react-router-dom";

const TrackingTasks = () => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector((s) => s.taskTracking);

  useEffect(() => {
    dispatch(getTrackingTasks());
  }, []);

  const taskModalUrl = import.meta.env.VITE_FRONTEND_BASE_URL;

  return (
    <div className="mt-5 mb-5 tracker-panel home-panel">
      <h3 className="text-center tracker-panel__title">Tracking Tasks</h3>

      {loading && (
        <div className="text-center tracker-panel__state">
          <iconify-icon icon="line-md:loading-twotone-loop"></iconify-icon>
        </div>
      )}

      {error && (
        <div className="text-center tracker-panel__state">
          <small className="tracker-panel__message tracker-panel__message--danger">
            {error.message}
          </small>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="text-center tracker-panel__state">
          <small className="tracker-panel__message tracker-panel__message--warning">
            There is no tracking tasks yet.
          </small>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="tracker__homePage b-r-5">
          {data.map((task) => (
            <Link
              to={`${taskModalUrl}projects/${task.project_id}/task/${task.task_id}`}
              key={task.id}
              className="tracker__homeLink"
            >
              <div className="tracker__homeCard d-flex flex-column px-4 py-3">
                <p className="trackerBadge__homePage fw-bold align-self-start px-2 py-1 b-r-10">
                  {task.project_name}
                </p>
                <p className="trackerDetail__homePage">
                  <span className="trackerLabel__homePage">User name:</span>
                  <span className="trackerValue__homePage text-capitalize">
                    {task.user_name}
                  </span>
                </p>
                <p className="trackerDetail__homePage">
                  <span className="trackerLabel__homePage">Task name:</span>
                  <span className="trackerValue__homePage text-capitalize">
                    {task.task_name}
                  </span>
                </p>
                <p className="trackerDetail__homePage">
                  <span className="trackerLabel__homePage">Started at:</span>
                  <span className="trackerValue__homePage">
                    {formatMonthDayTime(task.start_track)}
                  </span>
                </p>
                <p className="trackerDetail__homePage">
                  <span className="trackerLabel__homePage">Last Activity Duration:</span>
                  <span className="trackerValue__homePage">
                    {trackerTimeFormat(task.total_time)}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackingTasks;
