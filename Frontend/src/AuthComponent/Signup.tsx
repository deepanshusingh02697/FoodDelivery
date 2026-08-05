import React, { useRef, useState } from "react";
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
import { CombinedGraphQLErrors } from "@apollo/client";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isCustomer, setIsCustomer] = useState(true);
  const custInput = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
  };
  const [customerInput, setCustomerInput] = useState(custInput);
  const [error, setError] = useState(custInput);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmpasswordRef = useRef<HTMLInputElement>(null);

  const restoInput = {
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
  };
  const [restaurantInput, setRestaurantInput] = useState(restoInput);
  const [restoError, setRestoError] = useState(restoInput);
  const phoneRef = useRef<HTMLInputElement>(null);
  const restaurantNameRef = useRef<HTMLInputElement>(null);
  const cuisineRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const fssaiNumberRef = useRef<HTMLInputElement>(null);
  const gstNumberRef = useRef<HTMLInputElement>(null);

  const [SignUpUser] = useMutation<Post_Signup_Interface>(signUpUser_Mutation);
  const [RegisterResturant] = useMutation<Post_RegisterRestaurant_Interface>(
    RegisterRestaurant_Mutation,
  );
  const navigate = useNavigate();

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInput((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };
  const handleRestaurantChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setRestaurantInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    setRestoError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateCustomer = () => {
    const errors = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
    };

    let isValid = true;

    if (!customerInput.firstname.trim()) {
      errors.firstname = "First name is required";
      isValid = false;
    }

    if (!customerInput.lastname.trim()) {
      errors.lastname = "Last name is required";
      isValid = false;
    }

    if (!customerInput.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(customerInput.email)
    ) {
      errors.email = "Invalid email address";
      isValid = false;
    }

    if (!customerInput.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (customerInput.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!customerInput.confirmpassword) {
      errors.confirmpassword = "Confirm Password is required";
      isValid = false;
    } else if (customerInput.password !== customerInput.confirmpassword) {
      errors.confirmpassword = "Passwords do not match";
      isValid = false;
    }

    setError(errors);

    return isValid;
  };
  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateCustomer()) return;

    if (customerInput.password !== customerInput.confirmpassword) {
      setError((prev) => ({
        ...prev,
        confirmpassword: !customerInput.confirmpassword.trim()
          ? "Confirm Password required"
          : "Password should be matched",
      }));
      return;
    }
    try {
      const response = await SignUpUser({
        variables: {
          input: {
            firstname: customerInput.firstname,
            lastname: customerInput.lastname,
            email: customerInput.email,
            password: customerInput.password,
          },
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
        setCustomerInput(custInput);
        navigate("/login");
        toast(response.data?.SignUp?.msg, {
          position: "top-right",
          type: "success",
          theme: "colored",
        });
      }
    } catch (error: unknown) {
      if (CombinedGraphQLErrors.is(error)) {
        const graphError = error.errors?.[0];

        if (!graphError.extensions?.field) {
          toast(error.message, {
            position: "top-right",
            type: "error",
          });
          setError(custInput);
          return;
        }

        const field = graphError.extensions?.field as keyof typeof custInput;
        const message = graphError.message;

        setError((prev) => ({ ...prev, [field]: message }));
        console.log(field, message);

        switch (field) {
          case "firstname":
            firstNameRef.current?.focus();
            break;

          case "lastname":
            lastNameRef.current?.focus();
            break;

          case "email":
            emailRef.current?.focus();
            break;

          case "password":
            passwordRef.current?.focus();
            break;
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

  const validateRestaurant = () => {
    const errors = {
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
    };

    let isValid = true;

    const firstName = restaurantInput.firstname.trim();
    if (!firstName) {
      errors.firstname = "First name is required";
      isValid = false;
    } else if (firstName.length < 2) {
      errors.firstname = "First name must be atleast two character long";
      isValid = false;
    } else if (firstName.length > 30) {
      errors.firstname = "First name cannot exceed 30 characters";
      isValid = false;
    } else if (!/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/.test(firstName)) {
      errors.firstname =
        "First name can only contain letters, spaces and hyphens (-) only";
      isValid = false;
    }

    const lastName = restaurantInput.lastname.trim();
    if (!lastName) {
      errors.lastname = "Last name is required";
      isValid = false;
    } else if (lastName.length < 2) {
      errors.lastname = "Last name must be atleast two character long";
      isValid = false;
    } else if (lastName.length > 30) {
      errors.lastname = "Last name cannot exceed 30 characters";
      isValid = false;
    } else if (!/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/.test(lastName)) {
      errors.lastname =
        "Last name can only contain letters, spaces and hyphens (-) only";
      isValid = false;
    }

    const email = restaurantInput.email.trim();
    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
      errors.email = "Enter a valid email address";
      isValid = false;
    }

    const phone = restaurantInput.phone.trim();
    if (!phone) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      errors.phone = "Enter a valid 10-digit phone number";
      isValid = false;
    }

    const password = restaurantInput.password.trim();
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/.test(
        password,
      )
    ) {
      errors.password =
        "Password must contain uppercase, lowercase, number and special character.";
      isValid = false;
    }

    const restaurantName = restaurantInput.restaurantName.trim();
    if (!restaurantName) {
      errors.restaurantName = "Restaurant name is required";
      isValid = false;
    } else if (restaurantName.length < 3) {
      errors.restaurantName =
        "Restaurant name must be at least 3 characters long";
      isValid = false;
    } else if (restaurantName.length > 100) {
      errors.restaurantName = "Restaurant name cannot exceed 100 characters";
      isValid = false;
    }

    const cuisine = restaurantInput.cuisine.trim();
    if (!cuisine) {
      errors.cuisine = "Cuisine is required";
      isValid = false;
    } else if (cuisine.length < 3) {
      errors.cuisine = "Cuisine must be at least 3 characters long";
      isValid = false;
    }

    const address = restaurantInput.address.trim();
    if (!address) {
      errors.address = "Restaurant address is required";
      isValid = false;
    } else if (address.length < 10) {
      errors.address = "Address must be at least 10 characters long";
      isValid = false;
    } else if (address.length > 250) {
      errors.address = "Address cannot exceed 250 characters";
      isValid = false;
    }

    const fssai = restaurantInput.fssaiNumber.trim();
    if (fssai && !/^\d{14}$/.test(fssai)) {
      errors.fssaiNumber = "FSSAI number must contain exactly 14 digits";
      isValid = false;
    }

    const gst = restaurantInput.gstNumber.trim().toUpperCase();
    if (gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gst)) {
      errors.gstNumber = "Enter a valid GST number";
      isValid = false;
    }

    setRestoError(errors);
    return isValid;
  };
  const handleRestaurantSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!validateRestaurant()) return;

    try {
      const response = await RegisterResturant({
        variables: {
          input: {
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
        },
      });

      if (response.data?.RegisterRestaurantOwner?.success) {
        toast(response.data?.RegisterRestaurantOwner?.msg, {
          position: "top-right",
          type: "success",
          theme: "colored",
        });
        navigate("/login");
        setRestaurantInput(restoInput);
      } else {
        toast("Restaurant registration failed", {
          position: "top-right",
          type: "warning",
        });
      }
    } catch (error: unknown) {
      if (CombinedGraphQLErrors.is(error)) {
        const graphError = error.errors?.[0];
        if (!graphError.extensions?.field) {
          toast(error.message, {
            position: "top-right",
            type: "error",
          });
          setRestoError(restoInput);
          return;
        }
        const field = graphError.extensions?.field as keyof typeof restoInput;
        const message = graphError.message;

        setRestoError((prev) => ({ ...prev, [field]: message }));
        console.log(field, message);

        switch (field) {
          case "firstname":
            firstNameRef.current?.focus();
            break;

          case "lastname":
            lastNameRef.current?.focus();
            break;

          case "email":
            emailRef.current?.focus();
            break;

          case "password":
            passwordRef.current?.focus();
            break;
          case "phone":
            phoneRef.current?.focus();
            break;
          case "restaurantName":
            restaurantNameRef.current?.focus();
            break;
          case "cuisine":
            cuisineRef.current?.focus();
            break;
          case "address":
            addressRef.current?.focus();
            break;
          case "fssaiNumber":
            fssaiNumberRef.current?.focus();
            break;
          case "gstNumber":
            gstNumberRef.current?.focus();
            break;
        }
      } else if (error instanceof Error) {
        toast(error.message, {
          position: "top-right",
          type: "error",
        });
      } else {
        toast("Something wrong", {
          position: "top-right",
          type: "error",
        });
      }
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
                      ref={firstNameRef}
                    />
                    {error?.firstname ? (
                      <p className="text-[14px] text-red-400">
                        {error.firstname}
                      </p>
                    ) : (
                      ""
                    )}
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
                      ref={lastNameRef}
                    />
                    {error?.lastname ? (
                      <p className="text-[14px] text-red-400">
                        {error.lastname}
                      </p>
                    ) : (
                      ""
                    )}
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
                      ref={emailRef}
                    />
                    {error?.email ? (
                      <p className="text-[14px] text-red-400">{error.email}</p>
                    ) : (
                      ""
                    )}
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
                        ref={passwordRef}
                      />
                      {error?.password ? (
                        <p className="text-[14px] text-red-400">
                          {error.password}
                        </p>
                      ) : (
                        ""
                      )}

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
                    <div className="relative">
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
                        ref={confirmpasswordRef}
                      />
                      {error?.confirmpassword ? (
                        <p className="text-[14px] text-red-400">
                          {error.confirmpassword}
                        </p>
                      ) : (
                        ""
                      )}
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
                      ref={firstNameRef}
                    />
                    {restoError?.firstname ? (
                      <p className="text-[14px] text-red-400">
                        {restoError.firstname}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Last Name</label>

                    <input
                      placeholder="Smith"
                      name="lastname"
                      value={restaurantInput.lastname}
                      onChange={handleRestaurantChange}
                      className="mt-2 w-full bg-[#191412] border border-[#2E2924] rounded-xl px-5 py-4 outline-none focus:border-red-500"
                      ref={lastNameRef}
                    />
                    {restoError?.lastname ? (
                      <p className="text-[14px] text-red-400">
                        {restoError.lastname}
                      </p>
                    ) : (
                      ""
                    )}
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
                    {restoError?.email ? (
                      <p className="text-[14px] text-red-400">
                        {restoError.email}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">
                      Phone Number
                    </label>

                    <input
                      placeholder="+91 9876543210"
                      name="phone"
                      type="number"
                      maxLength={10}
                      value={restaurantInput.phone}
                      onChange={handleRestaurantChange}
                      className="mt-2 w-full bg-[#191412] border border-[#2E2924] rounded-xl px-5 py-4 outline-none focus:border-red-500"
                      ref={phoneRef}
                    />
                    {restoError?.phone ? (
                      <p className="text-[14px] text-red-400">
                        {restoError.phone}
                      </p>
                    ) : (
                      ""
                    )}
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
                      {restoError?.password ? (
                        <p className="text-[14px] text-red-400">
                          {restoError.password}
                        </p>
                      ) : (
                        ""
                      )}

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
                    {restoError?.restaurantName ? (
                      <p className="text-[14px] text-red-400">
                        {restoError.restaurantName}
                      </p>
                    ) : (
                      ""
                    )}
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
                    {restoError?.cuisine ? (
                      <p className="text-[14px] text-red-400">
                        {restoError.cuisine}
                      </p>
                    ) : (
                      ""
                    )}
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
                    {restoError?.address ? (
                      <p className="text-[14px] text-red-400">
                        {restoError.address}
                      </p>
                    ) : (
                      ""
                    )}
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
                    {restoError?.fssaiNumber ? (
                      <p className="text-[14px] text-red-400">
                        {restoError.fssaiNumber}
                      </p>
                    ) : (
                      ""
                    )}
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
                    {restoError?.gstNumber ? (
                      <p className="text-[14px] text-red-400">
                        {restoError.gstNumber}
                      </p>
                    ) : (
                      ""
                    )}
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
