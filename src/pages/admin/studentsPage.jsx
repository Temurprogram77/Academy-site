import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

const StudentPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // axios instance
  const api = axios.create({
    baseURL: "http://167.86.121.42:8080",
    headers: { Authorization: `Bearer ${token}` },
  });

  // studentni olish
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/user/search?role=STUDENT&page=0&size=50`)
      .then((res) => {
        const arr = res?.data?.data?.body ?? [];
        const studentData = arr.find((s) => s.id === Number(id));
        setStudent(studentData);
        setFormData(studentData);
      })
      .catch((err) => console.error("Student detail error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put(`/user/${id}`, formData);
      alert("Ma’lumotlar yangilandi!");
      setIsModalOpen(false);
      setStudent(formData);
    } catch (err) {
      console.error("Update error:", err);
      alert("Xatolik yuz berdi!");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!student) {
    return <p className="p-6 text-gray-600">O‘quvchi topilmadi!</p>;
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          {student.imageUrl && student.imageUrl !== "string" ? (
            <img
              src={student.imageUrl}
              alt="student"
              className="w-28 h-28 rounded-full object-cover border-4 border-green-500 shadow"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
              }}
            />
          ) : (
            <FaUserCircle className="w-28 h-28 text-gray-400" />
          )}
          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            {student.fullName}
          </h1>
          <p className="text-gray-500">{student.role}</p>
        </div>

        {/* Info */}
        <div className="mt-6 space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Telefon:</span>
            <span className="text-gray-800">{student.phone || "—"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Guruh:</span>
            <span className="text-gray-800">{student.groupName || "—"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Level:</span>
            <span className="text-gray-800">{student.level || "Noma’lum"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Ota-ona:</span>
            <span className="text-gray-800">{student.parentName || "—"}</span>
          </div>
        </div>

        {/* Edit tugmasi */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleEdit}
            className="px-5 py-2 rounded-lg bg-[#5DB444] text-white hover:bg-green-600"
          >
            Tahrirlash
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Ma’lumotni tahrirlash
            </h2>

            {/* Telefon */}
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mb-3"
            />

            {/* Guruh */}
            <label className="block text-sm font-medium mb-1">Guruh nomi</label>
            <input
              type="text"
              name="groupName"
              value={formData.groupName || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mb-3"
            />

            {/* Level */}
            <label className="block text-sm font-medium mb-1">Level</label>
            <input
              type="text"
              name="level"
              value={formData.level || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-[#5DB444] text-white hover:bg-green-600"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPage;
