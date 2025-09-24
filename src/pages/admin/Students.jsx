import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { TiPlusOutline } from "react-icons/ti";
import { FiX, FiUser } from "react-icons/fi";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Telefon formatlash funksiyasi
const formatPhoneNumber = (phone) => {
  if (!phone) return "Noma'lum";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match)
    return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
  return phone;
};

const token = localStorage.getItem("token");
const api = axios.create({
  baseURL: "http://167.86.121.42:8080",
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});
const defaultImg = "https://i.ibb.co/6t0KxkX/default-user.png";

const fetchStudents = async () => {
  const res = await api.get("/user/search?role=STUDENT&page=0&size=50");
  return res.data?.data?.body ?? [];
};

const fetchGroups = async () => {
  const res = await api.get("/group/all");
  return res.data?.success ? res.data.data : [];
};

const addStudentAPI = async (payload) => {
  await api.post("/auth/saveStudent", payload);
};

const Students = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    password: "",
    parentPhone: "",
    imgUrl: "",
    groupId: "",
  });

  // Students va Groups uchun querylar
  const {
    data: students = [],
    isLoading,
    isError,
  } = useQuery(["students"], fetchStudents);

  const { data: groups = [] } = useQuery(["groups"], fetchGroups);

  // Student qo‘shish mutation
  const mutation = useMutation(addStudentAPI, {
    onSuccess: () => {
      toast.success("Yangi o‘quvchi qo‘shildi!");
      queryClient.invalidateQueries(["students"]);
      setAddModal(false);
      setForm({
        fullName: "",
        phone: "",
        password: "",
        parentPhone: "",
        imgUrl: "",
        groupId: "",
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Server xatosi yuz berdi");
    },
  });

  const filteredStudents = students.filter((student) =>
    (student.fullName || "").toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleFormChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.password || !form.parentPhone) {
      toast.error("Barcha maydonlar to‘ldirilishi kerak!");
      return;
    }

    const payload = {
      fullName: form.fullName,
      phone: form.phone.replace(/\D/g, ""),
      password: form.password,
      parentPhone: form.parentPhone.replace(/\D/g, ""),
      imgUrl: form.imgUrl || "",
      groupId: form.groupId ? Number(form.groupId) : null,
    };
    mutation.mutate(payload);
  };

  if (isLoading)
    return (
      <div className="mt-80 flex items-center justify-center bg-[#F3F4F6]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#208a00]"></div>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 font-semibold">
          Malumotlarni yuklashda xatolik yuz berdi!
        </p>
      </div>
    );

  return (
    <div className="px-6">
      <Toaster />
      <div className="flex items-center justify-between mt-6 mb-4">
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <TiPlusOutline size={20} /> Add New Student
        </button>
        <input
          type="text"
          placeholder="Ism bo‘yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="max-h-[70vh] overflow-y-auto border shadow-lg rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
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
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <FiUser className="text-gray-500" size={16} />
                      </div>
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
                      onClick={() => {
                        setSelectedStudent(student);
                        setModalOpen(true);
                      }}
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
      </div>

      {/* Student modal */}
      {modalOpen && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-96 max-h-[80vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-green-600 text-center">
              {selectedStudent.fullName}
            </h2>
            <div className="flex flex-col gap-3 items-center">
              <img
                src={selectedStudent.imgUrl || defaultImg}
                alt="student"
                className="w-24 h-24 rounded-full object-cover"
              />
              <p>
                <strong>Telefon:</strong>{" "}
                {formatPhoneNumber(selectedStudent.phone)}
              </p>
              <p>
                <strong>Parent telefon:</strong>{" "}
                {formatPhoneNumber(selectedStudent.parentPhone)}
              </p>
              <p>
                <strong>Role:</strong> {selectedStudent.role || "STUDENT"}
              </p>
              <p>
                <strong>Guruh:</strong>{" "}
                {groups.find((g) => g.id === selectedStudent.groupId)?.name ||
                  "Noma'lum"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Student modal */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setAddModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
              Yangi o‘quvchi qo‘shish
            </h2>
            <form className="flex flex-col gap-3" onSubmit={handleAddStudent}>
              <label className="text-sm font-medium text-gray-700">Ism</label>
              <input
                type="text"
                placeholder="Ism"
                value={form.fullName}
                onChange={(e) => handleFormChange("fullName", e.target.value)}
                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />

              <label className="text-sm font-medium text-gray-700">
                Telefon raqam
              </label>
              <PhoneInput
                country="uz"
                value={form.phone}
                onChange={(value) => handleFormChange("phone", value)}
                inputClass="w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Telefon raqam"
              />

              <label className="text-sm font-medium text-gray-700">
                Parent telefon
              </label>
              <PhoneInput
                country="uz"
                value={form.parentPhone}
                onChange={(value) => handleFormChange("parentPhone", value)}
                inputClass="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Parent telefon"
              />

              <label className="text-sm font-medium text-gray-700">
                Rasm URL
              </label>
              <input
                type="text"
                placeholder="Rasm URL"
                value={form.imgUrl}
                onChange={(e) => handleFormChange("imgUrl", e.target.value)}
                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <label className="text-sm font-medium text-gray-700">Parol</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Parol"
                  value={form.password}
                  onChange={(e) => handleFormChange("password", e.target.value)}
                  className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <label className="text-sm font-medium text-transparent">
                Guruh
              </label>
              <select
                value={form.groupId}
                onChange={(e) => handleFormChange("groupId", e.target.value)}
                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Guruh tanlang</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
              >
                Qo‘shish
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
