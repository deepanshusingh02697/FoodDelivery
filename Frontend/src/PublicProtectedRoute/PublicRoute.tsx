import { Navigate } from "react-router-dom";
import { useAppSelector } from "../Redux/hooks";

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const { user } = useAppSelector((state) => state.auth);

  if (user) {
    switch (user.role) {
      case "ADMIN":
        return <Navigate to="/admin" replace />;
      case "OWNER":
        return <Navigate to="/owner" replace />;
      case "DELIVERY_PARTNER":
        return <Navigate to="/delivery" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}