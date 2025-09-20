import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminPanel = () => {
  const navigate = useNavigate();

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
      <AdminSidebar />

      {/* Kontent qismi  faqatOutlet orqali almashadi */}
      <main className="flex-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
