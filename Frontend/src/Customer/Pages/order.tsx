import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import type {
  MyOrders_Query_Interface,
  Order_Interface,
  UpdateOrderStatus_Mutation_Interface,
} from "../../graphql/Client";
import { MY_ORDERS_Query } from "../../graphql/Query";
import { FaRupeeSign } from "react-icons/fa";
import { useState } from "react";
import { UPDATE_ORDER_STATUS_Mutation } from "../../graphql/Mutation";
import { toast } from "react-toastify";

const STATUS_STYLES: Record<Order_Interface["status"], string> = {
  DELIVERED: "bg-green-500/20 text-green-400",
  CANCELED: "bg-red-500/20 text-red-400",
  PLACED: "bg-yellow-500/20 text-yellow-400",
  PREPARING: "bg-violet-500/20 text-violet-400",
  OUT_FOR_DELIVERY: "bg-blue-500/20 text-blue-400",
};

const STATUS_LABELS: Record<Order_Interface["status"], string> = {
  DELIVERED: "Delivered",
  CANCELED: "Cancelled",
  PLACED: "Placed",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for delivery",
};

export default function Orders() {
  const navigate = useNavigate();
  const [filterOrder, setFilterOrder] = useState<
    "ALL" | Order_Interface["status"]
  >("ALL");

  const { data, loading, refetch } =
    useQuery<MyOrders_Query_Interface>(MY_ORDERS_Query);

  const [updateOrderStatus] = useMutation<UpdateOrderStatus_Mutation_Interface>(
    UPDATE_ORDER_STATUS_Mutation,
  );

  const orders = data?.MyOrders ?? [];

  const filterorders =
    filterOrder === "ALL"
      ? orders
      : orders.filter((order) => order.status === filterOrder);

  const handleCancelOrder = async (orderId: string, status: "CANCELED") => {
    try {
      const { data } = await updateOrderStatus({
        variables: { input:{orderId, status} },
      });
      if (data?.UpdateOrderStatus?.success) {
        toast.success(data?.UpdateOrderStatus?.msg, {
          position: "top-right",
          type: "success",
        });
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Couldn't update order");
    }
  };
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-6 py-10 mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">My Orders</h1>
        </div>

        <select
          value={filterOrder}
          onChange={(e) =>
            setFilterOrder(e.target.value as "ALL" | Order_Interface["status"])
          }
          className="bg-[#1d1816] border border-white/10 rounded-lg px-4 py-2"
        >
          <option value="ALL">All Orders</option>
          <option value="PLACED">Placed</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELED">Cancelled</option>
          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
          <option value="PREPARING">Preparing</option>
        </select>
      </div>

      {loading && <p className="text-gray-400 mt-10">Loading orders...</p>}

      {!loading && filterorders.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-gray-400">
            {filterOrder === "ALL"
              ? "Not placed any orders yet."
              : `No ${STATUS_LABELS[filterOrder]} orders found.`}
          </p>

          {filterOrder === "ALL" && (
            <button
              onClick={() => navigate("/discover")}
              className="mt-6 bg-red-500 px-6 py-3 rounded-xl font-bold hover:bg-red-600"
            >
              Browse Restaurants
            </button>
          )}
        </div>
      )}

      <div className="space-y-5 mt-8">
        {filterorders.map((order) => (
          <div key={order.id} className="bg-[#1d1816] rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-bold text-xl">
                    {order.restaurant.restaurantName}
                  </h2>
                </div>

                <p className="text-gray-400 mt-2">
                  {order.items
                    .map(
                      (i) =>
                        `${i.nameSnapshot}${i.quantity > 1 ? ` x ${i.quantity}` : ""}`,
                    )
                    .join(" , ")}
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  {new Date(Number(order.placedAt)).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="text-right space-y-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLES[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>

                <p className="font-bold text-lg flex items-center gap-1 justify-end">
                  <FaRupeeSign />
                  {order.totalAmount}
                </p>

                <div className="flex gap-2 justify-end">
                  {order.status === "OUT_FOR_DELIVERY" && (
                    <button
                      onClick={() => navigate(`/track/${order.id}`)}
                      className="bg-red-500 px-5 py-2 rounded-lg font-semibold hover:bg-red-600"
                    >
                      Track
                    </button>
                  )}

                  {order.status === "PLACED" && (
                    <button
                      onClick={() => handleCancelOrder(order?.id, "CANCELED")}
                      className="bg-orange-400 px-3 p1-2 rounded-lg font-semibold hover:bg-orange-500"
                    >
                      Cancel Order
                    </button>
                  )}

                  <button
                    onClick={() =>
                      navigate(`/restaurant/${order.restaurant.id}`)
                    }
                    className="border border-white/20 px-5 py-2 rounded-lg hover:bg-white/10"
                  >
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
