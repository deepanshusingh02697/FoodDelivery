import { useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { FaUtensils } from "react-icons/fa6";
import { IoShieldCheckmark } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { FaStore } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client/react";
import type {
  Post_AdminLogin_Interface,
  Post_Login_Interface,
  Post_OwnerLogin_Interface,
} from "../graphql/Client";
import {
  adminLogIn_Mutation,
  logInUser_Mutation,
  ownerLogIn_Mutation,
} from "../graphql/Mutation";

type LoginRole = "CUSTOMER" | "OWNER" | "ADMIN";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<LoginRole>("CUSTOMER");
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  const [LogInUser, { loading: customerLoading }] =
    useMutation<Post_Login_Interface>(logInUser_Mutation);
  const [OwnerLogIn, { loading: ownerLoading }] =
    useMutation<Post_OwnerLogin_Interface>(ownerLogIn_Mutation);
  const [AdminLogIn, { loading: adminLoading }] =
    useMutation<Post_AdminLogin_Interface>(adminLogIn_Mutation);

  const loading = customerLoading || ownerLoading || adminLoading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginInput.email || !loginInput.password) {
      toast("Email and password are required", {
        position: "top-right",
        type: "info",
      });
      return;
    }

    try {
      const variables = {
        email: loginInput.email,
        password: loginInput.password,
      };

      if (role === "CUSTOMER") {
        const response = await LogInUser({ variables });
        if (response.data?.LogIn?.success) {
          toast(response.data.LogIn.msg, {
            position: "top-right",
            type: "success",
            theme: "colored",
          });
          navigate("/");
        } else {
          toast("Login failed", { position: "top-right", type: "warning" });
        }
      } else if (role === "OWNER") {
        const response = await OwnerLogIn({ variables });
        if (response.data?.OwnerLogIn?.success) {
          toast(response.data.OwnerLogIn.msg, {
            position: "top-right",
            type: "success",
            theme: "colored",
          });
          navigate("/owner/dashboard");
        } else {
          toast("Login failed", { position: "top-right", type: "warning" });
        }
      } else {
        const response = await AdminLogIn({ variables });
        if (response.data?.AdminLogIn?.success) {
          toast(response.data.AdminLogIn.msg, {
            position: "top-right",
            type: "success",
            theme: "colored",
          });
          navigate("/admin/dashboard");
        } else {
          toast("Login failed", { position: "top-right", type: "warning" });
        }
      }
    } catch (error) {
      const err = error as Error;
      toast(err.message, { position: "top-right", type: "warning" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0907] text-white grid lg:grid-cols-2">
      {/* LEFT SECTION — unchanged */}
      <div className="hidden lg:flex relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          className="absolute inset-0 w-full h-full object-cover"
          alt="food"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col justify-end p-12 pb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-red-500 p-3 rounded-xl">
              <FaUtensils size={28} />
            </div>
            <h1 className="text-3xl font-bold">
              Zomato<span className="text-red-500">.</span>
            </h1>
          </div>
          <h2 className="text-6xl font-extrabold leading-tight">
            Food that
            <br />
            <span className="text-orange-500">fuels</span> every
            <br />
            moment.
          </h2>
          <p className="mt-8 text-gray-300 text-lg max-w-md leading-relaxed">
            2,400+ restaurants. Real-time tracking. Delivered in under 35
            minutes.
          </p>
          <div className="flex items-center gap-5 mt-10">
            <div className="flex -space-x-3">
              <img
                className="w-12 h-12 rounded-full border-2 border-black"
                src="https://i.pravatar.cc/100?img=1"
              />
              <img
                className="w-12 h-12 rounded-full border-2 border-black"
                src="https://i.pravatar.cc/100?img=2"
              />
              <img
                className="w-12 h-12 rounded-full border-2 border-black"
                src="https://i.pravatar.cc/100?img=3"
              />
            </div>
            <div>
              <div className="text-yellow-400">★★★★★</div>
              <p className="text-gray-300 text-sm">1.2M+ happy customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-[#18120f] rounded-xl p-1 flex">
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

          <h1 className="text-3xl font-bold mt-12">Welcome back 👋</h1>
          <p className="text-gray-400 mt-3">
            Sign in to continue to your account
          </p>

          {/* LOGIN ROLE — now actually wired to state */}
          <div className="mt-10">
            <p className="uppercase text-xs tracking-widest text-gray-500 mb-5">
              Login As
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div
                className={`border-2 ${
                  role === "CUSTOMER" ? "border-red-500" : "border-zinc-700"
                } bg-[#191412] rounded-xl p-4 text-center cursor-pointer`}
                onClick={() => setRole("CUSTOMER")}
              >
                <FaUsers
                  className={`mx-auto ${role === "CUSTOMER" ? "text-red-400" : "text-gray-400"}`}
                />
                <p className="mt-3 font-semibold">Customer</p>
                <span className="text-xs text-gray-500">Order food</span>
              </div>

              <div
                className={`border-2 ${
                  role === "OWNER" ? "border-red-500" : "border-zinc-700"
                } rounded-xl p-4 text-center cursor-pointer`}
                onClick={() => setRole("OWNER")}
              >
                <FaStore
                  className={`mx-auto ${role === "OWNER" ? "text-red-400" : "text-gray-400"}`}
                />
                <p className="mt-3 font-semibold">Owner</p>
                <span className="text-xs text-gray-500">Manage shop</span>
              </div>

              <div
                className={`border-2 ${
                  role === "ADMIN" ? "border-red-500" : "border-zinc-700"
                } rounded-xl p-4 text-center cursor-pointer`}
                onClick={() => setRole("ADMIN")}
              >
                <IoShieldCheckmark
                  className={`mx-auto ${role === "ADMIN" ? "text-red-400" : "text-gray-400"}`}
                />
                <p className="mt-3 font-semibold">Admin</p>
                <span className="text-xs text-gray-500">Control</span>
              </div>
            </div>
          </div>

          {/* FORM — now a real <form>, wired to state and handleSubmit */}
          <form onSubmit={handleSubmit}>
            <div className="mt-10 space-y-5">
              <div>
                <label className="text-sm text-gray-400">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={loginInput.email}
                  onChange={handleChange}
                  className="mt-2 w-full bg-[#191412] border border-zinc-700 rounded-xl px-5 py-4 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={loginInput.password}
                    onChange={handleChange}
                    className="mt-2 w-full bg-[#191412] border border-zinc-700 rounded-xl px-5 py-4 outline-none focus:border-red-500"
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
            </div>

            <div className="text-right mt-4">
              <button type="button" className="text-red-500 hover:text-red-400">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full py-4 rounded-xl bg-linear-to-r from-red-500 to-orange-500 font-semibold text-lg disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8">
            Don't have an account?
            <span className="text-red-500 ml-2 cursor-pointer">
              <NavLink to="/signup">Sign up free</NavLink>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
