import { useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { CreateMenuItem_Mutation_Interface } from "../graphql/Client";
import { CREATE_MENU_ITEM_Mutation } from "../graphql/Mutation";
import { FaRupeeSign } from "react-icons/fa";
import { CombinedGraphQLErrors } from "@apollo/client";
import { MY_RESTAURANT_MENU_Query } from "../graphql/Query";

const CATEGORIES = [
  "Starters",
  "Main Course",
  "Breads",
  "Rice & Biryani",
  "Desserts",
  "Beverages",
  "Veges",
];

export default function OwnerAddMenu() {
  const navigate = useNavigate();
  const [createMenuItem, { loading: saving }] =
    useMutation<CreateMenuItem_Mutation_Interface>(CREATE_MENU_ITEM_Mutation, {
      refetchQueries: [
        {
          query: MY_RESTAURANT_MENU_Query,
        },
      ],
    });

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
  const menuError = {
    name: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
  };
  const [error, setError] = useState(menuError);

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const vegButtonRef = useRef<HTMLButtonElement>(null);

  const validateMenuItem = () => {
    const errors = {
      name: "",
      description: "",
      price: "",
      category: "",
      stockQuantity: "",
    };
    let isValid = true;
    const menuName = name.trim();
    if (!menuName) {
      errors.name = "Name is required";
      isValid = false;
    } else if (menuName.length < 3) {
      errors.name = "Name must be at least 3 characters long";
      isValid = false;
    } else if (menuName.length > 100) {
      errors.name = "Name cannot exceed 100 characters";
      isValid = false;
    }
    const desc = description.trim();
    if (desc && desc.length > 500) {
      errors.description = "Description cannot exceed 500 characters";
      isValid = false;
    }
    if (!price.trim()) {
      errors.price = "Price is required";
      isValid = false;
    } else {
      const value = Number(price);
      if (Number.isNaN(value)) {
        errors.price = "Price must be a valid number";
        isValid = false;
      } else if (value <= 0) {
        errors.price = "Price must be greater than 0";
        isValid = false;
      }
    }
    const cat = category.trim();
    if (!cat || cat === "Starters") {
      errors.category = "Category is required";
      isValid = false;
    } else if (cat.length < 2) {
      errors.category = "Category must be at least 2 characters";
      isValid = false;
    } else if (cat.length > 30) {
      errors.category = "Category cannot exceed 30 characters";
      isValid = false;
    }
    if (trackStock) {
      if (!stockQuantity.trim()) {
        errors.stockQuantity = "Stock quantity is required";
        isValid = false;
      } else {
        const qty = Number(stockQuantity);
        if (Number.isNaN(qty)) {
          errors.stockQuantity = "Stock quantity must be a number";
          isValid = false;
        } else if (qty < 0) {
          errors.stockQuantity = "Stock quantity cannot be negative";
          isValid = false;
        }
      }
    }
    setError(errors);
    return isValid;
  };
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
    if (!validateMenuItem()) return;

    try {
      const imageUrl = await uploadImage();

      const { data } = await createMenuItem({
        variables: {
          input: {
            name: name.trim(),
            description: description.trim() || undefined,
            price: !price ? 0.0 : parseFloat(price),
            category,
            isVeg,
            imageUrl,
            trackStock,
            stockQuantity: trackStock ? Number(stockQuantity) : undefined,
          },
        },
      });

      if (data?.CreateMenuItem?.success) {
        toast.success(data.CreateMenuItem.msg);
        resetForm();
        navigate("/owner/menu");
      }
    } catch (error: unknown) {
      // console.error(err);
      // toast.error(err instanceof Error ? err.message : "Couldn't add menu item");
      if (CombinedGraphQLErrors.is(error)) {
        const graphError = error.errors?.[0];

        if (!graphError.extensions?.field) {
          toast(error.message, {
            position: "top-right",
            type: "error",
          });

          return;
        }

        const field = graphError.extensions?.field;
        const message = graphError.message;

        toast(message, {
          position: "top-right",
          type: "error",
        });

        switch (field) {
          case "name":
            nameRef.current?.focus();
            break;

          case "price":
            priceRef.current?.focus();
            break;

          case "category":
            categoryRef.current?.focus();
            break;

          case "isVeg":
            vegButtonRef.current?.focus();
            break;
          case "description":
            descriptionRef.current?.focus();
        }
      } else if (error instanceof Error) {
        toast(error.message, {
          position: "top-right",
          type: "error",
        });
      } else {
        toast("Something wrong.", {
          position: "top-right",
          type: "error",
        });
      }
    }
  };

  const busy = saving || uploading;

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-6 py-10  mx-auto">
      <h1 className="text-3xl font-bold">Add Menu Item</h1>
      <p className="text-gray-400 mt-1">
        Add a new dish to your restaurant's menu
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-[#1d1816] rounded-2xl p-6 mt-8 space-y-5"
      >
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
            onChange={(e) => {
              setName(e.target.value);
              setError((prev) => ({
                ...prev,
                name: "",
              }));
            }}
            placeholder="e.g. Paneer Butter Masala"
            className="w-full bg-[#0e0e0e] rounded-lg px-4 py-3 border border-white/10"
            ref={nameRef}
          />
          {error.name && (
            <p className="text-red-500 text-sm mt-1">{error.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError((prev) => ({
                ...prev,
                description: "",
              }));
            }}
            placeholder="Short description of the dish"
            rows={3}
            className="w-full bg-[#0e0e0e] rounded-lg px-4 py-3 border border-white/10 resize-none"
            ref={descriptionRef}
          />
          {error.description && (
            <p className="text-red-500 text-sm mt-1">{error.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm text-gray-400 mb-2  ">
              Price (<FaRupeeSign />) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setError((prev) => ({
                  ...prev,
                  price: "",
                }));
              }}
              placeholder="299"
              className="w-full bg-[#0e0e0e] rounded-lg px-4 py-3 border border-white/10"
              ref={priceRef}
            />
            {error.price && (
              <p className="text-red-500 text-sm mt-1">{error.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setError((prev) => ({
                  ...prev,
                  category: "",
                }));
              }}
              className="w-full bg-[#0e0e0e] rounded-lg px-4 py-3 border border-white/10"
              ref={categoryRef}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {error.category && (
              <p className="text-red-500 text-sm mt-1">{error.category}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Type *</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsVeg(true)}
              className={`px-5 py-2 rounded-lg border flex items-center gap-1 ${
                isVeg
                  ? "bg-green-500/20 border-green-500 text-green-400"
                  : "border-white/10 text-gray-400"
              }`}
            >
              <div className="h-4 w-4 bg-green-600"></div> Veg
            </button>
            <button
              type="button"
              ref={vegButtonRef}
              onClick={() => setIsVeg(false)}
              className={`px-5 py-2 rounded-lg border flex items-center gap-1 ${
                !isVeg
                  ? "bg-red-500/20 border-red-500 text-red-400"
                  : "border-white/10 text-gray-400"
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
              onChange={(e) => {
                setStockQuantity(e.target.value);
                setError((prev) => ({
                  ...prev,
                  stockQuantity: "",
                }));
              }}
              placeholder="Available quantity"
              className="w-full bg-[#0e0e0e] rounded-lg px-4 py-3 border border-white/10 mt-3"
            />
          )}
          {error.stockQuantity && (
            <p className="text-red-500 text-sm mt-1">{error.stockQuantity}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-red-500 py-4 rounded-xl font-bold hover:bg-red-600 disabled:opacity-50"
        >
          {uploading
            ? "Uploading image..."
            : saving
              ? "Adding item..."
              : "Add Menu Item"}
        </button>
      </form>
    </div>
  );
}
