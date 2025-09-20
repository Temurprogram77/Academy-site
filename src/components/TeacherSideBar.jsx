import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import dataImages from "../assets/images"

const TeacherSideBar = () => {
  const navigate = useNavigate();
  const logo=dataImages.logo  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  return (
    <aside className="w-64 text-green-300 flex-shrink-0 h-screen p-5 overflow-y-auto">
    <img src={logo} />
      <nav className="flex flex-col gap-3">
        <NavLink
          to="/teacher-dashboard"
          end
          className={({ isActive }) =>
            `px-3 py-2 rounded hover:bg-green-600 transition ${
              isActive ? "bg-green-700 font-semibold" : ""
            }`
          }
        >
          Dashboard
        </NavLink>
      </nav>
    </aside>
  );
};

export default TeacherSideBar;
