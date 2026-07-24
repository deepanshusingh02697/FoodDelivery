import { NavLink, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { PiForkKnifeBold } from "react-icons/pi";
import { HiOutlineClipboardList } from "react-icons/hi";
// import { IoPlayCircleOutline } from "react-icons/io5";
import { FaCartShopping, FaCirclePlus, FaUtensils } from "react-icons/fa6";
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

import type { ReactNode } from "react";
import { persistor } from "../store";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
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
      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  return (
    <header
      className="
      bg-black
      border-b
      border-zinc-800
      px-4
      py-4
      flex
      items-center
      justify-between
      md:px-8
      "
    >
      <div className="flex items-center gap-8">
        <NavLink to="/" className="flex items-center gap-2">
          <div
            className="
            bg-red-500
            p-2
            rounded-xl
            "
          >
            <FaUtensils size={20} />
          </div>

          <span
            className="
            text-xl
            font-bold
            text-white
            "
          >
            Zomato
            <span className="text-red-500">.</span>
          </span>
        </NavLink>

        <nav
          className="
          hidden
          md:flex
          items-center
          gap-2
          "
        >
          {menuItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={navLinkClass}>
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div
        className="
        flex
        items-center
        gap-4
        "
      >
        <span
          className="
          hidden
          sm:block
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
          "
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
