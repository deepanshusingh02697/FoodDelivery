import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

interface Props {
  children: React.ReactNode;
}
export default function PublicRoute({ children }: Props) {
  const { authUser, loading } = useAuth();

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }
  if (authUser) return <Navigate to="/" replace />

  return <>{children}</>;
}