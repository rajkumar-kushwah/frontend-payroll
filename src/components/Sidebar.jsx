import React from "react";
import { useUser } from "../context/UserContext";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../images/nabulogo.png";

import {
  LayoutDashboard,
  User,
  UserCog,
  Calendar,
  Wallet,
  Settings,
  ClipboardList, 
} from "lucide-react";

export default function Sidebar({ isOpen, toggle }) {
  const { user } = useUser();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-lime-300 text-gray-900 font-medium shadow-sm"
      : "text-gray-700 hover:bg-lime-200";

  return (
    <aside
      aria-hidden={!isOpen}
      className={`fixed top-0 left-0 h-full w-45 bg-gray-100 shadow-lg z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="h-full flex flex-col bg-gray-100 overflow-y-auto">
        {/* Logo Section */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <div className="flex items-center gap-2 ">
            <div className="w-10 h-10 bg-lime-300 rounded-xl flex items-center justify-center">
              <img
                src={logo}
                alt="Logo"
                className="w-8 h-8 object-contain mix-blend-multiply"
              />
            </div>
            <span className="text-lg font-semibold text-gray-800">Nabu</span>
          </div>
          <button
            onClick={toggle}
            className="text-black text-3xl focus:outline-none md:hidden"
          >
            ×
          </button>
        </div>

        {/* Profile Section */}
        <div className="relative p-6 border-b flex flex-col items-center text-black">
          {user ? (
            user.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-16 h-16 rounded-full border-2 border-lime-300 object-cover z-10 relative"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-lime-300 flex items-center justify-center text-sm font-bold text-white z-10 relative">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center z-10 relative">
              ?
            </div>
          )}
          <h1 className="text-xs font-semibold mt-2 z-10 relative">
            {user?.name || "User"}
          </h1>
          <p className="text-xs text-gray-500 z-10 relative">
            {user?.role
              ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
              : "No role"}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
              "/dashboard"
            )}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
              "/profile"
            )}`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/employees"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
              "/employees"
            )}`}
          >
            <UserCog className="w-5 h-5" />
            <span>Employees</span>
          </NavLink>

          <NavLink
            to="/attendance"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
              "/attendance"
            )}`}
          >
            < ClipboardList className="w-4 h-4" />
            <span>Attedance</span>
          </NavLink>


          <NavLink
            to="/manual-checkin"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
              "/manual-checkin"
            )}`}
          >
            < ClipboardList className="w-4 h-4" />
            <span className="text-sm">Daily Attendance</span>
          </NavLink>




          <NavLink
            to="/leaves"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
              "/leaves"
            )}`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Leaves</span>
          </NavLink>

          <NavLink
            to="/payrolls"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
              "/payrolls"
            )}`}
          >
            <Wallet className="w-4 h-4" />
            <span className="text-sm">Payroll</span>
          </NavLink>



          <div className="pt-3 text-gray-500 text-xs">Account Setting</div>

          <NavLink
            to="/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
              "/settings"
            )}`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </NavLink>


          {/* Admin Section - Owner Only */}
          {user && user.role?.toLowerCase() === "owner" && (
            <div className="mt-2">
              <div className="pt-0 text-gray-500 text-xs">Admin Section</div>
              <NavLink
                to="/admin"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
                  "/admin"
                )}`}
              >
                <UserCog className="w-4 h-4" />
                <span className="text-sm">Admin</span>
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
