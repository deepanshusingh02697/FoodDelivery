import { NavLink, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { PiForkKnifeBold } from "react-icons/pi";
import { HiOutlineClipboardList } from "react-icons/hi";
import {
  FaCartShopping,
  FaCirclePlus,
  FaUtensils,
  FaBars,
  FaXmark,
} from "react-icons/fa6";
import {
  MdOutlineDashboard,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";

import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";

import { logout_Auth_Mutation } from "../graphql/Mutation";
import type { Logout_Mutation_Interface } from "../graphql/Client";

import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { logoutSuccess } from "../Redux/Slices/authSlice";

import { useState, type ReactNode } from "react";
import { persistor } from "../store";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
    isActive
      ? "text-red-500 bg-red-500/10 border-b-2 border-red-500 rounded-b-none"
      : "text-gray-400 hover:text-gray-200"
  }`;

type UserRole = "CUSTOMER" | "OWNER" | "ADMIN" | "DELIVERY_PARTNER";

type NavItem = {
  path: string;
  name: string;
  icon: ReactNode;
};

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  CUSTOMER: [
    {
      path: "/",
      name: "Discover",
      icon: <FaHome />,
    },
    {
      path: "/orders",
      name: "Orders",
      icon: <HiOutlineClipboardList />,
    },
    {
      path: "/cart",
      name: "Cart",
      icon: <FaCartShopping />,
    },
  ],

  OWNER: [
    {
      path: "/owner",
      name: "Dashboard",
      icon: <MdOutlineDashboard />,
    },
    {
      path: "/owner/menu",
      name: "Menu",
      icon: <PiForkKnifeBold />,
    },
    {
      path: "/owner/orderview",
      name: "Orders",
      icon: <HiOutlineClipboardList />,
    },
    {
      path: "/owner/addmenu",
      name: "Add Menu",
      icon: <FaCirclePlus />,
    },
  ],

  ADMIN: [
    {
      path: "/admin",
      name: "Dashboard",
      icon: <MdOutlineDashboard />,
    },
    {
      path: "/admin/checkresto",
      name: "Admin Console",
      icon: <MdOutlineAdminPanelSettings />,
    },
  ],

  DELIVERY_PARTNER: [
    {
      path: "/delivery",
      name: "Dashboard",
      icon: <MdOutlineDashboard />,
    },
    {
      path: "/delivery/track",
      name: "Track",
      icon: <TbTruckDelivery />,
    },
  ],
};

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useAppSelector((state) => state.auth);

  const [logout] = useMutation<Logout_Mutation_Interface>(logout_Auth_Mutation);

  const role = user?.role as UserRole | undefined;
  const menuItems = role ? NAV_ITEMS[role] : [];

  const handleLogout = async () => {
    try {
      const response = await logout();

      toast.success(response.data?.LogOut?.msg ?? "Logged out successfully");

      dispatch(logoutSuccess());
      persistor.purge();

      setMobileMenuOpen(false);

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative bg-black border-b border-zinc-800 px-4 py-4 md:px-8">
      <div className="flex items-center justify-between">
        <div className="flex gap-8">
          <NavLink
            to="/"
            className="flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="bg-red-500 p-2 rounded-xl">
              <FaUtensils size={20} />
            </div>

            <span className="text-xl font-bold text-white">
              Zomato<span className="text-red-500">.</span>
            </span>
          </NavLink>

          <nav className="hidden md:flex items-between gap-2">
            {menuItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={navLinkClass}>
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span
            className="
              text-xs
              text-blue-400
              bg-blue-500/10
              border
              border-blue-500/30
              rounded-full
              px-3
              py-1.5
            "
          >
            {user?.role}
          </span>

          <div
            className="
              h-9
              w-9
              rounded-full
              bg-red-500
              flex
              items-center
              justify-center
              font-semibold
              text-white
            "
          >
            {user?.firstname?.charAt(0).toUpperCase()}
          </div>

          <button
            onClick={handleLogout}
            className="
              border
              border-zinc-700
              rounded-lg
              px-4
              py-2
              text-sm
              text-gray-300
              hover:border-red-500
              hover:text-red-400
              transition-colors
            "
          >
            Sign out
          </button>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <div
            className="
              h-9
              w-9
              rounded-full
              bg-red-500
              flex
              items-center
              justify-center
              font-semibold
              text-white
            "
          >
            {user?.firstname?.charAt(0).toUpperCase()}
          </div>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="
              h-9
              w-9
              flex
              items-center
              justify-center
              rounded-lg
              border
              border-zinc-700
              text-gray-300
              hover:text-white
              hover:border-red-500
              transition-colors
            "
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="
            md:hidden
            absolute
            top-full
            left-0
            right-0
            z-50
            bg-zinc-950
            border-b
            border-zinc-800
            shadow-2xl
          "
        >
          <div className="p-4 space-y-4">
            <div
              className="
                flex
                items-center
                gap-3
                p-3
                rounded-xl
                bg-zinc-900
                border
                border-zinc-800
              "
            >
              <div className="flex-1 min-w-f justify-between">
                <div className="flex justify-between">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.firstname.toUpperCase()}{" "}
                    {user?.lastname.toUpperCase()}
                  </p>

                  <span className="text-xs text-blue-400">{user?.role}</span>
                </div>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleMobileNavClick}
                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-lg
                    text-sm
                    transition-colors
                    ${
                      isActive
                        ? "text-red-500 bg-red-500/10"
                        : "text-gray-400 hover:text-white hover:bg-zinc-900"
                    }
                    `
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-zinc-800" />

            <button
              onClick={handleLogout}
              className="
                w-full
                flex
                items-center
                justify-center
                border
                border-zinc-700
                rounded-lg
                px-4
                py-3
                text-sm
                text-gray-300
                hover:border-red-500
                hover:text-red-400
                transition-colors
              "
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
