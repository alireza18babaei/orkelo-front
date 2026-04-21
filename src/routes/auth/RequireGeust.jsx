import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../../Components/Loader";
import { meThunk } from "../../store/auth/authSlice";

export default function RequireGuest() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { accessToken, user, meStatus } = useSelector((s) => s.auth);

  useEffect(() => {
    if (accessToken && !user && meStatus === "idle") {
      dispatch(meThunk());
    }
  }, [accessToken, user, meStatus, dispatch]);

  if (user && accessToken) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  if (accessToken && (meStatus === "idle" || meStatus === "loading")) {
    return <Loader />;
  }

  return <Outlet />;
}
