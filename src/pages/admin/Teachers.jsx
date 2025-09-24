import React, { useEffect, useState } from "react";
import axios from "axios";
import { TiPlusOutline } from "react-icons/ti";
import { FiUser, FiX } from "react-icons/fi";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Telefon raqam formatlash
const formatPhoneNumber = (phone) => {
  if (!phone) return "Noma'lum";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone;
};

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const token = localStorage.getItem("token");

  // Teachers fetch (cache + API) – useEffect bilan
  useEffect(() => {
    let isMounted = true;
    const cached = localStorage.getItem("teachersCache");

    if (cached) {
      const parsed = JSON.parse(cached);
      if (isMounted) {
        setTeachers(parsed);
        setFilteredTeachers(parsed);
        setLoading(false);
      }
    }

    if (!cached) {
      axios
        .get(
          "http://167.86.121.42:8080/user/search?role=TEACHER&page=0&size=50",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          if (!isMounted) return;
          const arr = res?.data?.data?.body ?? [];
          setTeachers(arr);
          setFilteredTeachers(arr);
          setLoading(false);
          localStorage.setItem("teachersCache", JSON.stringify(arr));
        })
        .catch((err) => {
          console.error("Teachers error:", err);
          if (!isMounted) {
            setError("Kechirasiz, ma’lumotlarni yuklashda xatolik yuz berdi!");
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Search filter
  useEffect(() => {
    const normalizedSearch = (search || "").toLowerCase().trim();
    const filtered = teachers.filter((teacher) =>
      (teacher.fullName || "").toLowerCase().includes(normalizedSearch)
    );
    setFilteredTeachers(filtered);
  }, [search, teachers]);

  // Modal
  const openModal = (teacher) => {
    setSelectedTeacher(teacher);
    setModalOpen(true);
  };
  const closeModal = () => {
    setSelectedTeacher(null);
    setModalOpen(false);
  };

  // Add Teacher
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber.startsWith("998")
          ? form.phoneNumber
          : `998${form.phoneNumber}`,
        password: form.password,
        role: "TEACHER",
      };

      await axios.post("http://167.86.121.42:8080/auth/saveUser", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ O‘qituvchi qo‘shildi!");
      setAddModal(false);
      setForm({ fullName: "", phoneNumber: "", password: "" });

      // Cache va teachers yangilash
      localStorage.removeItem("teachersCache");
      window.location.reload(); // yoki fetchTeachers’ni qayta ishlash mumkin
    } catch (err) {
      console.error("Add teacher error:", err.response?.data || err.message);
      alert("❌ O‘qituvchi qo‘shishda xatolik!");
    }
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
      {/* Add Teacher va Search */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <TiPlusOutline size={20} />
          <span>Add New Teacher</span>
        </button>

        <input
          type="text"
          placeholder="Ism bo‘yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Teachers jadvali */}
      <table className="min-w-full divide-y divide-gray-200 my-6 border shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-[#5DB444] to-[#31e000] text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              O‘qituvchi
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Telefon
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Amal
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher, idx) => (
              <tr
                key={teacher.id || idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                  {teacher.imageUrl ? (
                    <img
                      src={teacher.imageUrl}
                      alt="teacher"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <FiUser className="text-gray-500" size={16} />
                    </div>
                  )}
                  {teacher.fullName || "No name"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatPhoneNumber(teacher.phoneNumber)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {teacher.role || "TEACHER"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => openModal(teacher)}
                    className="text-[#5DB444] hover:text-green-700 font-medium"
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
                O‘qituvchilar topilmadi
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Teacher Modal */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-2xl">
            <button
              onClick={() => setAddModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
              Yangi o‘qituvchi qo‘shish
            </h2>
            <form className="flex flex-col gap-3" onSubmit={handleAddTeacher}>
              <input
                type="text"
                name="fullName"
                placeholder="Ism Familiya"
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <PhoneInput
                country={"uz"}
                onlyCountries={["uz"]}
                masks={{ uz: "(..) ...-..-.." }}
                value={form.phoneNumber}
                onChange={(phone) =>
                  setForm((prev) => ({ ...prev, phoneNumber: phone }))
                }
                inputStyle={{
                  width: "100%",
                  borderRadius: "0.375rem",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                }}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Parol"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-gray-600"
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </button>
              </div>
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

      {/* Teacher Info Modal */}
      {modalOpen && selectedTeacher && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-96 relative shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
            <div className="flex items-center gap-4 mb-4 border-b pb-2">
              {selectedTeacher.imageUrl ? (
                <img
                  src={selectedTeacher.imageUrl}
                  alt="teacher"
                  className="w-14 h-14 rounded-full object-cover border-2 border-green-500"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center border-2 border-green-500">
                  <FiUser className="text-gray-500" size={20} />
                </div>
              )}
              <h2 className="text-2xl font-bold text-green-600">
                O‘qituvchi ma’lumotlari
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Ism:</span>{" "}
                {selectedTeacher.fullName}
              </p>
              <p>
                <span className="font-semibold">Telefon:</span>{" "}
                {formatPhoneNumber(selectedTeacher.phoneNumber)}
              </p>
              <p>
                <span className="font-semibold">Role:</span>{" "}
                {selectedTeacher.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
