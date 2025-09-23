import React, { useEffect, useState } from "react";
import axios from "axios";
import { TiPlusOutline } from "react-icons/ti";
import { FaUserCircle } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast, { Toaster } from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const formatPhoneNumber = (phone) => {
  if (!phone) return "Noma'lum";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone;
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // Modal uchun tanlangan o'quvchi
  const [groups, setGroups] = useState([]);
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://167.86.121.42:8080",
    headers: { Authorization: `Bearer ${token}` },
  });

  const defaultImg = "https://i.ibb.co/6t0KxkX/default-user.png";

  useEffect(() => {
    if (!token) {
      setError("Token topilmadi!");
      setLoading(false);
      return;
    }

    api
      .get("/user/search?role=STUDENT&page=0&size=50")
      .then((res) => {
        const arr = res?.data?.data?.body ?? [];
        setStudents(arr);
        setFilteredStudents(arr);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Students error:", err);
        setError("Malumotlarni yuklashda xatolik yuz berdi!");
        setLoading(false);
      });

    axios
      .get("http://167.86.121.42:8080/group/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data?.success) setGroups(res.data.data);
      })
      .catch(() => toast.error("Guruhlarni yuklashda xatolik!"));
  }, [token]);

  useEffect(() => {
    const normalizedSearch = (search || "").toLowerCase().trim();
    const filtered = students.filter((student) =>
      (student.fullName || "").toLowerCase().includes(normalizedSearch)
    );
    setFilteredStudents(filtered);
  }, [search, students]);

  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  if (loading)
    return (
      <div className="mt-80 flex items-center justify-center bg-[#F3F4F6]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#208a00]"></div>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="px-6">
      <Toaster />
      <div className="flex items-center justify-between mt-6 mb-4">
        <h2 className="text-xl font-semibold text-green-600">O‘quvchilar ro‘yxati</h2>
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
              O‘quvchi
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Telefon
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Harakat
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, idx) => (
              <tr
                key={student.id || idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                  {student.imgUrl ? (
                    <img
                      src={student.imgUrl}
                      alt="student"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-400" />
                  )}
                  {student.fullName || "No name"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatPhoneNumber(student.phone)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {student.role || "STUDENT"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => openStudentModal(student)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
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
                O‘quvchilar topilmadi
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-96 relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              {selectedStudent.fullName}
            </h2>
            <div className="flex flex-col gap-3">
              <img
                src={selectedStudent.imgUrl || defaultImg}
                alt="student"
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
              <p>
                <strong>Telefon:</strong>{" "}
                {formatPhoneNumber(selectedStudent.phone)}
              </p>
              <p>
                <strong>Role:</strong> {selectedStudent.role || "STUDENT"}
              </p>
              <p>
                <strong>Guruh:</strong>{" "}
                {groups.find((g) => g.id === selectedStudent.groupId)?.name ||
                  "Noma'lum"}
              </p>
              <p>
                <strong>Parent telefon:</strong>{" "}
                {formatPhoneNumber(selectedStudent.parentPhone)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
