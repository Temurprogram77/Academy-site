import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function User() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role || (role !== "USER" && role !== "PARENT")) {
      navigate("/login"); 
    }
  }, [navigate]);

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-bold">Baholar Tarixi</h1>
        <p className="text-gray-600 mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, odit.
        </p>
      </div>
    </div>
  );
}

export default User;
