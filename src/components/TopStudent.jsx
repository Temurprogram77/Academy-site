import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TopStudent = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://167.86.121.42:8080",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  useEffect(() => {
    if (!token) {
      console.error("Token topilmadi, login sahifasiga yo'naltiriladi.");
      navigate("/login");
      return;
    }

    api
      .get("/user/topStudentsForTeacher")
      .then((res) => {
        if (res?.data?.success) {
          // score bo‘yicha kamayish tartibida sort qilish va eng yaxshi 5 tasini olish
          const sorted = (res.data.data || [])
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
          setStudents(sorted);
        }
      })
      .catch((err) => console.error("Top students error:", err));
  }, [token, navigate]);

  const getLevelColor = (level) => {
    switch (level) {
      case "YASHIL":
        return "bg-green-200 text-green-800";
      case "QIZIL":
        return "bg-red-200 text-red-800";
      case "SARIQ":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "Noma'lum";
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
    }
    return phone;
  };

  return (
    <div className="my-10">
      <h1 className="text-xl sm:text-2xl text-center font-bold text-green-600 mb-6">
        Eng yaxshi 5 ta o‘quvchi
      </h1>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full text-sm sm:text-base border-collapse">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs uppercase">#</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs uppercase">Ism</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs uppercase">Telefon</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs uppercase">Ota/ona</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs uppercase">Level</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs uppercase">Score</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length > 0 ? (
              students.map((student, idx) => (
                <tr
                  key={student.id || idx}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-3 sm:px-6 py-4 font-bold">{idx + 1}</td>
                  <td className="px-3 sm:px-6 py-4 font-semibold">
                    {student.name || "No name"}
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    {formatPhoneNumber(student.phoneNumber)}
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    {student.parentName || "Ota/ona"}
                  </td>
                  <td
                    className={`px-3 sm:px-6 py-2 rounded text-center font-semibold ${getLevelColor(
                      student.level
                    )}`}
                  >
                    {student.level || "Level"}
                  </td>
                  <td className="px-3 sm:px-6 py-4 font-bold text-green-600">
                    {student.score ?? 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center px-3 sm:px-6 py-4 text-gray-500"
                >
                  Kechirasiz, top studentlar yuklanmadi!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopStudent;