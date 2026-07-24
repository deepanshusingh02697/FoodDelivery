import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "react-toastify";
import type {
  DeleteMenuItem_Mutation_Interface,
  MyRestaurantMenu_Query_Interface,
  ToggleMenuItemAvailability_Mutation_Interface,
  UpdateStock_Mutation_Interface,
} from "../graphql/Client";
import { MY_RESTAURANT_MENU_Query } from "../graphql/Query";
import {
  DELETE_MENU_ITEM_Mutation,
  TOGGLE_MENU_ITEM_AVAILABILITY_Mutation,
  UPDATE_STOCK_Mutation,
} from "../graphql/Mutation";
import { NavLink } from "react-router-dom";

export default function OwnerMenu() {
  const { data, loading, refetch } = useQuery<MyRestaurantMenu_Query_Interface>(
    MY_RESTAURANT_MENU_Query,
  );

  const [toggleAvailability] =
    useMutation<ToggleMenuItemAvailability_Mutation_Interface>(
      TOGGLE_MENU_ITEM_AVAILABILITY_Mutation,
    );
  const [updateStock] = useMutation<UpdateStock_Mutation_Interface>(
    UPDATE_STOCK_Mutation,
  );
  const [deleteMenuItem] = useMutation<DeleteMenuItem_Mutation_Interface>(
    DELETE_MENU_ITEM_Mutation,
  );

  const [stockEdits, setStockEdits] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const items = data?.MyRestaurantMenu ?? [];

  const handleToggle = async (menuItemId: string) => {
    try {
      const { data } = await toggleAvailability({ variables: { menuItemId } });
      if (data?.ToggleMenuItemAvailability?.success) {
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Couldn't update availability",
      );
    }
  };

  const handleStockSave = async (menuItemId: string) => {
    const value = stockEdits[menuItemId];
    if (value === undefined || value === "") return;

    try {
      const { data } = await updateStock({
        variables: { menuItemId, stockQuantity: Number(value) },
      });
      if (data?.UpdateStock?.success) {
        toast.success("Stock updated");
        setStockEdits((prev) => {
          const next = { ...prev };
          delete next[menuItemId];
          return next;
        });
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Couldn't update stock");
    }
  };

  const handleDelete = async (menuItemId: string) => {
    if (!confirm("Delete this menu item? This can't be undone.")) return;

    setDeletingId(menuItemId);
    try {
      const { data } = await deleteMenuItem({ variables: { menuItemId } });
      if (data?.DeleteMenuItem?.success) {
        toast.success(data.DeleteMenuItem.msg);
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Couldn't delete item");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-6 py-10  mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Menu Items</h1>
          <p className="text-gray-400 mt-1">Manage your restaurant's dishes</p>
        </div>

        <button
          className="bg-red-500 px-5 py-3 rounded-xl font-bold hover:bg-red-600"
        >
          <NavLink to="/owner/addmenu">+ Add Item</NavLink>
        </button>
      </div>

      {loading && <p className="text-gray-400 mt-10">Loading menu...</p>}

      {!loading && items.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-gray-400">No menu items yet.</p>
        </div>
      )}

      <div className="space-y-4 mt-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[#1d1816] rounded-2xl p-5 flex gap-5"
          >
            <img
              src={
                item.imageUrl ?? "https://placehold.co/120x120?text=No+Image"
              }
              alt={item.name}
              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
            />

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {item.isVeg ? (
                      <span className="text-green-500">
                        <div className="h-4 w-4 bg-green-600"></div>
                      </span>
                    ) : (
                      <span className="text-red-500">
                        <div className="h-4 w-4 bg-red-600"></div>
                      </span>
                    )}
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    {!item.isAvailable && (
                      <span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-1 rounded-full">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{item.category}</p>
                  {item.description && (
                    <p className="text-gray-400 text-sm mt-1">
                      {item.description}
                    </p>
                  )}
                  <p className="font-bold mt-2">₹{item.price}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <input
                      type="checkbox"
                      checked={item.isAvailable}
                      onChange={() => handleToggle(item.id)}
                      className="w-4 h-4"
                    />
                    Available
                  </label>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                  >
                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              {item.trackStock && (
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10">
                  <span className="text-sm text-gray-400">
                    Stock:{" "}
                    <span className="text-white font-medium">
                      {item.stockQuantity}
                    </span>
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="New quantity"
                    value={stockEdits[item.id] ?? ""}
                    onChange={(e) =>
                      setStockEdits((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    className="bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-1.5 text-sm w-32"
                  />
                  <button
                    onClick={() => handleStockSave(item.id)}
                    className="text-sm bg-red-500 px-3 py-1.5 rounded-lg hover:bg-red-600"
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
