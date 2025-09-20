import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import dataImages from "../assets/images"
import { FaHouse } from "react-icons/fa6";

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
    <aside className="w-64 text-green-300 border flex-shrink-0 h-screen p-6 overflow-y-auto">
    <img src={logo} />
    <hr/>
      <nav className="flex flex-col mt-[2rem] gap-3">
        <NavLink
          to="/teacher-dashboard"
          end
          className={({ isActive }) =>
            `px-3 py-2 rounded flex gap-[0.5rem] justify-start items-center text-[1rem] text-white hover:bg-green-500 transition ${
              isActive ? "bg-green-500 font-semibold" : ""
            }` 
          }
        >
        <FaHouse />  Dashboard
        </NavLink>
        <NavLink
          to="/teacher-dashboard"
          end
          className={({ isActive }) =>
            `px-3 py-2 rounded flex gap-[0.5rem] justify-start items-center text-[1rem] text-white hover:bg-green-500 transition ${
              isActive ? "bg-green-500 font-semibold" : ""
            }` 
          }
        >
        <FaHouse />  Dashboard
        </NavLink>
      </nav>
    </aside>
  );
};

export default TeacherSideBar;
