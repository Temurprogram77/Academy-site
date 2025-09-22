import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StudentPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true); // ✅ loading state
  const token = localStorage.getItem("token");

  // axios instance
  const api = axios.create({
    baseURL: "http://167.86.121.42:8080",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/user/search?role=STUDENT&page=0&size=100`)
      .then((res) => {
        const arr = res?.data?.data?.body ?? [];
        const studentData = arr.find((s) => s.id === Number(id));
        setStudent(studentData);
        setFormData(studentData); // modal uchun ma’lumotlar
      })
      .catch((err) => console.error("Student detail error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Group update
      if (formData.groupId) {
        await api.put(`/group/${formData.groupId}`, {
          name: formData.groupName,
        });
      }

      // Room update
      if (formData.roomId) {
        await api.put(`/room/${formData.roomId}?name=${formData.roomName}`);
      }

      // Mark update
      if (formData.markId) {
        await api.put(`/mark/${formData.markId}`, {
          value: formData.mark,
        });
      }

      alert("Ma’lumotlar yangilandi!");
      setIsModalOpen(false);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {student.fullName}
      </h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-[#5DB444] to-[#31e000] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Maydon
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Qiymat
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Amal
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-medium">Telefon</td>
              <td className="px-6 py-4 whitespace-nowrap">{student.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={handleEdit}
                  className="text-[#5DB444] hover:underline font-medium"
                >
                  Edit
                </button>
              </td>
            </tr>

            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium">Role</td>
              <td className="px-6 py-4 whitespace-nowrap">{student.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">—</td>
            </tr>

            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-medium">Guruh</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {student.groupName || "Guruh yo‘q"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={handleEdit}
                  className="text-[#5DB444] hover:underline font-medium"
                >
                  Edit
                </button>
              </td>
            </tr>

            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium">Level</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {student.level || "Noma’lum"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={handleEdit}
                  className="text-[#5DB444] hover:underline font-medium"
                >
                  Edit
                </button>
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-medium">Ota-ona</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {student.parentName || "Noma’lum"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">Ma’lumotni tahrirlash</h2>

            {/* Guruh */}
            <label className="block text-sm font-medium mb-1">Guruh nomi</label>
            <input
              type="text"
              name="groupName"
              value={formData.groupName || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mb-3"
            />

            {/* Room */}
            <label className="block text-sm font-medium mb-1">Room nomi</label>
            <input
              type="text"
              name="roomName"
              value={formData.roomName || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mb-3"
            />

            {/* Mark */}
            <label className="block text-sm font-medium mb-1">Mark</label>
            <input
              type="text"
              name="mark"
              value={formData.mark || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />

            {/* Tugmalar */}
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
