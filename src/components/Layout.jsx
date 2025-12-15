import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();

  // Close sidebar on mobile whenever route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isOpen} toggle={() => setIsOpen(v => !v)} />

      {isOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`flex-1 flex flex-col transition-all duration-300 w-full ${
          isOpen ? "md:ml-45" : "md:ml-0"
        }`}
      >
        <Header toggle={() => setIsOpen(v => !v)} />
        <main className="p-4 md:p-6 overflow-y-auto h-full">{children}</main>
      </div>
    </div>
  );
}
