import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useLocation, useParams } from "react-router-dom";

import {
  type CrestruarantMenus_Query_Interface,
  type DecreaseCartItem_Mutation_Interface,
  type GetCart_Query_Interface,
  type GetRestaurant_Detail_Interface,
  type PostAdd_To_Cart_Interface,
} from "../graphql/Client";

import {
  CrestruarantMenus_Query,
  GET_CART_Query,
  Restaurant_Detail_Query,
} from "../graphql/Query";
import MenuCard from "./Component/MenuCard";
import { NavLink } from "react-router-dom";

import { setCart } from "../Redux/Slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import {
  ADD_TO_CART_Mutation,
  DECREASE_CART_ITEM_Mutation,
} from "../graphql/Mutation";
import { FaStar } from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa";
import { toast } from "react-toastify";
import Feedback from "./Component/Feedback";

export default function RestaurantDetail() {
  const { restoId } = useParams();
  const [searchVal, setSearchVal] = useState("");
  const [averageRating, setAverageRating] = useState(0);

  const { data } = useQuery<CrestruarantMenus_Query_Interface>(
    CrestruarantMenus_Query,
    {
      variables: {
        restaurantId: Number(restoId),
      },
    },
  );
  const location = useLocation();
  const locRating = location.state.rating ?? 0;

  const { data: RestoDetail } = useQuery<GetRestaurant_Detail_Interface>(
    Restaurant_Detail_Query,
    {
      variables: {
        restaurantId: Number(restoId),
      },
    },
  );
  const restoDdata = RestoDetail?.GetReaturantDetail;

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const { data: cartData } = useQuery<GetCart_Query_Interface>(GET_CART_Query, {
    variables: { restaurantId: restoId },
    skip: !restoId,
  });

  const [addToCartMutation] =
    useMutation<PostAdd_To_Cart_Interface>(ADD_TO_CART_Mutation);

  const [decreaseCartItemMutation] =
    useMutation<DecreaseCartItem_Mutation_Interface>(
      DECREASE_CART_ITEM_Mutation,
    );

  useEffect(() => {
    if (cartData?.GetCart) {
      dispatch(setCart(cartData?.GetCart));
    }
  }, [cartData, dispatch]);

  const menus = data?.GetMenuItems ?? [];

  const categories = ["All", ...new Set(menus.map((m) => m.category))];

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      const matchCat =
        selectedCategory === "All" || menu.category === selectedCategory;

      const matchSear =
        menu.name.toLowerCase().includes(searchVal.toLocaleLowerCase()) ||
        menu.category.toLowerCase().includes(searchVal.toLocaleLowerCase());

      return matchCat && matchSear;
    });
  }, [menus, selectedCategory, searchVal]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.priceAtAdd * item.quantity,
    0,
  );

  const getQuantity = (menuItemId: string) =>
    cartItems.find((item) => item.menuItem.id === menuItemId)?.quantity ?? 0;

  const getCartItemId = (menuItemId: string) =>
    cartItems.find((item) => item.menuItem.id === menuItemId)?.id;

  const handleAdd = async (menuItemId: string) => {
    try {
      const { data } = await addToCartMutation({
        variables: { input:{menuItemId, quantity: 1} },
      });
      if (data?.AddToCart?.success) {
        dispatch(setCart(data?.AddToCart?.cart));
      }
    } catch (err) {
      const error = err as Error;
      toast(error.message, {
        position: "top-right",
        type: "info",
      });
    }
  };

  const handleIncrease = (menuItemId: string) => handleAdd(menuItemId);

  const handleDecrease = async (menuItemId: string) => {
    const cartItemId = getCartItemId(menuItemId);
    if (!cartItemId) return;

    try {
      const { data } = await decreaseCartItemMutation({
        variables: { cartItemId },
      });
      if (data?.DecreaseCartItem?.success) {
        dispatch(setCart(data.DecreaseCartItem.cart));
      }
    } catch (err) {
      const error = err as Error;
      toast(error.message, {
        position: "top-right",
        type: "info",
      });
    }
  };
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <div
        className="h-85 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544025162-d76694265947?w=1600')",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6">
          <span className="bg-green-500 px-3 py-1 rounded text-sm">OPEN</span>

          <h1 className="text-5xl font-bold mt-3">
            {restoDdata?.restaurantName}
          </h1>

          <p className="text-gray-300 mt-2">{restoDdata?.cuisine}</p>

          <div className="flex gap-8 mt-5 text-gray-300">
            <span className="flex items-center gap-1">
              <span className="text-amber-400">
                <FaStar />
              </span>
              {averageRating
                ? averageRating.toFixed(1)
                : locRating
                  ? locRating.toFixed(1)
                  : "0.0"}
            </span>
            <span>28-35 min</span>
            <span className="flex items-center gap-1">
              <FaRupeeSign /> 29 Delivery
            </span>
          </div>
        </div>
      </div>

      <Feedback
        restaurantId={Number(restoId)}
        onRatingChange={setAverageRating}
      />

      <div className="max-w-7xl mx-auto px-2 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <input
            placeholder="Search within menu..."
            className="w-full bg-[#1f1b19] rounded-xl p-4 mb-6"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />

          <div className="flex gap-3 overflow-auto mb-8 mx-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-lg whitespace-nowrap ${
                  selectedCategory === cat ? "bg-red-500" : "bg-[#1d1816]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-5">
            {filteredMenus.map((item) => (
              <MenuCard
                key={item.id}
                menu={item}
                quantity={getQuantity(item.id)}
                onAdd={() => handleAdd(item.id)}
                onIncrease={() => handleIncrease(item.id)}
                onDecrease={() => handleDecrease(item.id)}
              />
            ))}
          </div>
        </div>

        <div className="sticky top-24 space-y-5 sm:mx-2.5">
          <div className="bg-[#1d1816] rounded-2xl p-6">
            {cartItems.length === 0 ? (
              <>
                <div className="text-5xl text-center">🛒</div>

                <h2 className="text-center text-xl font-bold mt-4">
                  Your cart is empty
                </h2>

                <p className="text-gray-400 text-center mt-2">
                  Add items from menu
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-between mb-5">
                  <h2 className="font-bold">{cartItems.length} items added</h2>

                  <h2 className="text-red-500 font-bold flex items-center gap-1">
                    <FaRupeeSign />
                    {total}
                  </h2>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.quantity}{" "}
                        <span className="text-center items-center">*</span>{" "}
                        {item.menuItem.name}
                      </span>

                      <span className="flex items-center gap-1">
                        <FaRupeeSign /> {item.priceAtAdd * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full bg-red-500 py-4 rounded-xl font-bold flex justify-center">
                  <NavLink to="/cart" className="flex items-center gap-1">
                    View Cart <FaRupeeSign />
                    {total}
                  </NavLink>
                </button>
              </>
            )}
          </div>

          <div className="bg-[#1d1816] rounded-2xl p-6">
            <h2 className="font-bold text-xl mb-4">Available Offers</h2>

            <div className="space-y-4">
              <div>
                <p className="text-red-500 font-bold">FIRST50</p>

                <p className="text-gray-400 text-sm flex items-center gap-1">
                  50% off up to <FaRupeeSign />
                  100
                </p>
              </div>

              <div>
                <p className="text-red-500 font-bold">PARTY20</p>

                <p className="text-gray-400 text-sm flex items-center gap-1">
                  20% off above <FaRupeeSign />
                  499
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
