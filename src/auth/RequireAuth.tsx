import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import styles from "./RequireAuth.module.css";

export default function RequireAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
