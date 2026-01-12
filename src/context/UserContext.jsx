import { createContext, useContext, useState, useEffect } from "react";
import {
  getProfile,
  getOfficeHolidaysApi,
  getPayrolls,
} from "../utils/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 🔹 AUTH USER (ONLY FROM BACKEND, NOT localStorage)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 OFFICE HOLIDAYS (GLOBAL CACHE)
  const [officeHolidays, setOfficeHolidays] = useState([]);
  const [holidayLoaded, setHolidayLoaded] = useState(false);

  // 🔹 PAYROLL (GLOBAL CACHE)
  const [payrolls, setPayrolls] = useState([]);
  const [payrollLoaded, setPayrollLoaded] = useState(false);

  // 🔹 UPDATE USER (OPTIONAL SAVE)
  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  // 🔹 LOGOUT (SINGLE SOURCE)
  const logout = () => {
    setUser(null);
    setOfficeHolidays([]);
    setPayrolls([]);
    setHolidayLoaded(false);
    setPayrollLoaded(false);
    localStorage.clear();
    window.location.href = "/login";
  };

  // =====================================================
  // 🔹 1. FETCH AUTH PROFILE (FIRST & MOST IMPORTANT)
  // =====================================================
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await getProfile();
        updateUser(res.data); // ✅ ONLY SOURCE OF TRUTH
      } catch (err) {
        // ❌ 401 or 403 = INVALID SESSION
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
        } else {
          console.error("Profile fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // =====================================================
  // 🔹 2. FETCH OFFICE HOLIDAYS (AFTER USER CONFIRMED)
  // =====================================================
  useEffect(() => {
    if (!user?._id) return;
    if (user.role === "employee") return;
    if (holidayLoaded) return;

    const fetchOfficeHolidays = async () => {
      try {
        const res = await getOfficeHolidaysApi();
        setOfficeHolidays(res.data.data || []);
        setHolidayLoaded(true);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
        } else {
          console.error("Office holiday fetch failed:", err);
        }
      }
    };

    fetchOfficeHolidays();
  }, [user, holidayLoaded]);

  // =====================================================
  // 🔹 3. FETCH PAYROLLS (AFTER USER CONFIRMED)
  // =====================================================
  useEffect(() => {
    if (!user?._id) return;
    if (payrollLoaded) return;

    const fetchPayrolls = async () => {
      try {
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        const now = new Date();
        const month = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

        const res = await getPayrolls({ month });
        setPayrolls(res.data?.data || []);
        setPayrollLoaded(true);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
        } else {
          console.error("Payroll fetch failed:", err);
        }
      }
    };

    fetchPayrolls();
  }, [user, payrollLoaded]);

  // =====================================================
  // 🔹 CONTEXT PROVIDER
  // =====================================================
  return (
    <UserContext.Provider
      value={{
        user,
        setUser: updateUser,
        logout,
        loading,

        officeHolidays,
        setOfficeHolidays,

        payrolls,
        setPayrolls,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
