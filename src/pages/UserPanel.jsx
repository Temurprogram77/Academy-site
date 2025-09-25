import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserNavbar from "../components/UserNavbar";
import { FaBars } from "react-icons/fa6";
import { useState, useEffect } from "react";

export default function UserPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />

      <div className="flex-1 flex flex-col">
        <UserNavbar />

        <main className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          {isMobile && (
            <div className="flex items-center mb-4">
              <button
                className="text-green-700 text-2xl"
                onClick={() => setIsSidebarOpen(true)}
              >
                <FaBars />
              </button>
              <h1 className="ml-4 text-xl font-bold text-green-700">
                Student Panel
              </h1>
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
}