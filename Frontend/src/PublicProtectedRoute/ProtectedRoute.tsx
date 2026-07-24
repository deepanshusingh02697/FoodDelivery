import { Navigate } from "react-router-dom";
import { useAppSelector } from "../Redux/hooks";

interface Props {
  children: React.ReactNode;
  allowedRole?: string;
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate
        to={
          user.role === "ADMIN"
            ? "/admin"
            : user.role === "OWNER"
              ? "/owner"
              : "/"
        }
        replace
      />
    );
  }

  return <>{children}</>;
}
