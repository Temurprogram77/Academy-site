import React, { useState } from "react";
import axios from "axios";
import { FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchRooms = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://167.86.121.42:8080/room", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data?.data || [];
};

const Rooms = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addModal, setAddModal] = useState(false);
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Xona qo‘shish (query param orqali)
  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Xona nomi bo‘sh bo‘lishi mumkin emas!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://167.86.121.42:8080/room?name=${encodeURIComponent(
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
      console.error("Error adding room:", err);
      toast.error("Xona qo‘shishda xatolik yuz berdi!");
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

      {/* Loading / Error / Rooms */}
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
              onClick={() => setSelectedRoom(room)}
              className="cursor-pointer bg-white p-6 rounded-2xl border-2 border-transparent hover:border-green-500 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {room.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Xona raqami: {room.id}</p>
            </div>
          ))}
        </div>
      )}

      {/* Room Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[400px] overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-400 p-4">
              <h2 className="text-xl font-bold text-white">
                {selectedRoom.name}
              </h2>
            </div>
            <div className="p-6">
              <table className="min-w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium text-gray-700">
                      Xona raqami
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {selectedRoom.id}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 flex justify-end bg-gray-50">
              <button
                onClick={() => setSelectedRoom(null)}
                className="px-5 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
              >
                Yopish
              </button>
            </div>
          </div>
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
    </div>
  );
};

export default Rooms;
