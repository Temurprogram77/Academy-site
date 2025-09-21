import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import dataImages from "../assets/images";
import { FaHouse } from "react-icons/fa6";
import { MdGrade } from "react-icons/md";
import { GiExitDoor } from "react-icons/gi";
import { IoMdCloseCircle } from "react-icons/io";
import { IoPersonCircleOutline } from "react-icons/io5";

const TeacherSideBar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const logo = dataImages.logo;

  const handleClick = () => {
    localStorage.clear();
    navigate("/login");
    onClose(); 
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full bg-white text-white p-6 flex flex-col transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0 w-full md:w-[20rem]" : "-translate-x-full w-full md:w-[20rem]"}
        md:relative md:translate-x-0
      `}
    >
      <div className="flex items-center justify-between mb-6">
        <img src={logo} className="h-12 cursor-pointer" alt="Logo" />
        <button
          className="md:hidden text-green-700 text-4xl"
          onClick={onClose}
        >
          <IoMdCloseCircle />
        </button>
      </div>

      <hr className="border-green-400" />

      <nav className="flex flex-col mt-6 gap-3 flex-1">
        <NavLink
          to="/teacher-dashboard"
          end
          onClick={onClose}
          className={({ isActive }) =>
            `px-3 py-3 rounded flex gap-2 bg-green-500 items-center text-base font-medium transition ${
              isActive ? "bg-green-600" : "hover:bg-green-500"
            }`
          }
        >
          <FaHouse /> Dashboard
        </NavLink>

        <NavLink
          to="/teacher-dashboard/gradies"
          end
          onClick={onClose} 
          className={({ isActive }) =>
            `px-3 py-3 rounded flex gap-2 bg-green-500 items-center text-base font-medium transition ${
              isActive ? "bg-green-600" : "hover:bg-green-500"
            }`
          }
        >
          <MdGrade /> Baholar
        </NavLink>
        <NavLink
          to="/teacher-dashboard/profile"
          end
          onClick={onClose} 
          className={({ isActive }) =>
            `px-3 py-2 rounded flex gap-2 bg-green-500 items-center text-base font-medium transition ${
              isActive ? "bg-green-600" : "hover:bg-green-500"
            }`
          }
        >
          <IoPersonCircleOutline /> Profile
        </NavLink>
      </nav>

      <button
        className="px-3 py-2 rounded flex gap-2 items-center text-base font-medium bg-green-500 hover:bg-green-600 transition"
        onClick={handleClick}
      >
        <GiExitDoor /> Chiqish
      </button>
    </aside>
  );
};

export default TeacherSideBar;
