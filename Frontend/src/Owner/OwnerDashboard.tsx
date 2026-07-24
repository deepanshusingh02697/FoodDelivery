import { useQuery } from "@apollo/client/react";
import { RESTAURANT_ORDERS_Query } from "../graphql/Query";
import type { RestaurantOrders_Query_Interface } from "../graphql/Client";
import OwnerMenu from "./OwnerMenu";
import OwnerOrderView from "./OwnerOrderView";

export default function OwnerDashboard() {
  const { data } = useQuery<RestaurantOrders_Query_Interface>(
    RESTAURANT_ORDERS_Query,
  );

  const orders = data?.RestaurantOrders ?? [];
  const pendingCount = orders.filter((o) => o.status === "PLACED").length;
  const preparingCount = orders.filter((o) => o.status === "PREPARING").length;

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-6 py-10  mx-auto">
      <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>
      <p className="text-gray-400 mt-1">Manage menu and orders</p>

      <div className="grid grid-cols-3 gap-5 mt-8">
        <div className="bg-[#1d1816] rounded-2xl p-6">
          <p className="text-3xl font-bold">{orders.length}</p>
          <p className="text-gray-400 mt-1">Total Orders</p>
        </div>
        <div className="bg-[#1d1816] rounded-2xl p-6">
          <p className="text-3xl font-bold text-red-400">{pendingCount}</p>
          <p className="text-gray-400 mt-1">Awaiting Response</p>
        </div>
        <div className="bg-[#1d1816] rounded-2xl p-6">
          <p className="text-3xl font-bold text-orange-400">{preparingCount}</p>
          <p className="text-gray-400 mt-1">Preparing</p>
        </div>
      </div>

      <div className="grid grid-cols gap-5 mt-8 sm:grid-cols-2 ">
        <div className="bg-[#1d1816] rounded-2xl p-8 hover:border-red-500 border border-transparent transition">
          <OwnerMenu />
        </div>

        <div className="bg-[#1d1816] rounded-2xl p-8 hover:border-red-500 border border-transparent transition">
          <OwnerOrderView />
        </div>
      </div>
    </div>
  );
}
