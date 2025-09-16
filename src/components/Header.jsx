// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useUser } from "../context/UserContext";

export default function Header({ toggle }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [dropdown, setDropdown] = useState(null);

  // Messages & Notifications options
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

  const [unreadMessages, setUnreadMessages] = React.useState({});
  const [unreadNotifications, setUnreadNotifications] = React.useState({});
  const userId = user?._id || ""; // use real user ID

  // Fetch messages & notifications
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
    <header className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow">
      {/* Left Side */}
      <div className="flex items-center gap-2 sm:gap-6">
        <button onClick={toggle} className="text-2xl">☰</button>
        <div className="flex items-center gap-2 w-40 sm:w-60 md:w-96 bg-white rounded-lg py-1 px-2 text-black">
          <input type="text" placeholder="Search..." className="flex-1 px-2 py-1" />
        </div>
        <button className="bg-green-600 px-3 py-1 rounded-lg">Search</button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 relative">
        {/* Messages */}
        <div className="relative">
          <button
            onClick={() =>
              setDropdown((prev) => (prev === "messages" ? null : "messages"))
            }
            className="relative"
          >
            <i className="fa fa-envelope text-xl"></i>
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
        <div className="relative">
          <button
            onClick={() =>
              setDropdown((prev) =>
                prev === "notifications" ? null : "notifications"
              )
            }
            className="relative"
          >
            <i className="fa fa-bell text-xl"></i>
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
        <div className="relative">
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
