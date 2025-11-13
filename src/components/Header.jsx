import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useUser } from "../context/UserContext";

export default function Header({ toggle , isMobile, isOpen  }) {
  const navigate = useNavigate();
  const { user } = useUser();

  const [dropdown, setDropdown] = useState(null);
  const [query, setQuery] = useState("");        // search input
  const [results, setResults] = useState([]);    // search results
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  // 🔹 Refs for dropdowns
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

 

  //  Live Search effect with debounce
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

  

  return (
    <header className="bg-lime-300 w-full px-4  py-2 flex items-center justify-between shadow box-border">
      {/* Left Side */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={() => {
          toggle(); 
        setIsMenuOpen(!isMenuOpen);
        }}
       className="text-sm text-black cursor-pointer ">{isOpen ? "×" : "☰"}
       
       </button>

        {/* Search Box */}
        <div className="relative flex items-center gap-2 w-full bg-white  border-black rounded-2xl py-1 px-2 text-black">
          <i className="fa fa-search text-gray-500 px-2" aria-hidden="true"></i>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employee..."
            className={`transition-all text-xs duration-300 outline-none 
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
        {/* <div className="relative" ref={msgRef}>
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
        </div> */}

        {/* Notifications */}
        {/* <div className="relative" ref={notifRef}>
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
        </div> */}

        {/* User Dropdown */}
        <div className="relative" ref={userRef}>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => setDropdown(prev => prev === "user" ? null : "user")}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-7 h-7 rounded-full border-1  border-black" />
            ) : (
              <div className="w-7 h-7 rounded-full  bg-gray-400 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <span className="hidden text-xs md:inline">{user?.name || "User"}</span>
            <i className={`fa fa-caret-down text-sm text-gray-500 transition-transform duration-300  ${dropdown === "user" ? "rotate-180" : "rotate-0"}`}></i>
          </div>

          {dropdown === "user" && (
            <ul className="absolute right-0 mt-2 w-75 bg-white text-gray-700 rounded shadow-lg z-50">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => navigate("/profile")}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-7 h-7 rounded-full border-2 border-green-600" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex flex-col text-xs">
                  My Profile
                  <span className="text-xs">{user?.email || "email"}</span>
                </div>
              </li>
              <li className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => navigate("/settings")}>
                <i className="fa fa-cog" aria-hidden="true"></i> Settings
              </li>
              <li className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
                <i className="fa fa-sign-out" aria-hidden="true"></i> Logout
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
