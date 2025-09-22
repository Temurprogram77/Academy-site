import React, { useEffect, useState } from "react";
import axios from "axios";
import { TiPlusOutline } from "react-icons/ti";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const formatPhoneNumber = (phone) => {
  if (!phone) return "Noma'lum";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone;
};

const Parents = () => {
  const [parents, setParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
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

  useEffect(() => {
    if (!token) {
      setError("Token topilmadi!");
      setLoading(false);
      return;
    }

    api
      .get("/user/search?role=PARENT&page=0&size=50")
      .then((res) => {
        const arr = res?.data?.data?.body ?? [];
        setParents(arr);
        setFilteredParents(arr);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Parents error:", err);
        setError("Kechirasiz, malumotlarni yuklashda xatolik yuz berdi!");
        setLoading(false);
      });
  }, [token]);

  // Search
  useEffect(() => {
    const normalizedSearch = (search || "").toLowerCase().trim();
    const filtered = parents.filter((parent) =>
      (parent.fullName || "").toLowerCase().includes(normalizedSearch)
    );
    setFilteredParents(filtered);
  }, [search, parents]);

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
      {/* Add Parent va Search */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <button
          onClick={() => navigate("/admin-dashboard/parent/add")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <TiPlusOutline size={20} />
          <span>Add New Parent</span>
        </button>

        <input
          type="text"
          placeholder="Ism bo‘yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <table className="min-w-full divide-y divide-gray-200 my-10 border shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-[#5DB444] to-[#31e000] text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Ota-ona
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Telefon raqam
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {filteredParents.length > 0 ? (
            filteredParents.map((parent, idx) => (
              <tr
                key={parent.id || idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                {/* Ism */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black flex items-center gap-3">
                  {parent.imageUrl ? (
                    <img
                      src={parent.imageUrl}
                      alt="parent"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <FiUser className="text-gray-500" size={16} />
                    </div>
                  )}
                  {parent.fullName || "No name"}
                </td>

                {/* Telefon */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatPhoneNumber(parent.phone)}
                </td>

                {/* Role */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {parent.role || "PARENT"}
                </td>

                {/* Ko‘proq tugmasi */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    className="text-[#5DB444] hover:text-green-700 font-medium"
                    onClick={() =>
                      navigate(`/admin-dashboard/parent/${parent.id}`)
                    }
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
                Ota-onalar topilmadi
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Parents;
