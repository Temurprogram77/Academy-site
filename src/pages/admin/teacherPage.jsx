import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TeacherPage = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", groupName: "" });

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://167.86.121.42:8080",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!id) return;

    api
      .get(`/user/search?role=TEACHER&page=0&size=100`)
      .then((res) => {
        const arr = res?.data?.data?.body ?? [];
        const teacherData = arr.find((t) => t.id === Number(id));
        setTeacher(teacherData);
        if (teacherData) {
          setForm({
            fullName: teacherData.fullName || "",
            phone: teacherData.phone || "",
            groupName: teacherData.groupName || "",
          });
        }
      })
      .catch((err) => console.error("Teacher detail error:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await api.put(`/user/${id}`, form);
      setTeacher((prev) => ({ ...prev, ...form }));
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (!teacher) {
    return <p className="p-6">Ma’lumot yuklanmoqda...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {teacher.fullName}
      </h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl mb-4">
        <table className="min-w-full divide-y divide-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-[#5DB444] to-[#31e000] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Maydon
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Qiymat
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 font-medium">Telefon</td>
              <td className="px-6 py-4">{teacher.phone}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-6 py-4 font-medium">Role</td>
              <td className="px-6 py-4">{teacher.role}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium">Guruh</td>
              <td className="px-6 py-4">{teacher.groupName || "Guruh yo‘q"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Edit Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-40 py-2 bg-[#5CB346] text-white rounded-lg hover:bg-green-800"
      >
        Edit
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">O'qituvchini tahrirlash</h2>

            <label className="block mb-2 text-sm">Ism</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <label className="block mb-2 text-sm">Telefon</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <label className="block mb-2 text-sm">Guruh</label>
            <input
              type="text"
              name="groupName"
              value={form.groupName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
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

export default TeacherPage;
