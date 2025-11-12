// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext"; // global user context
import logo from "../images/logo.png";

//  Import icons from lucide-react
import {
  LayoutDashboard,
  Home,
  User,
  MessageSquare,
  Briefcase,
  Users,
  FileText,
  UserCog,
  Calendar,
  Wallet,
  Settings,
} from "lucide-react";



export default function Sidebar({ isOpen , toggle }) {
  const { user } = useUser();

  //  Navigation links with icons
  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {to: "/profile", label: "Profile", icon: User },
    // { to: "/messages", label: "Messages", icon: MessageSquare },
    // { to: "/jobs", label: "Jobs", icon: Briefcase },
    // { to: "/candidates", label: "Candidates", icon: Users },
    // { to: "/resumes", label: "Resumes", icon: FileText },
    { to: "/employees", label: "Employees", icon: UserCog },
    { to: "/leaves", label: "Leaves", icon: Calendar },
    { to: "/payrolls", label: "Payrolls", icon: Wallet },
    { to: "/settings", label: "Settings", icon: Settings },
  ];


  return (
    <aside
      aria-hidden={!isOpen}
      className={`fixed top- left-0 h-full w-64 bg-white shadow-md z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        
    >
      
     
      <div className="h-full flex flex-col ">
        <h1 className=" text-2xl mt-2 ml-15  font-bold text-black drop-shadow-[0_2px_0_rgba(1,1,1,1)]    ">
          {/* drop-shadow-[0_2px_0_rgba(16,185,129,1)] */}

           {/* 🔹 Mobile close icon */}
      <div className="flex justify-end md:hidden">
        <button
          onClick={toggle}
          className="text-black text-2xl p-3 focus:outline-none"
        >
          ×
        </button>
      </div>
<div className="flex justify-center items-center mr-10 sm:max-w-xl bg-transparent fill-current capcity-75 h-full rounded-2xl overflow-hidden ">
  <img src={logo} alt="Logo" className="w-full h-full object-cover" />
</div>

</h1>


        {/* 🔹 Profile Section (fixed at top, no scroll) */}
       <div className="relative p-6 border-b flex flex-col items-center shrink-0 font-extrabold text-black">
  {/* Background Logo */}
<div className="absolute top-0 left-0 w-full h-18 bg-green-50 opacity-80 pointer-events-none z-0">
  <img
    src={logo}
    alt="background logo"
    className="releative  left-0 w-full h-15 bg-green-50 opacity-80 pointer-events-none z-0"
  />
</div>


  {/* User Avatar */}
  {user ? (
    user.avatar ? (
      <img
        src={user.avatar}
        alt="avatar"
        className="top-2 w-16 h-16 rounded-full border-2 border-lime-300 object-cover z-10 relative"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-lime-300 flex items-center justify-center text-2xl font-bold text-white z-10 relative">
        {user.name?.charAt(0).toUpperCase() || "U"}
      </div>
    )
  ) : (
    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center z-10 relative">
      ?
    </div>
  )}

  {/* User Name */}
  <h1 className="text-lg font-semibold mt-2 z-10 relative">
    {user?.name || "User"}
  </h1>

  {/* User Role */}
  <p className="text-sm text-gray-500 z-10 relative">
    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "No role"}
  </p>
</div>


        {/* 🔹 Scrollable Nav Section */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full p-2 rounded-lg  transition-all ${isActive
                    ? "bg-lime-300 font-medium text-black"
                    : "hover:bg-lime-200 duration-600 text-gray-700"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
