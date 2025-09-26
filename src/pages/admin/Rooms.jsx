import React, { useState } from "react";
import axios from "axios";
import { FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchRooms = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("https://nazorat.sferaacademy.uz/api/room", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data?.data || [];
};

const Rooms = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [name, setName] = useState("");

  const queryClient = useQueryClient();

  const {
    data: rooms = [],
    isLoading,
    error,
  } = useQuery(["rooms"], fetchRooms, {
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => setSearchTerm(e.target.value);

  // ADD ROOM
  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!name.trim())
      return toast.error("Xona nomi bo‘sh bo‘lishi mumkin emas!");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://nazorat.sferaacademy.uz/api/room?name=${encodeURIComponent(
          name.trim()
        )}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Yangi xona qo‘shildi!");
      setAddModal(false);
      setName("");
      queryClient.invalidateQueries(["rooms"]);
    } catch (err) {
      console.error(err);
      toast.error("Xona qo‘shishda xatolik yuz berdi!");
    }
  };

  // DELETE ROOM
  const handleDeleteRoom = async (id) => {
    if (!window.confirm("Rostdan ham xonani o‘chirmoqchimisiz?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://nazorat.sferaacademy.uz/api/room/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xona o‘chirildi!");
      setSelectedRoom(null);
      queryClient.invalidateQueries(["rooms"]);
    } catch (err) {
      console.error(err);
      toast.error("Xona o‘chirishda xatolik yuz berdi!");
    }
  };

  // EDIT ROOM
  const handleOpenEdit = (room) => {
    setSelectedRoom(room);
    setName(room.name || "");
    setEditModal(true);
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    if (!name.trim())
      return toast.error("Xona nomi bo‘sh bo‘lishi mumkin emas!");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://nazorat.sferaacademy.uz/api/room/${
          selectedRoom.id
        }?name=${encodeURIComponent(name.trim())}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Xona nomi yangilandi!");
      setEditModal(false);
      setSelectedRoom(null);
      setName("");
      queryClient.invalidateQueries(["rooms"]);
    } catch (err) {
      console.error(err);
      toast.error("Xona yangilashda xatolik yuz berdi!");
    }
  };

  return (
    <div className="p-8">
      <Toaster />
      {/* Search & Add */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Xona nomidan qidiring..."
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-green-500"
        />
        <div className="flex w-full md:w-1/2 justify-end">
          <button
            onClick={() => setAddModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Yangi xona qo‘shish
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      {isLoading ? (
        <div className="mt-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 mt-4 text-center">
          Kechirasiz, ma’lumotlarni yuklashda xatolik yuz berdi!
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room, idx) => (
            <div
              key={room.id ?? idx}
              className="bg-white p-6 rounded-2xl border-2 border-transparent shadow-md flex flex-col gap-3 hover:border-green-500 transition transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {room.name}
              </h2>
              <p className="text-sm text-gray-500">Xona raqami: {room.id}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleOpenEdit(room)}
                  className="flex-1 px-3 py-2 bg-[#66C660] text-white rounded-lg hover:bg-[#50a34a] transition"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleDeleteRoom(room.id)}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  O‘chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Room Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[400px] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Yangi xona qo‘shish</h2>
              <button
                onClick={() => setAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleAddRoom}>
              <input
                type="text"
                placeholder="Xona nomi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                Qo‘shish
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {editModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[400px] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Xona nomini tahrirlash</h2>
              <button
                onClick={() => setEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleEditRoom}>
              <input
                type="text"
                placeholder="Xona nomi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-[#66C660] text-white py-2 px-4 rounded-lg hover:bg-[#50a34a] transition"
                >
                  Saqlash
                </button>
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;