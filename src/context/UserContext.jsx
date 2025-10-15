// src/context/UserContext.jsx
import { createContext, useContext, useState,useEffect } from "react";
import { getProfile } from "../utils/api";


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
});// sirf login info store

const updateUser = (data) => {
  setUser(data);
  localStorage.setItem("user", JSON.stringify(data));
};
const logout = () => {
  setUser(null);
  localStorage.removeItem("user");
   localStorage.removeItem("token");      // JWT token remove
  window.location.href = "/login";       // redirect to login page
};


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await getProfile();
        setUser(res.data);
        updateUser(res.data);
      } catch (err) {
        console.log(err);
        localStorage.removeItem("token");
      }
    };
    fetchUser();
  }, []);


  return (
    <UserContext.Provider value={{ user, setUser: updateUser,logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
