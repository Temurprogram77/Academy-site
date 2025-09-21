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
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!token) {
      console.error("Token topilmadi!");
      return;
    }

    // Students
    api
      .get("/user/search?role=STUDENT&page=0&size=10")
      .then((res) => {
        const arr = res?.data?.data?.body ?? [];
        console.log("Students array:", arr);
        setStudents(arr);
      })
      .catch((err) => console.error("Students error:", err));

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
      .then((res) => {
        const arr = res?.data?.data?.body ?? [];
        console.log("Teachers array:", arr);
        setTeachers(arr);
      })
      .catch((err) => console.error("Teachers error:", err));
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
              {/* O'quvchi */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                {student.fullName || student.name || "No name"}
              </td>

              {/* Telefon */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {student.phone || student.phoneNumber || "No phone"}
              </td>

              {/* Parents */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {student.parentName || "Ota/ona"}
              </td>

              {/* Level */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {student.level || "Level"}
              </td>

              {/* Teacher */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {teachers[idx]?.fullName || "Noma'lum"}
              </td>

              {/* Role */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {student.role || "STUDENT"}
              </td>

              {/* Guruh */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {student.groupName || groups[idx]?.name || "Guruh"}
              </td>

              {/* Xona */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {rooms[idx]?.name || "Nomalum"}
              </td>

              {/* Edit tugmasi */}
              <td className="px-6 py-4">
                <button
                  className="text-indigo-500 hover:text-indigo-700 font-medium"
                  onClick={() => navigate(`/student/${student.id}`)}
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
              O'quvchilar topilmadi
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default AdminTable;
