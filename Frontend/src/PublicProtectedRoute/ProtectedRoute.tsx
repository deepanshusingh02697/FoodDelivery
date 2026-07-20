import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

interface Props {
  children: React.ReactNode;
  allowedRole?: string;
}
export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { authUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRole && authUser.role !== allowedRole) {
    return (
      <Navigate
        to={
          authUser.role === "ADMIN"
            ? "/admin"
            : authUser.role === "OWNER"
              ? "/owner"
              : "/"
        }
        replace
      />
    );
  }
  return <>{children}</>
}
