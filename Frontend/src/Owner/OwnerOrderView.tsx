import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "react-toastify";
import type {
  AssignDeliveryPartner_Mutation_Interface,
  AvailableDeliveryPartners_Query_Interface,
  RestaurantOrders_Query_Interface,
  UpdateOrderStatus_Mutation_Interface,
} from "../graphql/Client";
import {
  AVAILABLE_DELIVERY_PARTNERS_Query,
  RESTAURANT_ORDERS_Query,
} from "../graphql/Query";
import {
  ASSIGN_DELIVERY_PARTNER_Mutation,
  UPDATE_ORDER_STATUS_Mutation,
} from "../graphql/Mutation";

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - Number(iso)) / 60000);
  console.log(mins);  

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  return `${Math.floor(mins / 60)} hr ago`;
}

const STATUS_BADGE: Record<string, string> = {
  PLACED: "bg-red-500 text-white",
  PREPARING: "bg-orange-500/20 text-orange-400",
  OUT_FOR_DELIVERY: "bg-blue-500/20 text-blue-400",
  DELIVERED: "bg-green-500/20 text-green-400",
  CANCELED: "bg-gray-500/20 text-gray-400",
};

const STATUS_LABEL: Record<string, string> = {
  PLACED: "New",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELED: "Cancelled",
};

export default function OwnerOrderView() {
  const { data, loading, refetch } = useQuery<RestaurantOrders_Query_Interface>(
    RESTAURANT_ORDERS_Query,
  );
  const { data: partnersData } =
    useQuery<AvailableDeliveryPartners_Query_Interface>(
      AVAILABLE_DELIVERY_PARTNERS_Query,
    );

  const [updateOrderStatus] = useMutation<UpdateOrderStatus_Mutation_Interface>(
    UPDATE_ORDER_STATUS_Mutation,
  );
  const [assignDeliveryPartner] =
    useMutation<AssignDeliveryPartner_Mutation_Interface>(
      ASSIGN_DELIVERY_PARTNER_Mutation,
    );

  const [selectedPartner, setSelectedPartner] = useState<
    Record<string, string>
  >({});
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const orders = data?.RestaurantOrders ?? [];
  const partners = partnersData?.AvailableDeliveryPartners ?? [];

  const handleUpdateStatus = async (
    orderId: string,
    status: "PREPARING" | "CANCELED",
  ) => {
    try {
      const { data } = await updateOrderStatus({
        variables: { orderId, status },
      });
      if (data?.UpdateOrderStatus?.success) {
        toast.success(
          status === "PREPARING" ? "Order accepted" : "Order rejected",
        );
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Couldn't update order");
    }
  };

  const handleAssign = async (orderId: string) => {
    const deliveryPartnerId = selectedPartner[orderId];
    if (!deliveryPartnerId) {
      toast.error("Select a delivery partner first");
      return;
    }

    setAssigningId(orderId);
    try {
      const { data } = await assignDeliveryPartner({
        variables: { input:{orderId, deliveryPartnerId} },
      });
      if (data?.AssignDeliveryPartner?.success) {
        toast.success(data.AssignDeliveryPartner.msg);
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Couldn't assign delivery partner",
      );
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-6 py-10 mx-auto">
      <h1 className="text-3xl font-bold">Orders</h1>
      <p className="text-gray-400 mt-1">
        Accept, reject, and assign deliveries
      </p>

      {loading && <p className="text-gray-400 mt-10">Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <p className="text-gray-400 mt-16 text-center">No orders yet.</p>
      )}

      <div className="space-y-4 mt-8">
        {orders.map((order) => (
          <div key={order.id} className="bg-[#1d1816] rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-start">
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-semibold h-fit ${STATUS_BADGE[order.status]}`}
                >
                  {STATUS_LABEL[order.status]}
                </span>

                <div>
                  <p className="text-gray-400 text-sm">
                    {timeAgo(order.placedAt)}
                  </p>
                  <p className="mt-1">
                    {order.items
                      .map(
                        (i) =>
                          `${i.nameSnapshot}${i.quantity > 1 ? ` X  ${ i.quantity}` : ""}`,
                      )
                      .join(", ")}
                  </p>
                </div>
              </div>

              <span className="font-bold text-lg">₹{order.totalAmount}</span>
            </div>

            {order.status === "PLACED" && (
              <div className="flex gap-3 mt-4  w-full justify-end">
                <button
                  onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                  className="bg-red-500 px-5 py-2 rounded-lg font-semibold hover:bg-red-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleUpdateStatus(order.id, "CANCELED")}
                  className="border border-white/20 px-5 py-2 rounded-lg hover:bg-white/10"
                >
                  Reject
                </button>
              </div>
            )}

            {order.status === "PREPARING" && (
              <div className="flex gap-3 mt-4 items-center border-t border-white/10 pt-4">
                <select
                  value={selectedPartner[order.id] ?? ""}
                  onChange={(e) =>
                    setSelectedPartner((prev) => ({
                      ...prev,
                      [order.id]: e.target.value,
                    }))
                  }
                  className="bg-[#0e0e0e] border border-white/10 rounded-lg px-4 py-2 flex-1"
                >
                  <option value="">Select delivery partner...</option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstname} {p.lastname} {p.phone ? `· ${p.phone}` : ""}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleAssign(order.id)}
                  disabled={assigningId === order.id}
                  className="bg-red-500 px-5 py-2 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50"
                >
                  {assigningId === order.id ? "Assigning..." : "Assign"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
