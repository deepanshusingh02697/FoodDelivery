import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import type { MyOrders_Query_Interface } from "../../graphql/Client";
import { MY_ORDERS_Query } from "../../graphql/Query";
import { FaRupeeSign } from "react-icons/fa";


export default function TrackDelivery() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data, loading } = useQuery<MyOrders_Query_Interface>(MY_ORDERS_Query);

  const order = data?.MyOrders.find((item) => item.id === orderId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col items-center justify-center">
        <h2>Order not found</h2>

        <button
          onClick={() => navigate("/orders")}
          className="mt-5 bg-red-500 px-5 py-3 rounded-lg"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white p-8  mx-auto">
      <h1 className="text-3xl font-bold">Track Order</h1>


      <p className="text-gray-400">
        Restaurant: {order.restaurant.restaurantName}
      </p>

      <div className="bg-[#1d1816] rounded-xl p-5 mt-6">
        <h2 className="font-bold">Current Status</h2>

        <p className="mt-2 text-xl text-red-400">{order.status}</p>
      </div>

      {order.deliveryPartner && (
        <div className="bg-[#1d1816] rounded-xl p-5 mt-6">
          <h2 className="font-bold">Delivery Partner</h2>

          <p className="mt-2">
            {order.deliveryPartner.firstname} {order.deliveryPartner.lastname}
          </p>

          {order.deliveryPartner.phone && (
            <a
              href={`tel:${order.deliveryPartner.phone}`}
              className="inline-block mt-4 bg-red-500 px-5 py-2 rounded-lg"
            >
              Call Partner
            </a>
          )}
        </div>
      )}

      <div className="bg-[#1d1816] rounded-xl p-5 mt-6">
        <h2 className="font-bold mb-4">Order Items</h2>

        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between mb-3">
            <span>
              {item.nameSnapshot} X {item.quantity}
            </span>

            <span className="flex items-center gap-1"><FaRupeeSign/>{item.priceSnapshot * item.quantity}</span>
          </div>
        ))}

        <hr className="border-white/10 my-4" />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span className="flex items-center gap-1"> <FaRupeeSign/>{order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
}
