import { useQuery } from "@apollo/client/react";
import type { ADMIN_DASHBOARD_Interface } from "../graphql/Client";
import { ADMIN_DASHBOARD_INTERFACE } from "../graphql/Query";
import { FaRupeeSign } from "react-icons/fa";

export default function AdminDashbord() {
  const { data, loading } = useQuery<ADMIN_DASHBOARD_Interface>(
    ADMIN_DASHBOARD_INTERFACE,
  );

  const admindata = data?.GetAdminDahsboard;

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-10 mx-auto sm:px-8">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      <p className="text-gray-400 mt-1">Revenue, orders and Platform</p>

      {loading && <p className="text-gray-400 mt-10">Loading...</p>}

      {!loading && admindata && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-[#1d1816] rounded-2xl p-6">
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold mt-2 flex items-center gap-1">
                <FaRupeeSign />
                {admindata.totalRevenue}
              </p>
            </div>

            <div className="bg-[#1d1816] rounded-2xl p-6">
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold mt-2">{admindata.totalOrders}</p>
            </div>

            <div className="bg-[#1d1816] rounded-2xl p-6">
              <p className="text-gray-400 text-sm">Restaurants</p>
              <p className="text-2xl font-bold mt-2">
                {admindata.totalRestaurants}
              </p>
            </div>

            <div className="bg-[#1d1816] rounded-2xl p-6">
              <p className="text-gray-400 text-sm">Customers</p>
              <p className="text-2xl font-bold mt-2">
                {admindata.totalCustomers}
              </p>
            </div>

            <div className="bg-[#1d1816] rounded-2xl p-6">
              <p className="text-gray-400 text-sm">Pending Approvals</p>
              <p className="text-2xl font-bold mt-2">
                {admindata.pendingRestaurants}
              </p>
            </div>
          </div>

          <div className="bg-[#1d1816] rounded-2xl p-6 mt-6">
            <h2 className="font-bold text-xl mb-4">Orders by Status</h2>

            {!admindata.ordersByStatus.length && (
              <p className="text-gray-400">No orders yet.</p>
            )}

            <div className="space-y-3">
              {admindata.ordersByStatus.map((s) => (
                <div
                  key={s.status}
                  className="flex justify-between border-b border-[#5f5955] pb-2"
                >
                  <span className="text-gray-300">{s.status}</span>
                  <span className="text-gray-400">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
