import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      <h1>Admin Panel</h1>
    </div>
  );
};

export default AdminPanel;
