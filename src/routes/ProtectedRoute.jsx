// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useUser } from "../context/UserContext";
// const ProtectedRoute = ({ children }) => {
//      const { user, loading } = useUser();
//   const token = localStorage.getItem("token");

//   if (!token) return <Navigate to="/login" replace />;
  
//   // if (!user) return <p className="text-center mt-10">Loading user...</p>;
//   // if (loading) return <p className="text-center mt-10">Loading...</p>;

//   // agar user naya ya profile incomplete → profile page
// const isProfileComplete = user?.name && user?.email;
// if (!isProfileComplete) return <Navigate to="/profile" replace />;


//   return children;
// };

// export default ProtectedRoute;


import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const token = localStorage.getItem("token");

  // 1️ Token hi nahi → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ User abhi load ho raha hai
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // 3️⃣ Token hai but user nahi (invalid token case)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 4️⃣ Profile incomplete
  const isProfileComplete = user.name && user.email;
  if (!isProfileComplete) {
    return <Navigate to="/profile" replace />;
  }

  // 5️⃣ Sab OK
  return children;
};

export default ProtectedRoute;

