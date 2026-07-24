import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaStore } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client/react";
import {
  RegisterRestaurant_Mutation,
  signUpUser_Mutation,
} from "../graphql/Mutation";
import type {
  Post_RegisterRestaurant_Interface,
  Post_Signup_Interface,
} from "../graphql/Client";
import { NavLink, useNavigate } from "react-router-dom";
import LeftSection from "./LeftSection";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isCustomer, setIsCustomer] = useState(true);
  const [customerInput, setCustomerInput] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [restaurantInput, setRestaurantInput] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    restaurantName: "",
    cuisine: "",
    address: "",
    fssaiNumber: "",
    gstNumber: "",
  });
  const [SignUpUser] = useMutation<Post_Signup_Interface>(signUpUser_Mutation);
  const [RegisterResturant] = useMutation<Post_RegisterRestaurant_Interface>(
    RegisterRestaurant_Mutation,
  );
  const navigate = useNavigate();

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInput((prev) => ({ ...prev, [name]: value }));
  };
  const handleRestaurantChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setRestaurantInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !customerInput.firstname ||
      !customerInput.lastname ||
      !customerInput.email ||
      !customerInput.password ||
      !customerInput.confirmpassword
    ) {
      toast("All fields are required", {
        position: "top-right",
        type: "info",
      });
      return;
    }
    if (customerInput.password !== customerInput.confirmpassword) {
      toast("Password didnot match", {
        position: "top-right",
        type: "warning",
      });
      return;
    }
    try {
      const response = await SignUpUser({
        variables: {
          firstname: customerInput.firstname,
          lastname: customerInput.lastname,
          email: customerInput.email,
          password: customerInput.password,
        },
      });
      console.log(response);

      if (!response) {
        toast("Invalid credentials! ", {
          position: "top-right",
          type: "warning",
        });
        return;
      }
      if (response.data?.SignUp?.success) {
        setCustomerInput({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmpassword: "",
        });
        navigate("/login")
        toast(response.data?.SignUp?.msg, {
          position: "top-right",
          type: "success",
          theme: "colored",
        });
      }
    } catch (error) {
      const err = error as Error;
      toast(err.message, {
        position: "top-right",
        type: "warning",
      });
    }
  };

  const handleRestaurantSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const requiredFields = [
      "firstname",
      "lastname",
      "email",
      "phone",
      "password",
      "restaurantName",
      "cuisine",
      "address",
    ];

    const isEmpty = requiredFields.some(
      (field) => !restaurantInput[field as keyof typeof restaurantInput],
    );

    if (isEmpty) {
      toast("All required fields are mandatory", {
        position: "top-right",
        type: "info",
      });
      return;
    }

    try {
      const response = await RegisterResturant({
        variables: {
          firstname: restaurantInput.firstname,
          lastname: restaurantInput.lastname,
          email: restaurantInput.email,
          phone: restaurantInput.phone,
          password: restaurantInput.password,
          restaurantName: restaurantInput.restaurantName,
          cuisine: restaurantInput.cuisine,
          address: restaurantInput.address,
          fssaiNumber: restaurantInput.fssaiNumber,
          gstNumber: restaurantInput.gstNumber,
        },
      });

      if (response.data?.RegisterRestaurantOwner?.success) {
        toast(response.data?.RegisterRestaurantOwner?.msg, {
          position: "top-right",
          type: "success",
          theme: "colored",
        });
        navigate("/login");
        setRestaurantInput({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          password: "",
          restaurantName: "",
          cuisine: "",
          address: "",
          fssaiNumber: "",
          gstNumber: "",
        });
      } else {
        toast("Restaurant registration failed", {
          position: "top-right",
          type: "warning",
        });
      }
    } catch (error) {
      const err = error as Error;

      toast(err.message, {
        position: "top-right",
        type: "warning",
      });
    }
  };

  return (
    <div className="h-screen bg-[#0d0907] text-white grid lg:grid-cols-2 overflow-hidden">
      <LeftSection />

      <div className="flex overflow-y-auto justify-center px-6 pt-12">
        <div className="w-full max-w-lg ">
          <div className="bg-[#18120f] rounded-xl p-1 flex gap-1">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex-1 py-3 rounded-lg text-center ${
                  isActive
                    ? "text-black bg-white font-semibold"
                    : "text-gray-400"
                }`
              }
            >
              Sign In
            </NavLink>

            <NavLink
              to="/signup"
              className={({ isActive }) =>
                `flex-1 py-3 rounded-lg text-center ${
                  isActive
                    ? "text-black bg-white font-semibold"
                    : "text-gray-400"
                }`
              }
            >
              Create Account
            </NavLink>
          </div>

          <h1 className="text-3xl font-bold mt-12">Create account </h1>

          <p className="text-gray-400 mt-3">
            {isCustomer
              ? "Join us and start ordering your favourite food"
              : "Register your own restaurant"}
          </p>

          <div className="mt-10">
            <p className="uppercase text-xs tracking-widest text-gray-500 mb-5">
              Register As
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div
                className={`border-2 ${isCustomer ? "border-red-500" : "border-[#2E2924]"}  bg-[#191412] rounded-xl p-4 text-center cursor-pointer`}
                onClick={() => setIsCustomer(true)}
              >
                <FaUsers
                  className={`mx-auto ${isCustomer ? "text-red-400" : ""}`}
                />

                <p className="mt-3 font-semibold">Customer</p>

                <span className="text-xs text-gray-500">Order food</span>
              </div>

              <div
                className={`border ${!isCustomer ? "border-red-500" : "border-[#2E2924]"} rounded-xl p-4 text-center cursor-pointer`}
                onClick={() => setIsCustomer(false)}
              >
                <FaStore
                  className={`mx-auto ${!isCustomer ? "text-red-400" : ""}`}
                />
                <p className="mt-3 font-semibold">Register Restaurant</p>
                <span className="text-xs text-gray-500">Manage shop</span>
              </div>
            </div>
          </div>

          {isCustomer ? (
            <>
              <form action="" onSubmit={handleCustomerSubmit}>
                <div className="mt-8 space-y-5">
                  <div>
                    <label className="text-sm text-gray-400">First Name</label>

                    <input
                      placeholder="John"
                      className="
                      mt-2
                      w-full
                      bg-[#191412]
                      border
                      border-[#2E2924]
                      rounded-xl
                      px-5
                      py-4
                      outline-none
                      focus:border-red-500
                      "
                      name="firstname"
                      onChange={handleCustomerChange}
                      value={customerInput.firstname}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Last Name</label>

                    <input
                      placeholder="Smith"
                      className="
                      mt-2
                      w-full
                      bg-[#191412]
                      border
                      border-[#2E2924]
                      rounded-xl
                      px-5
                      py-4
                      outline-none
                      focus:border-red-500
                      "
                      name="lastname"
                      value={customerInput.lastname}
                      onChange={handleCustomerChange}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">
                      Email Address
                    </label>

                    <input
                      placeholder="you@example.com"
                      className="
                mt-2
                w-full
                bg-[#191412]
                border
                border-[#2E2924]
                rounded-xl
                px-5
                py-4
                outline-none
                focus:border-red-500
                "
                      name="email"
                      onChange={handleCustomerChange}
                      value={customerInput.email}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Password</label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="
                  mt-2
                  w-full
                  bg-[#191412]
                  border
                  border-[#2E2924]
                  rounded-xl
                  px-5
                  py-4
                  outline-none
                  focus:border-red-500
                  "
                        name="password"
                        onChange={handleCustomerChange}
                        value={customerInput.password}
                      />

                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-6 text-gray-400"
                        type="button"
                      >
                        {showPassword ? (
                          <FaRegEyeSlash size={20} />
                        ) : (
                          <FaEye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      placeholder="••••••••"
                      className="
                      mt-2
                      w-full
                      bg-[#191412]
                      border
                      border-[#2E2924]
                      rounded-xl
                      px-5
                      py-4
                      outline-none
                      focus:border-red-500
                      "
                      name="confirmpassword"
                      onChange={handleCustomerChange}
                      value={customerInput.confirmpassword}
                    />
                  </div>
                </div>
                <button
                  className="
                  mt-8
                  w-full
                  py-4
                  rounded-xl
                  bg-linear-to-r
                  from-red-500
                  to-orange-500
                  font-semibold
                  text-lg
                  "
                  type="submit"
                >
                  Create Account →
                </button>
              </form>
            </>
          ) : (
            <>
              <form action="" onSubmit={handleRestaurantSubmit}>
                <div className="mt-8 space-y-5">
                  <div>
                    <label className="text-sm text-gray-400">First Name</label>

                    <input
                      placeholder="John"
                      name="firstname"
                      value={restaurantInput.firstname}
                      onChange={handleRestaurantChange}
                      className="mt-2 w-full bg-[#191412] border border-[#2E2924] rounded-xl px-5 py-4 outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Last Name</label>

                    <input
                      placeholder="Smith"
                      name="lastname"
                      value={restaurantInput.lastname}
                      onChange={handleRestaurantChange}
                      className="mt-2 w-full bg-[#191412] border border-[#2E2924] rounded-xl px-5 py-4 outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="owner@example.com"
                      name="email"
                      value={restaurantInput.email}
                      onChange={handleRestaurantChange}
                      className="mt-2 w-full bg-[#191412] border border-[#2E2924] rounded-xl px-5 py-4 outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">
                      Phone Number
                    </label>

                    <input
                      placeholder="+91 9876543210"
                      name="phone"
                      value={restaurantInput.phone}
                      onChange={handleRestaurantChange}
                      className="mt-2 w-full bg-[#191412] border border-[#2E2924] rounded-xl px-5 py-4 outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Password</label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        name="password"
                        value={restaurantInput.password}
                        onChange={handleRestaurantChange}
                        className="mt-2 w-full bg-[#191412] border border-[#2E2924] rounded-xl px-5 py-4 outline-none focus:border-red-500"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-6 text-gray-400"
                      >
                        {showPassword ? (
                          <FaRegEyeSlash size={20} />
                        ) : (
                          <FaEye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-lg font-semibold">
                      Restaurant Details
                    </h3>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">
                      Restaurant Name
                    </label>

                    <input
                      placeholder="Spice Garden"
                      name="restaurantName"
                      value={restaurantInput.restaurantName}
                      onChange={handleRestaurantChange}
                      className="mt-2 w-full bg-[#191412] border border-[#2E2924] rounded-xl px-5 py-4 outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Cuisine</label>

                    <input
                      placeholder="Indian, Chinese, Italian"
                      name="cuisine"
                      value={restaurantInput.cuisine}
                      onChange={handleRestaurantChange}
                      className="mt-2 w-full bg-[#191412] border border-[#2E2924] rounded-xl px-5 py-4 outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Address</label>

                    <textarea
                      placeholder="Restaurant address"
                      name="address"
                      value={restaurantInput.address}
                      onChange={handleRestaurantChange}
                      className="mt-2 w-full bg-[#191412] border border-[#2E2924] rounded-xl px-5 py-4 outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">
                      FSSAI Number
                    </label>

                    <input
                      placeholder="Optional"
                      name="fssaiNumber"
                      value={restaurantInput.fssaiNumber}
                      onChange={handleRestaurantChange}
                      className="mt-2 w-full bg-[#191412] border border-[#2E2924] rounded-xl px-5 py-4 outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">GST Number</label>

                    <input
                      placeholder="Optional"
                      name="gstNumber"
                      value={restaurantInput.gstNumber}
                      onChange={handleRestaurantChange}
                      className="mt-2 w-full bg-[#191412] border border-[#2E2924] rounded-xl px-5 py-4 outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 font-semibold text-lg"
                >
                  Register Restaurant →
                </button>
              </form>
            </>
          )}

          <p className="text-center text-gray-500 mt-8 pb-6">
            Already have an account?
            <span className="text-red-500 ml-2 cursor-pointer">
              <NavLink to="/login">Sign In</NavLink>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
