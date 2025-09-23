import React, { useEffect, useState } from "react";
import axios from "axios";
import { TiPlusOutline } from "react-icons/ti";
import { FiUser, FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast"; // <-- toast import

// Telefon formatlash funksiyasi
const formatPhoneNumber = (phone) => {
  if (!phone) return "Noma'lum";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone;
};

const Parents = () => {
  const [parents, setParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://167.86.121.42:8080",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    if (!token) {
      setError("Token topilmadi!");
      setLoading(false);
      return;
    }

    api
      .get("/user/search?role=PARENT&page=0&size=50")
      .then((res) => {
        const arr = res?.data?.data?.body ?? [];
        setParents(arr);
        setFilteredParents(arr);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Malumotlarni yuklashda xatolik yuz berdi!");
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    const normalizedSearch = (search || "").toLowerCase().trim();
    const filtered = parents.filter((parent) =>
      (parent.fullName || "").toLowerCase().includes(normalizedSearch)
    );
    setFilteredParents(filtered);
  }, [search, parents]);

  const openModal = (parent) => {
    setSelectedParent(parent);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedParent(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddParent = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.fullName.trim() ||
      !form.phoneNumber.trim() ||
      !form.password.trim()
    ) {
      setError("Barcha maydonlar to‘ldirilishi kerak!");
      return;
    }

    try {
      const payload = {
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.replace(/\D/g, ""),
        password: form.password.trim(),
      };

      await axios.post(
        "http://167.86.121.42:8080/auth/saveUser?role=PARENT",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Yangi ota-ona qo‘shildi!"); // <-- alert o‘rniga toast
      setAddModal(false);
      setForm({ fullName: "", phoneNumber: "", password: "" });

      const res = await api.get("/user/search?role=PARENT&page=0&size=50");
      setParents(res.data?.data?.body ?? []);
      setFilteredParents(res.data?.data?.body ?? []);
    } catch (err) {
      console.error("AddParent error:", err);
      if (err.response) {
        setError(err.response.data?.message || "Server xatosi yuz berdi");
      } else if (err.request) {
        setError("Serverdan javob olinmadi. Tarmoq muammosi?");
      } else {
        setError("Noma’lum xatolik yuz berdi");
      }
    }
  };

  if (loading)
    return (
      <div className="mt-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#208a00]"></div>
      </div>
    );

  return (
    <div className="px-6">
      <Toaster position="top-right" /> {/* <-- Toast container */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <TiPlusOutline size={20} /> Add New Parent
        </button>

        <input
          type="text"
          placeholder="Ism bo‘yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <table className="min-w-full divide-y divide-gray-200 my-10 border shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-[#5DB444] to-[#31e000] text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Ota-ona
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
          {filteredParents.length > 0 ? (
            filteredParents.map((parent, idx) => (
              <tr
                key={parent.id || idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black flex items-center gap-3">
                  {parent.imageUrl ? (
                    <img
                      src={parent.imageUrl}
                      alt="parent"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <FiUser className="text-gray-500" size={16} />
                    </div>
                  )}
                  {parent.fullName || "No name"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatPhoneNumber(parent.phoneNumber)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {parent.role || "PARENT"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    className="text-[#5DB444] hover:text-green-700 font-medium"
                    onClick={() => openModal(parent)}
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
                Ota-onalar topilmadi
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {modalOpen && selectedParent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-96 relative shadow-2xl transform transition-transform duration-300 scale-100 hover:scale-105">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
            <div className="flex items-center gap-4 mb-4 border-b pb-2">
              {selectedParent.imageUrl ? (
                <img
                  src={selectedParent.imageUrl}
                  alt="parent"
                  className="w-14 h-14 rounded-full object-cover border-2 border-green-500"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center border-2 border-green-500">
                  <FiUser className="text-gray-500" size={20} />
                </div>
              )}
              <h2 className="text-2xl font-bold text-green-600">
                Ota-ona ma’lumotlari
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Ism:</span>{" "}
                {selectedParent.fullName}
              </p>
              <p>
                <span className="font-semibold">Telefon:</span>{" "}
                {formatPhoneNumber(selectedParent.phoneNumber)}
              </p>
              <p>
                <span className="font-semibold">Role:</span>{" "}
                {selectedParent.role}
              </p>
            </div>
          </div>
        </div>
      )}
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
              Yangi ota-ona qo‘shish
            </h2>
            {error && <p className="text-red-500 text-center mb-2">{error}</p>}
            <form className="flex flex-col gap-3" onSubmit={handleAddParent}>
              <input
                type="text"
                name="fullName"
                placeholder="Ism"
                value={form.fullName}
                onChange={handleFormChange}
                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Telefon raqam"
                value={form.phoneNumber}
                onChange={handleFormChange}
                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Parol"
                value={form.password}
                onChange={handleFormChange}
                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
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

export default Parents;
