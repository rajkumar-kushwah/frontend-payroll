// src/context/UserContext.jsx
import { createContext, useContext, useState } from "react";

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
};


  return (
    <UserContext.Provider value={{ user, setUser: updateUser,logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
