import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useUser } from "../context/UserContext";

export default function Header({ toggle }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [dropdown, setDropdown] = useState(null);

  // 🔹 Refs for dropdowns
  const msgRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        msgRef.current && !msgRef.current.contains(e.target) &&
        notifRef.current && !notifRef.current.contains(e.target) &&
        userRef.current && !userRef.current.contains(e.target)
      ) {
        setDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Rest of your code (unchanged)
  const messageOptions = [
    { key: "hr", label: "Message from HR" },
    { key: "leave", label: "Leave Request Reply" },
    { key: "payslip", label: "Payslip Issue" },
  ];
  const notificationOptions = [
    { key: "holiday", label: "Holiday Announcement" },
    { key: "policy", label: "Policy Update" },
    { key: "reminder", label: "Meeting Reminder" },
  ];

  const [unreadMessages, setUnreadMessages] = useState({});
  const [unreadNotifications, setUnreadNotifications] = useState({});
  const userId = user?._id || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) return;
        const res1 = await api.get(`/messages/${userId}`);
        const msgs = res1.data || [];
        const unreadObj = {};
        msgs.forEach((m) => {
          if (!m.isRead) unreadObj[m.type] = true;
        });
        setUnreadMessages(unreadObj);

        const res2 = await api.get(`/notifications/${userId}`);
        const notifs = res2.data || [];
        const notifObj = {};
        notifs.forEach((n) => {
          if (!n.isRead) notifObj[n.type] = true;
        });
        setUnreadNotifications(notifObj);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [userId]);

  const msgCount = Object.keys(unreadMessages).length;
  const notifCount = Object.keys(unreadNotifications).length;


  return (
    <header className="bg-blue-600 text-white w-full px-4 py-3  flex items-center justify-between shadow box-border ">
      {/* Left Side */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={toggle} className="text-2xl cursor-pointer ">☰</button>
        <div className="flex items-center gap-2 w-35 sm:w-60 md:w-80 bg-white rounded-xl py-1 px-2 text-black">
          <i className="fa fa-search text-gray-500 px-2 sm:text-blue-500 " aria-hidden="true"></i>
          <input type="text" placeholder="Search..." className="w-full px-2 py-1 outline-none" />
                  {/* <button className="bg-green-600 px-2 py-1.5  rounded-xl cursor-pointer">Search</button> */}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 ml-4 sm:gap-4 relative">
        {/* Messages */}
        <div className="relative" ref={msgRef}>
          <button
  onClick={() =>
    setDropdown((prev) => (prev === "messages" ? null : "messages"))
  }
  className="relative flex items-center gap-1 ml-1 cursor-pointer"
>
  <i className="fa fa-envelope text-xl"></i>
  <i className="fa fa-caret-down text-sm text-gray-400"></i>

  {msgCount > 0 && (
    <span className="absolute -top-1 -right-2 bg-red-600 text-xs px-1 rounded-full">
      {msgCount}
    </span>
  )}
</button>

          {dropdown === "messages" && (
            <ul className="absolute right-0 mt-2 w-56 bg-white text-gray-700 rounded shadow-lg z-50">
              {messageOptions.map((opt) => (
                <li
                  key={opt.key}
                  onClick={() => {
                    const newUnread = { ...unreadMessages };
                    delete newUnread[opt.key];
                    setUnreadMessages(newUnread);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                >
                  {opt.label}
                  {unreadMessages[opt.key] && (
                    <span className="h-2 w-2 bg-red-600 rounded-full"></span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Notifications */}
        <div className="relative " ref={notifRef}>
          <button
            onClick={() =>
              setDropdown((prev) =>
                prev === "notifications" ? null : "notifications"
              )
            }
            className="relative flex items-center gap-1 cursor-pointer"
          >
            <i className="fa fa-bell text-xl"></i>
            <i className="fa fa-caret-down text-sm text-gray-400" ></i>
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-xs px-1 rounded-full">
                {notifCount}
              </span>
            )}
          </button>
          {dropdown === "notifications" && (
            <ul className="absolute right-0 mt-2 w-56 bg-white text-gray-700 rounded shadow-lg z-50">
              {notificationOptions.map((opt) => (
                <li
                  key={opt.key}
                  onClick={() => {
                    const newUnread = { ...unreadNotifications };
                    delete newUnread[opt.key];
                    setUnreadNotifications(newUnread);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                >
                  {opt.label}
                  {unreadNotifications[opt.key] && (
                    <span className="h-2 w-2 bg-red-600 rounded-full"></span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userRef}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdown(prev => prev === "user" ? null : "user")}
          >
            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="hidden md:inline">{user?.name || "User"}</span>
          </div>

          {dropdown === "user" && (
            <ul className="absolute right-0 mt-2 w-40 bg-white text-gray-700 rounded shadow-lg z-50">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate("/settings")}
              >
                Settings
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
