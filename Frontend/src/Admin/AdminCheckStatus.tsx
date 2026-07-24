import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import type { ApproveRestaurant_Mutation_Interface, GetPendingRestaurants_Query_Interface, RejectRestaurant_Mutation_Interface } from "../graphql/Client";
import { GET_PENDING_RESTAURANTS_Query } from "../graphql/Query";
import { APPROVE_RESTAURANT_Mutation, REJECT_RESTAURANT_Mutation } from "../graphql/Mutation";



export default function AdminCheckStatus() {
  const { data, loading, refetch } = useQuery<GetPendingRestaurants_Query_Interface>(
    GET_PENDING_RESTAURANTS_Query,
  );

  console.log("Pending restaurants : ",data);
  

  const [approveRestaurant] = useMutation<ApproveRestaurant_Mutation_Interface>(
    APPROVE_RESTAURANT_Mutation,
  );
  const [rejectRestaurant] = useMutation<RejectRestaurant_Mutation_Interface>(
    REJECT_RESTAURANT_Mutation,
  );

  const restaurants = data?.GetPendingRestaurants ?? [];

  const handleApprove = async (restaurantId: string) => {
    try {
      const { data } = await approveRestaurant({ variables: { restaurantId } });
      if (data?.ApproveRestaurant?.success) {
        toast.success(data.ApproveRestaurant.msg);
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Couldn't approve restaurant");
    }
  };

  const handleReject = async (restaurantId: string) => {
    try {
      const { data } = await rejectRestaurant({ variables: { restaurantId } });
      if (data?.RejectRestaurant?.success) {
        toast.success(data.RejectRestaurant.msg);
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Couldn't reject restaurant");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-10  mx-auto sm:px-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-400 mt-1">Review restaurant applications</p>

      {loading && <p className="text-gray-400 mt-10">Loading...</p>}

      {!loading && restaurants.length === 0 && (
        <p className="text-gray-400 mt-10 text-center">No pending applications.</p>
      )}

      <div className="space-y-4 mt-8">
        {restaurants.map((r) => (
          <div key={r.id} className="bg-[#1d1816] rounded-2xl p-6">
            <h2 className="font-bold text-xl">{r.restaurantName}</h2>
            <p className="text-gray-400 mt-1">{r.cuisine} : {r.address}</p>
            <p className="text-gray-500 text-sm mt-1">
              Owner: {r.owner.firstname} {r.owner.lastname} ({r.owner.email})
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleApprove(r.id)}
                className="bg-green-500 px-5 py-2 rounded-lg font-semibold hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(r.id)}
                className="bg-red-500 px-5 py-2 rounded-lg font-semibold hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}