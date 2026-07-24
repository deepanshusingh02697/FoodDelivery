import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./AuthComponent/Login";
import Signup from "./AuthComponent/Signup";
import PublicRoute from "./PublicProtectedRoute/PublicRoute";
import AuthLayout from "./Layout/AuthLayout";
import ProtectedRoute from "./PublicProtectedRoute/ProtectedRoute";
import CustomerLayout from "./Layout/CustomerLayout";
import AdminLayout from "./Layout/AdminLayout";
import OwnerLayout from "./Layout/OwnerLayout";
import Home from "./Customer/Home";
import RestaurantDetail from "./Customer/RestaurantDetail";
import Cart from "./Customer/Pages/Cart";
import Orders from "./Customer/Pages/order";
import OwnerDashboard from "./Owner/OwnerDashboard";
import OwnerAddMenu from "./Owner/OwnerAddMenu";
import OwnerMenu from "./Owner/OwnerMenu";
import OwnerOrderView from "./Owner/OwnerOrderView";
import TrackDelivery from "./Customer/Pages/TrackDelivery";
import DeliveryDashboard from "./Deliver/DeliveryDashboard";
import { useAppDispatch } from "./Redux/hooks";
import { useAuth } from "./Context/AuthContext";
import { useEffect } from "react";
import { loginSuccess, logoutSuccess } from "./Redux/Slices/authSlice";
import AdminCheckStatus from "./Admin/AdminCheckStatus";
import AdminDashbord from "./Admin/AdminDashbord";

export default function App() {
  const dispatch = useAppDispatch();

  const { authUser, loading, error } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (authUser) {
      dispatch(loginSuccess(authUser));
    } else if (error) {
      dispatch(logoutSuccess());
    }
  }, [loading, authUser, error, dispatch]);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="resto/:restoId" element={<RestaurantDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<Orders />} />
        <Route path="/track/:orderId" element={<TrackDelivery />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashbord />} />
        <Route path="checkresto" element={<AdminCheckStatus/>}/>
      </Route>

      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRole="OWNER">
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OwnerDashboard />} />
        <Route path="addmenu" element={<OwnerAddMenu />} />
        <Route path="orderview" element={<OwnerOrderView />} />
        <Route path="menu" element={<OwnerMenu />} />
      </Route>

      <Route
        path="/delivery"
        element={
          <ProtectedRoute allowedRole="DELIVERY_PARTNER">
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DeliveryDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
