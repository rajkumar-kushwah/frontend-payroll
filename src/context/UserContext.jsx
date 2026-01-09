import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, getOfficeHolidaysApi } from "../utils/api";
import {   getPayrolls } from "../utils/api";


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(!user);

  //  OFFICE HOLIDAY CACHE (GLOBAL)
  const [officeHolidays, setOfficeHolidays] = useState([]);
  const [holidayLoaded, setHolidayLoaded] = useState(false);

  // Global payroll cache
const [payrolls, setPayrolls] = useState([]);
const [payrollLoaded, setPayrollLoaded] = useState(false);


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
      if (!token) {
        setLoading(false);
        return;
      }
         

         if (!user) setLoading(true);
      // setLoading(true);
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
        setHolidayLoaded(true); //  cache flag
      } catch (err) {
        console.error("Office holiday fetch failed", err);
      }
    };

    fetchOfficeHolidays();
  }, [user, holidayLoaded]);

  // 🔹 PAYROLL FETCH
  useEffect(() => {
  const fetchPayrolls = async () => {
    if (!user || payrollLoaded) return;

    try {
      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const currentDate = new Date();
      const month = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

      const res = await getPayrolls({ month });
      if (res.data && Array.isArray(res.data.data)) {
        setPayrolls(res.data.data);
      }
      setPayrollLoaded(true);
    } catch (err) {
      console.error("Payroll fetch failed", err);
    }
  };

  fetchPayrolls();
}, [user, payrollLoaded]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: updateUser,
        logout,
        loading,

        //  expose holidays
        officeHolidays,
        setOfficeHolidays,

        // payroll
    payrolls,
    setPayrolls,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
