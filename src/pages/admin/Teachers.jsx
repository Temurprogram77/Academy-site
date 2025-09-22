import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TiPlusOutline } from "react-icons/ti";
import { FiUser } from "react-icons/fi";

// Telefon raqam formatlash funksiyasi
const formatPhoneNumber = (phone) => {
  if (!phone) return "Noma'lum";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone;
};

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
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

  // Teachers ma'lumotlarini olish
  useEffect(() => {
    if (!token) {
      setError("Token topilmadi!");
      setLoading(false);
      return;
    }

    api
      .get("/user/search?role=TEACHER&page=0&size=50")
      .then((res) => {
        const arr = res?.data?.data?.body ?? [];
        setTeachers(arr);
        setFilteredTeachers(arr);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Teachers error:", err);
        setError("Kechirasiz, malumotlarni yuklashda xatolik yuz berdi!");
        setLoading(false);
      });
  }, [token]);

  // Name bo‘yicha search
  useEffect(() => {
    const normalizedSearch = (search || "").toLowerCase().trim();

    const filtered = teachers.filter((teacher) => {
      const name = (teacher.fullName || "").toLowerCase();
      return name.includes(normalizedSearch);
    });

    setFilteredTeachers(filtered);
  }, [search, teachers]);

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
      {/* Add Teacher va Search */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <button
          onClick={() => navigate("/admin-dashboard/teacher/add")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <TiPlusOutline size={20} />
          <span>Add New Teacher</span>
        </button>

        <input
          type="text"
          placeholder="Ism bo‘yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <table className="min-w-full divide-y divide-gray-200 my-6 border shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-[#5DB444] to-[#31e000] text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              O‘qituvchi
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Telefon
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Amal
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher, idx) => (
              <tr
                key={teacher.id || idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                  {teacher.imageUrl ? (
                    <img
                      src={teacher.imageUrl}
                      alt="teacher"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <FiUser className="text-gray-500" size={16} />
                    </div>
                  )}
                  {teacher.fullName || "No name"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatPhoneNumber(teacher.phone)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {teacher.role || "TEACHER"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() =>
                      navigate(`/admin-dashboard/teacher/${teacher.id}`)
                    }
                    className="text-[#5DB444] hover:text-green-700 font-medium"
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
                O‘qituvchilar topilmadi
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Teachers;
