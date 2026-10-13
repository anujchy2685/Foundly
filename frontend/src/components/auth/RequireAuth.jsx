import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const location = useLocation();
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
