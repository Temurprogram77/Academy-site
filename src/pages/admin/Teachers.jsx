import React, { useEffect, useState } from "react";
import axios from "axios";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
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

    api
      .get("/user/search?role=TEACHER&page=0&size=10")
      .then((res) => {
        const arr = res?.data?.data?.body ?? [];
        console.log("Teachers data:", arr);
        setTeachers(arr);
      })
      .catch((err) => console.error("Teachers error:", err));
  }, [token]);

  return (
    <table className="min-w-full divide-y divide-gray-200 my-10 border">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            O'qituvchi
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Telefon raqam
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            Role
          </th>
          <th className="px-6 py-3"></th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {teachers.length > 0 ? (
          teachers.map((teacher, idx) => (
            <tr
              key={teacher.id || idx}
              className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              {/* Ism */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black flex items-center gap-3">
                {teacher.imageUrl ? (
                  <img
                    src={teacher.imageUrl}
                    alt="teacher"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                )}
                {teacher.fullName || "No name"}
              </td>

              {/* Telefon */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {teacher.phone || "No phone"}
              </td>

              {/* Role */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {teacher.role || "TEACHER"}
              </td>

              {/* Edit tugmasi */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button className="text-indigo-500 hover:text-indigo-700 font-medium">
                  Ko'proq
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
              O'qituvchilar topilmadi
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Teachers;
