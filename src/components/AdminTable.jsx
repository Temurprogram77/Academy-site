import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminTable = () => {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [rooms, setRooms] = useState([]);

  const token = localStorage.getItem("token"); // 🔑 login vaqtida saqlangan token

  // axios instance
  const api = axios.create({
    baseURL: "http://167.86.121.42:8080",
    headers: {
      Authorization: `Bearer ${token}`, // token headerga
    },
  });

  useEffect(() => {
    if (!token) {
      console.error("Token topilmadi!");
      return;
    }

    // Students
    api
      .get("/user/topStudents")
      .then((res) => {
        console.log("Students data:", res.data);
        setStudents(res.data.data || []); // ✅ faqat massivni olamiz
      })
      .catch((err) => console.error("Students error:", err));

    // Groups
    api
      .get("/group")
      .then((res) => {
        console.log("Groups data:", res.data);
        setGroups(res.data.data || []);
      })
      .catch((err) => console.error("Groups error:", err));

    // Rooms
    api
      .get("/room")
      .then((res) => {
        console.log("Rooms data:", res.data);
        setRooms(res.data.data || []);
      })
      .catch((err) => console.error("Rooms error:", err));
  }, [token]);

  return (
    <table className="min-w-full divide-y divide-gray-200 my-10 border">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            O'quvchilar
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Phone Number
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Parents
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Level
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Teacher
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Role
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Guruh
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
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
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                {student.name || "No name"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {student.phoneNumber || "No phone"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {student.parentName || "Ota/ona"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {student.level || "Level"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {student.teacherName || "Teacher"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {student.role || "Student"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {groups[idx]?.name || "Guruh"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {rooms[idx]?.name || "Xona"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button className="text-indigo-500 hover:text-indigo-700 font-medium">
                  Edit
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
              O'quvchilar topilmadi
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default AdminTable;
