import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminTable = () => {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
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

    // Students from topStudents API
    api
      .get("/user/topStudents")
      .then((res) => {
        if (res?.data?.success) setStudents(res.data.data || []);
      })
      .catch((err) => console.error("Leaderboard error:", err));

    // Groups
    api
      .get("/group")
      .then((res) => setGroups(res.data.data || []))
      .catch((err) => console.error("Groups error:", err));

    // Rooms
    api
      .get("/room")
      .then((res) => setRooms(res.data.data || []))
      .catch((err) => console.error("Rooms error:", err));

    // Teachers
    api
      .get("/user/search?role=TEACHER&page=0&size=10")
      .then((res) => setTeachers(res?.data?.data?.body || []))
      .catch((err) => console.error("Teachers error:", err));
  }, [token, navigate,api]);

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
    // raqamni faqat sonlar shaklida olish
    const cleaned = phone.replace(/\D/g, "");
    // formatlash
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
    }
    return phone; // formatlash mumkin bo'lmasa aslini qaytar
  };

  return (
    <table className="min-w-full divide-y divide-gray-200 my-10 border">
      <thead className="bg-gray-100 text-black">
        <tr>
          <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
            O'quvchilar
          </th>
          <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
            Phone Number
          </th>
          <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
            Parents
          </th>
          <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
            Level
          </th>
          <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
            Teacher
          </th>
          <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
            Role
          </th>
          <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
            Guruh
          </th>
          <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
            Xona
          </th>
          <th className="px-6 py-3"></th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {students.length > 0 ? (
          students.map((student, idx) => (
            <tr
              key={student.id || idx}
              className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black">
                {student.name || "No name"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {formatPhoneNumber(student.phoneNumber)}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {student.parentName || "Ota/ona"}
              </td>
              <td
                className={`whitespace-nowrap text-sm font-semibold text-center ${getLevelColor(
                  student.level
                )}`}
              >
                {student.level || "Level"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {teachers[idx]?.fullName || "Noma'lum"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {student.role || "STUDENT"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {student.groupName || groups[idx]?.name || "Guruh"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {rooms[idx]?.name || "Noma'lum"}
              </td>
              <td className="px-6 py-4">
                <button
                  className="text-[#5DB445] hover:text-[#37ff00] font-medium"
                  onClick={() =>
                    navigate(`/admin-dashboard/student/${student.id}`)
                  }
                >
                  Ko'proq
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="9"
              className="text-center px-6 py-4 text-sm text-gray-500"
            >
              Kechirasiz, malumotlarni yuklashda xatolik yuz berdi!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default AdminTable;
