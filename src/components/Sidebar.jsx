// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext"; // global user context

export default function Sidebar({ isOpen }) {
  const { user } = useUser();

  return (
    <aside
      aria-hidden={!isOpen}
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="h-full flex flex-col">
        {/* 🔹 Profile Section (fixed at top, no scroll) */}
        <div className="p-6 border-b flex flex-col items-center shrink-0">

          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-16 h-16 rounded-full"
            />
          ) : (

            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white">
              <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
            </div>

          )}

          {/* Name and Role */}
          <h1 className="text-lg font-semibold mt-2">{user?.name || "User"}</h1>
          <p className="text-sm text-gray-500">
            {user?.role
              ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
              : "No role"}
          </p>
        </div>

        {/* 🔹 Scrollable Nav Section */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/messages", label: "Messages" },
            { to: "/jobs", label: "Jobs" },
            { to: "/candidates", label: "Candidates" },
            { to: "/resumes", label: "Resumes" },
            { to: "/employees", label: "Employees" },
            { to: "/leaves", label: "Leaves" },
            { to: "/payrolls", label: "Payrolls" },
            { to: "/settings", label: "Settings" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block w-full p-2 rounded transition ${isActive
                  ? "bg-blue-100 font-medium text-blue-600"
                  : "hover:bg-gray-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
