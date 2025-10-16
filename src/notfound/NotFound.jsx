// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">We could not show this page</h1>
      <p className="text-gray-600 mb-6 text-center">
        Try to refresh the page. Go back to where you were and try again to access this page. <br/>
        If you have entered the page URL manually, check it’s the right URL. <br/>
        If it still does not work, contact our Support team.
      </p>
      <Link 
        to="/" 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
