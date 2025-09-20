import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import dataImages from "../assets/images";
import { FaHouse } from "react-icons/fa6";
import { MdGrade } from "react-icons/md";
import { GiExitDoor } from "react-icons/gi";

const TeacherSideBar = () => {
  const navigate = useNavigate();
  const logo = dataImages.logo;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleClick = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-[20rem] text-green-300 border flex-shrink-0 h-screen p-6 flex flex-col">
      <img src={logo} className="cursor-pointer mb-4" />
      <hr />
      <nav className="flex flex-col mt-[2rem] gap-3 flex-1">
        <NavLink
          to="/teacher-dashboard"
          end
          className={({ isActive }) =>
            `px-3 py-2 rounded flex gap-[0.5rem] font-semibold justify-start items-center text-[1rem] text-white bg-green-500 hover:bg-green-500 transition ${
              isActive ? "bg-green-600 font-semibold" : ""
            }`
          }
        >
          <FaHouse /> Dashboard
        </NavLink>

        <NavLink
          to="/teacher-dashboard/gradies"
          end
          className={({ isActive }) =>
            `px-3 py-2 rounded flex gap-[0.5rem] font-semibold justify-start items-center text-[1rem] text-white bg-green-500 hover:bg-green-500 transition ${
              isActive ? "bg-green-600 font-semibold" : ""
            }`
          }
        >
          <MdGrade /> Baholar
        </NavLink>
      </nav>

      <button
        className="px-3 py-2 rounded flex gap-[0.5rem] font-semibold justify-start items-center text-[1rem] text-white bg-green-500 transition"
        onClick={handleClick}
      >
        <GiExitDoor /> Chiqish
      </button>
    </aside>
  );
};

export default TeacherSideBar;
