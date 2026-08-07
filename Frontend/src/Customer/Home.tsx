import { useState } from "react";
import { useQuery } from "@apollo/client/react";

import { useNavigate } from "react-router-dom";
import { GrLocationPin } from "react-icons/gr";
import { FaStar } from "react-icons/fa";
import type {
  FilterRestaurants_Query_Interface,
  FilterRestaurants_Vars,
} from "../graphql/Client";
import { FILTER_RESTAURANTS_Query } from "../graphql/Query";
import CustomerHomeLoad from "../LoadSkeleton/CustomerHomeLoad";

const quickFilters = ["All", "Pure Veg"];

const cuisineOptions = [
  "All Cuisines",
  "North Indian",
  "South Indian",
  "Chinese",
  "Italian",
  "Fast Food",
];

const ratingOptions = [
  { label: "Any Rating", value: undefined },
  { label: "2.0+", value: 2 },
  { label: "3.0+", value: 3 },
  { label: "4.0+", value: 4 },
  { label: "4.5+", value: 4.5 },
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCuisine, setSelectedCuisine] = useState("All Cuisines");
  const [selectedRating, setSelectedRating] = useState<number | undefined>(
    undefined,
  );
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const variables: FilterRestaurants_Vars = {
    input: {
      search: searchText.trim() || undefined,
      cuisine: selectedCuisine !== "All Cuisines" ? selectedCuisine : undefined,
      vegOnly: activeFilter === "Pure Veg" ? true : undefined,
      rating: selectedRating,
    },
  };
  

  const { data, loading, error } = useQuery<FilterRestaurants_Query_Interface>(
    FILTER_RESTAURANTS_Query,
    { variables },
  );

  const restaurants = data?.FilterRestaurants ?? [];

  const handleQuickFilter = (filter: string) => {
  setActiveFilter(filter);

  if (filter === "All") {
    setSelectedCuisine("All Cuisines");
    setSelectedRating(undefined);
    setSearchText("");
  }
};
  if (loading) {
    return <CustomerHomeLoad />;
  }
  return (
    <div>
      <main className="px-4 py-5 md:px-8 md:py-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <p className="flex items-center gap-1 text-sm text-gray-400">
              <span className="text-red-400">
                <GrLocationPin />
              </span>{" "}
              Koramangala, Bangalore
            </p>
            <h1 className="mt-3 text-5xl font-extrabold leading-tight">
              What are you
              <br />
              <span className="text-red-500">craving</span> today?
            </h1>
            <p className="mt-4 text-gray-400">
              2,400+ restaurants · 45 cuisines · delivers in 28 min avg.
            </p>
          </div>
        </div>

        <div className="mt-8 relative rounded-2xl overflow-hidden h-64">
          <img
            src="https://res.cloudinary.com/delubzbh2/image/upload/v1785168203/FoodDelivery/vvaqb96aqiexovnbkxyn.jpg"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 h-full flex flex-col justify-center p-10">
            <span className="text-orange-400 text-xs font-semibold flex items-center gap-1">
              FEATURED TODAY
            </span>
            <h2 className="mt-2 text-3xl font-bold text-[#81A4CD]">
              Spice Garden's Grand Biryani Fest
            </h2>
            <p className="mt-1 text-gray-300">
              Flat 30% off on all biryanis · Limited time
            </p>
            <button className="mt-4 w-fit bg-red-500 hover:bg-red-600 font-semibold rounded-xl px-6 py-2">
              Order Now
            </button>
          </div>
          <div className="absolute top-6 right-6 bg-black/70 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-gray-400">Ends in</p>
            <p className="text-orange-400 font-bold">02:47:33</p>
          </div>
        </div>

        <div className="mt-8">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search restaurants by name..."
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none text-sm text-white"
          />
        </div>

        <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex flex-wrap gap-3 items-center">
            {quickFilters.map((f) => (
              <button
                key={f}
                onClick={() => handleQuickFilter(f)}
                className={`rounded-full px-4 py-2 text-sm border ${
                  activeFilter === f
                    ? "border-red-500 text-red-400"
                    : "border-zinc-800 text-gray-400 hover:border-zinc-600"
                }`}
              >
                {f}
              </button>
            ))}

            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="rounded-full px-4 py-2 text-sm border border-zinc-800 bg-transparent text-gray-400 hover:border-zinc-600 outline-none"
            >
              {cuisineOptions.map((c) => (
                <option key={c} value={c} className="bg-zinc-900">
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedRating ?? ""}
              onChange={(e) =>
                setSelectedRating(
                  e.target.value === "" ? undefined : Number(e.target.value),
                )
              }
              className="rounded-full px-4 py-2 text-sm border border-zinc-800 bg-transparent text-gray-400 hover:border-zinc-600 outline-none"
            >
              {ratingOptions.map((r) => (
                <option
                  key={r.label}
                  value={r.value ?? ""}
                  className="bg-zinc-900"
                >
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <span className="text-lg text-gray-500">
            {loading ? "..." : `${restaurants.length} restaurants`}
          </span>
        </div>

        {error && (
          <p className="text-red-400 mt-6">Couldn't load restaurants.</p>
        )}

        {loading && <p className="text-gray-400 mt-6">Loading...</p>}

        {!loading && restaurants.length === 0 && (
          <p className="text-gray-400 mt-6">
            No restaurants match this filter.
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => {
            const averageRating =
              restaurant.reviews.length > 0
                ? restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) /
                  restaurant.reviews.length
                : 0;

            return (
              <div
                key={restaurant.id}
                className="rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-red-500/50 cursor-pointer"
              >
                <div className="relative h-40 bg-zinc-800">
                  <img
                    src="https://res.cloudinary.com/delubzbh2/image/upload/v1785167836/FoodDelivery/uyslwdxixq404wchibut.avif"
                    alt={restaurant.restaurantName}
                    className="w-full h-full object-cover"
                    onClick={() =>
                      navigate(`/resto/${restaurant.id}`, {
                        state: { rating: averageRating },
                      })
                    }
                  />

                  <span className="absolute top-3 right-3 bg-black/70 text-xs font-semibold px-2 py-1 rounded text-white">
                    <span className="flex items-center gap-1">
                      <span className="text-amber-400">
                        <FaStar />
                      </span>
                      {averageRating.toFixed(1)}
                    </span>
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-[#81A4CD]">
                    {restaurant.restaurantName}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {restaurant.cuisine}
                  </p>

                  <p className="text-xs text-gray-400 mt-2 flex">
                    <span className="text-red-400 font-bold">
                      <GrLocationPin />
                    </span>{" "}
                    {restaurant.address}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
