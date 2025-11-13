// src/components/Sidebar.jsx
import React from "react";
import { useUser } from "../context/UserContext";
import { useLocation } from "react-router-dom";
import logo from "../images/nabulogo.png";
import market from "../images/market.jpg";
import {
  LayoutDashboard,
  User,
  UserCog,
  Calendar,
  Wallet,
  Settings,
} from "lucide-react";

export default function Sidebar({ isOpen, toggle }) {
  const { user } = useUser();
  const location = useLocation(); // 👈 current page path

  // Helper function to check if link is active
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
        {/* 🔹 Logo Section */}
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

        {/*  Profile Section */}
        <div className="relative p-6 border-b flex flex-col items-center text-black">
          <div className="absolute top-0 left-0 w-full h-18 bg-lime-50 opacity-80 pointer-events-none z-0">
            <img
              src={market}
              alt="bg"
              className="relative left-0 w-full h-15 bg-lime-50 opacity-80 pointer-events-none z-0"
            />
          </div>
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
          <a
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
              "/dashboard"
            )}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </a>

          <a
            href="/profile"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
              "/profile"
            )}`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
            <div className="flex justify-around items-center ml-auto">
              <i className="fa fa-angle-right" aria-hidden="true"></i>
            </div>
          </a>

          <a
            href="/employees"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
              "/employees"
            )}`}
          >
            <UserCog className="w-5 h-5" />
            <span>Employees</span>
          </a>

          <a
            href="/leaves"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
              "/leaves"
            )}`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Leaves</span>
          </a>

          <a
            href="/payrolls"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
              "/payrolls"
            )}`}
          >
            <Wallet className="w-4 h-4" />
            <span className="text-sm">Payrolls</span>
          </a>

          <div className="pt-3 text-gray-500 text-xs">Account Setting</div>

          <a
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive(
              "/settings"
            )}`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
            <div className="flex justify-around items-center ml-auto">
              <i className="fa fa-angle-right" aria-hidden="true"></i>
            </div>
          </a>
        </nav>
      </div>
    </aside>
  );
}
