import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { CreateMenuItem_Mutation_Interface } from "../graphql/Client";
import { CREATE_MENU_ITEM_Mutation } from "../graphql/Mutation";
import { FaRupeeSign } from "react-icons/fa";


const CATEGORIES = ["Starters", "Main Course", "Breads", "Rice & Biryani", "Desserts", "Beverages","Veges"];

export default function OwnerAddMenu() {
  const navigate = useNavigate();
  const [createMenuItem, { loading: saving }] =
    useMutation<CreateMenuItem_Mutation_Interface>(CREATE_MENU_ITEM_Mutation);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isVeg, setIsVeg] = useState(true);
  const [trackStock, setTrackStock] = useState(false);
  const [stockQuantity, setStockQuantity] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string | undefined> => {
  if (!imageFile) return undefined;

  const formData = new FormData();
  formData.append("foodImage", imageFile);

  setUploading(true);
  try {
    const res = await fetch("http://localhost:4001/upload/food-image", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || "Image upload failed");
    }

    const data = await res.json();
    return data.imageUrl?.secure_url as string;
  } finally {
    setUploading(false);
  }
};

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory(CATEGORIES[0]);
    setIsVeg(true);
    setTrackStock(false);
    setStockQuantity("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !price || !category) {
      toast.error("Name, price, and category are required");
      return;
    }
    if (trackStock && !stockQuantity) {
      toast.error("Enter a stock quantity or turn off stock tracking");
      return;
    }

    try {
      const imageUrl = await uploadImage();

      const { data } = await createMenuItem({
        variables: {
          name: name.trim(),
          description: description.trim() || undefined,
          price: parseFloat(price),
          category,
          isVeg,
          imageUrl,
          trackStock,
          stockQuantity: trackStock ? Number(stockQuantity) : undefined,
        },
      });

      if (data?.CreateMenuItem?.success) {
        toast.success(data.CreateMenuItem.msg);
        resetForm();
        navigate("/owner/menu");
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Couldn't add menu item");
    }
  };

  const busy = saving || uploading;

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-6 py-10  mx-auto">
      <h1 className="text-3xl font-bold">Add Menu Item</h1>
      <p className="text-gray-400 mt-1">Add a new dish to your restaurant's menu</p>

      <form onSubmit={handleSubmit} className="bg-[#1d1816] rounded-2xl p-6 mt-8 space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Food Image</label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-28 h-28 rounded-lg object-cover border border-white/10"
              />
            ) : (
              <div className="w-28 h-28 rounded-lg bg-[#0e0e0e] border border-dashed border-white/20 flex items-center justify-center text-gray-500 text-xs text-center px-2">
                No image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-500 file:text-white hover:file:bg-red-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Paneer Butter Masala"
            className="w-full bg-[#0e0e0e] rounded-lg px-4 py-3 border border-white/10"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description of the dish"
            rows={3}
            className="w-full bg-[#0e0e0e] rounded-lg px-4 py-3 border border-white/10 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm text-gray-400 mb-2  ">Price (<FaRupeeSign />) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="299"
              className="w-full bg-[#0e0e0e] rounded-lg px-4 py-3 border border-white/10"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0e0e0e] rounded-lg px-4 py-3 border border-white/10"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Type *</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsVeg(true)}
              className={`px-5 py-2 rounded-lg border flex items-center gap-1 ${
                isVeg ? "bg-green-500/20 border-green-500 text-green-400" : "border-white/10 text-gray-400"
              }`}
            >
              <div className="h-4 w-4 bg-green-600"></div> Veg
            </button>
            <button
              type="button"
              onClick={() => setIsVeg(false)}
              className={`px-5 py-2 rounded-lg border flex items-center gap-1 ${
                !isVeg ? "bg-red-500/20 border-red-500 text-red-400" : "border-white/10 text-gray-400"
              }`}
            >
              <div className="h-4 w-4 bg-red-600"></div> Non-Veg
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={trackStock}
              onChange={(e) => setTrackStock(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Track stock for this item</span>
          </label>

          {trackStock && (
            <input
              type="number"
              min="0"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              placeholder="Available quantity"
              className="w-full bg-[#0e0e0e] rounded-lg px-4 py-3 border border-white/10 mt-3"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-red-500 py-4 rounded-xl font-bold hover:bg-red-600 disabled:opacity-50"
        >
          {uploading ? "Uploading image..." : saving ? "Adding item..." : "Add Menu Item"}
        </button>
      </form>
    </div>
  );
}