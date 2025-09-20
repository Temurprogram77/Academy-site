import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const TeacherSideBar = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://167.86.121.42:8080/group?page=0&size=10", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const body = res.data.data.body || [];
        setGroups(body);
      })
      .catch((err) => {
        console.error("Guruhlarni olishda xato:", err);
      });
  }, [navigate]);

  return (
    <aside className="w-64 bg-green-500 text-white flex-shrink-0 h-screen p-5">
      <h1 className="text-2xl font-bold mb-6">O‘qituvchi Paneli</h1>

      <nav className="flex flex-col gap-3">
        <NavLink
          to="/teacher"
          className={({ isActive }) =>
            `px-3 py-2 rounded hover:bg-green-600 ${
              isActive ? "bg-green-700 font-semibold" : ""
            }`
          }
        >
          Dashboard
        </NavLink>

        <h2 className="mt-4 mb-2 font-semibold">Sizning Guruhlaringiz:</h2>
        {groups.length === 0 && <p className="text-sm text-green-200">Guruhlar yuklanmoqda...</p>}

        {groups.map((group) => (
          <NavLink
            key={group.id}
            to={`/teacher/grade/${group.id}`}
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-green-600 ${
                isActive ? "bg-green-700 font-semibold" : ""
              }`
            }
          >
            {group.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default TeacherSideBar;
