import {Routes,Route, Navigate} from 'react-router-dom'
import Login from './AuthComponent/Login';
import Signup from './AuthComponent/Signup';
import PublicRoute from './PublicProtectedRoute/PublicRoute';
import AuthLayout from './Layout/AuthLayout';
import ProtectedRoute from './PublicProtectedRoute/ProtectedRoute';
import CustomerLayout from './Layout/CustomerLayout';
import AdminLayout from './Layout/AdminLayout';
import OwnerLayout from './Layout/OwnerLayout';


export default function App() {
  return (
    <Routes>
      <Route
        element={
          <PublicRoute>
            <AuthLayout/>
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
        {/* <Route index element={<HomeEvent />} />
        <Route path="profile" element={<Profile />} />
        <Route path="joinedevent" element={<JoinEvent />} />
        <Route path="event/:eventId" element={<EventDetails />} />
        <Route path="chat/:chatId" element={<ChatDetails />} /> */}
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* <Route index element={<AEvents />} />
        <Route path="users" element={<AUsers />} />
        <Route path="createevent" element={<ACreateEvent />} />
        <Route path="viewevent/:viewId" element={<AdminViewEvent />} /> */}
      </Route>
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRole="OWNER">
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        {/* <Route index element={<AEvents />} />
        <Route path="users" element={<AUsers />} />
        <Route path="createevent" element={<ACreateEvent />} />
        <Route path="viewevent/:viewId" element={<AdminViewEvent />} /> */}
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

