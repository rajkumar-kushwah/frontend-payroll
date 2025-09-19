import React from "react";
import { Navigate } from "react-router-dom";


 const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("token");

// Ager login h to dashboard per redirect krdo 
if(token) {
    return <Navigate to="/dashboard" replace />;
}

// Agar login nhi h to login pr redirect krdo
return children;

}

export default PublicRoute