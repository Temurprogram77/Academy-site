import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminPanel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    // Shartni tekshirish
    if (!role || !token || role.trim() === "" || token.trim() === "") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <AdminSidebar />
    </div>
  );
};

export default AdminPanel;
