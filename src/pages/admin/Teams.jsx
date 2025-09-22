import React, { useEffect, useState } from "react";
import axios from "axios";
import { TiPlusOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://167.86.121.42:8080",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Guruhlarni olish
  useEffect(() => {
    if (!token) {
      setError("Token topilmadi!");
      setLoading(false);
      return;
    }

    api
      .get("/group?page=0&size=50")
      .then((res) => {
        const arr = res?.data?.data?.body ?? [];
        setTeams(arr);
        setFilteredTeams(arr);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Teams error:", err);
        setError("Kechirasiz, guruhlarni yuklashda xatolik yuz berdi!");
        setLoading(false);
      });
  }, [token]);

  // Search
  useEffect(() => {
    const normalizedSearch = (search || "").toLowerCase().trim();
    const filtered = teams.filter(
      (team) =>
        (team.name || "").toLowerCase().includes(normalizedSearch) ||
        (team.teacherName || "").toLowerCase().includes(normalizedSearch)
    );
    setFilteredTeams(filtered);
  }, [search, teams]);

  if (loading) {
    return (
      <div className="mt-80 flex items-center justify-center bg-[#F3F4F6]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#208a00]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-6">
      {/* Add Team va Search */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <button
          onClick={() => navigate("/admin-dashboard/team/add")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <TiPlusOutline size={20} />
          <span>Yangi Guruh</span>
        </button>

        <input
          type="text"
          placeholder="Guruh yoki o‘qituvchi bo‘yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <table className="min-w-full divide-y divide-gray-200 my-10 border shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-[#5DB444] to-[#31e000] text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Guruh nomi
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              O‘qituvchi
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              O‘quvchilar soni
            </th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team, idx) => (
              <tr
                key={team.id || idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                {/* Guruh nomi */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                  {team.name}
                </td>

                {/* O‘qituvchi */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {team.teacherName || "-"}
                </td>

                {/* O‘quvchilar soni */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {team.studentCount ?? 0}
                </td>

                {/* Ko‘proq tugmasi */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    className="text-[#5DB444] hover:text-green-700 font-medium"
                    onClick={() => navigate(`/admin-dashboard/team/${team.id}`)}
                  >
                    Ko‘proq
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="text-center px-6 py-4 text-sm text-gray-500"
              >
                Hech qanday guruh topilmadi
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Teams;
