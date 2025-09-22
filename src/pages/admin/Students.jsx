import React, { useEffect, useState } from "react";
import axios from "axios";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
      return;
    }

    api
      .get("/user/search?role=STUDENT&page=0&size=20")
      .then((res) => {
        const arr = res?.data?.data?.body ?? [];
        setStudents(arr);
      })
      .catch((err) => console.error("Students error:", err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
       <div className="mt-80 flex items-center justify-center bg-[#F3F4F6]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#208a00]"></div>
      </div>
    );
  }

  return (
    <div className="px-6">
      <table className="min-w-full divide-y divide-gray-200 my-10 border shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-[#5DB444] to-[#31e000] text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              O‘quvchi
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
          {students.length > 0 ? (
            students.map((student, idx) => (
              <tr
                key={student.id || idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                {/* Ism */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black flex items-center gap-3">
                  {student.imageUrl ? (
                    <img
                      src={student.imageUrl}
                      alt="student"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  )}
                  {student.fullName || "No name"}
                </td>

                {/* Telefon */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {student.phone || "No phone"}
                </td>

                {/* Role */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {student.role || "STUDENT"}
                </td>

                {/* Ko‘proq tugmasi */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-[#5DB444] hover:text-green-700 font-medium">
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
                Kechirasiz malumotlarni yuklashda xatolik yuz berdi!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
