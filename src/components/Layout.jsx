import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  // Mobile view ke liye by default close
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    } else{
      setIsOpen(true);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100  ">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggle={() => setIsOpen((v) => !v)} />

      {/* Overlay - sirf mobile view me jab sidebar open ho */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 w-full ${
          isOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        <Header toggle={() => setIsOpen((v) => !v)} />
        <main className="p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
