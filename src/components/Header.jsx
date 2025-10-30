import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useUser } from "../context/UserContext";

export default function Header({ toggle }) {
  const navigate = useNavigate();
  const { user } = useUser();

  const [dropdown, setDropdown] = useState(null);
  const [query, setQuery] = useState("");        // search input
  const [results, setResults] = useState([]);    // search results
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


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

  // 🔹 Fetch messages & notifications
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

  // 🔹 Live Search effect with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const debounce = setTimeout(async () => {
      try {
        //  Correct endpoint spelling `/employees` not `/empoyees`
        const res = await api.get(`/employees?search=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const msgCount = Object.keys(unreadMessages).length;
  const notifCount = Object.keys(unreadNotifications).length;

  return (
    <header className="bg-green-500 w-full px-4  py-3 flex items-center justify-between shadow box-border">
      {/* Left Side */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={() => {
          toggle(); 
        setIsMenuOpen(!isMenuOpen);
        }}
       className="text-2xl text-white cursor-pointer">{isMenuOpen ? "×" : "☰"}
       </button>

        {/* Search Box */}
        <div className="relative flex items-center gap-2 w-full bg-white border border-black rounded-xl py-1 px-2 text-black">
          <i className="fa fa-search text-gray-500 px-2" aria-hidden="true"></i>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employee..."
            className={`transition-all duration-300 outline-none 
      ${query ? "w-30 md:w-40" : "w-20 md:w-40"} 
      px-2 `}
          />

          {/* Loading */}
          {loading && (
            <div className="absolute top-full left-0 mt-1 text-gray-500 text-sm">Loading...</div>
          )}

          {/* Search Results Dropdown */}
          {query && results.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-auto">
              {results.map((emp) => (
                <li
                  key={emp._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                  onClick={() => navigate(`/employee/${emp._id}`)}
                >
                  <div>
                    <span className="font-medium">{emp.name}</span>
                    <div className="text-sm text-gray-500">{emp.position}</div>
                  </div>
                  <div className="text-xs text-gray-400">{emp.department}</div>
                </li>
              ))}
            </ul>
          )}

          {/* No results */}
          {query && results.length === 0 && !loading && (
            <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-1 text-gray-500 px-4 py-2 text-sm">
              No results found
            </div>
          )}
        </div>
      </div>

      {/* Right Side (Messages, Notifications, User Dropdown) */}
      <div className="flex items-center gap-2 ml-4 sm:gap-4 relative">
        {/* Messages */}
        <div className="relative" ref={msgRef}>
          <button
            onClick={() => setDropdown(prev => prev === "messages" ? null : "messages")}
            className="relative flex items-center gap-1 ml-1 cursor-pointer"
          >
            <i className="fa fa-envelope text-xl"></i>
            <i className={`fa fa-caret-down text-sm text-gray-500 transition-transform duration-300 ${dropdown === "messages" ? "rotate-180" : "rotate-0"}`}></i>
            {msgCount > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-xs px-1 rounded-full">{msgCount}</span>}
          </button>

          {dropdown === "messages" && (
            <ul className="absolute right-0 mt-2 w-56 bg-white text-gray-700 rounded shadow-lg z-50">
              {messageOptions.map(opt => (
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
                  {unreadMessages[opt.key] && <span className="h-2 w-2 bg-red-600 rounded-full"></span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setDropdown(prev => prev === "notifications" ? null : "notifications")}
            className="relative flex items-center gap-1 cursor-pointer"
          >
            <i className="fa fa-bell text-xl"></i>
            <i className={`fa fa-caret-down text-sm text-gray-500 transition-transform duration-300 ${dropdown === "notifications" ? "rotate-180" : "rotate-0"}`}></i>
            {notifCount > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-xs px-1 rounded-full">{notifCount}</span>}
          </button>

          {dropdown === "notifications" && (
            <ul className="absolute right-0 mt-2 w-56 bg-white text-gray-700 rounded shadow-lg z-50">
              {notificationOptions.map(opt => (
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
                  {unreadNotifications[opt.key] && <span className="h-2 w-2 bg-red-600 rounded-full"></span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userRef}>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => setDropdown(prev => prev === "user" ? null : "user")}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border-1  border-black" />
            ) : (
              <div className="w-8 h-8 rounded-full  bg-gray-400 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <span className="hidden md:inline">{user?.name || "User"}</span>
            <i className={`fa fa-caret-down text-sm text-gray-500 transition-transform duration-300  ${dropdown === "user" ? "rotate-180" : "rotate-0"}`}></i>
          </div>

          {dropdown === "user" && (
            <ul className="absolute right-0 mt-2 w-75 bg-white text-gray-700 rounded shadow-lg z-50">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => navigate("/profile")}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border-2 border-green-600" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex flex-col text-sm">
                  My Profile
                  <span className="text-sm">{user?.email || "email"}</span>
                </div>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => navigate("/settings")}>
                <i className="fa fa-cog" aria-hidden="true"></i> Settings
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
                <i className="fa fa-sign-out" aria-hidden="true"></i> Logout
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
