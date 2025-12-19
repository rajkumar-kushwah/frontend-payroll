import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, getOfficeHolidaysApi } from "../utils/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(!user);

  // 🔥 OFFICE HOLIDAY CACHE (GLOBAL)
  const [officeHolidays, setOfficeHolidays] = useState([]);
  const [holidayLoaded, setHolidayLoaded] = useState(false);

  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // 🔹 USER PROFILE FETCH
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      try {
        const res = await getProfile();
        if (res.data) {
          updateUser(res.data);
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 🔹 OFFICE HOLIDAY FETCH (ONLY ONCE)
  useEffect(() => {
    const fetchOfficeHolidays = async () => {
      if (!user || user.role === "employee" || holidayLoaded) return;

      try {
        const res = await getOfficeHolidaysApi();
        setOfficeHolidays(res.data.data);
        setHolidayLoaded(true); // 🔥 cache flag
      } catch (err) {
        console.error("Office holiday fetch failed", err);
      }
    };

    fetchOfficeHolidays();
  }, [user, holidayLoaded]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: updateUser,
        logout,
        loading,

        // 👇 expose holidays
        officeHolidays,
        setOfficeHolidays,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
