import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!role || !token || role.trim() === "" || token.trim() === "") {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div className="flex h-screen">
      {/* Sidebar doimiy turadi */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Kontent qismi  faqatOutlet orqali almashadi */}
      <main className="flex-1 bg-gray-100">
        <AdminNavbar setIsSidebarOpen={setIsSidebarOpen} />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
