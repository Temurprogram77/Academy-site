import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [name, setname] = useState("");

  const token = localStorage.getItem("token");

  // Xonalarni olish
  useEffect(() => {
    fetchRooms();
  }, [token]);

  const fetchRooms = () => {
    setLoading(true);
    setError(null);

    axios
      .get("http://167.86.121.42:8080/room", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res?.data?.data || [];
        setRooms(data);
        setFilteredRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setError("Kechirasiz, ma’lumotlarni yuklashda xatolik yuz berdi!");
        setLoading(false);
      });
  };

  // Qidiruv
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredRooms(
      rooms.filter((room) => room.name.toLowerCase().includes(value))
    );
  };

  // Xona qo‘shish
  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Xona nomi bo‘sh bo‘lishi mumkin emas!");
      return;
    }

    try {
      await axios.post(
        `http://167.86.121.42:8080/room?name=${encodeURIComponent(name)}`,
        {}, // ❗ body bo‘sh
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Yangi xona qo‘shildi!");
      setAddModal(false);
      setname("");
      fetchRooms();
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
      {loading ? (
        <div className="mt-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 mt-4 text-center">{error}</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className="cursor-pointer bg-white p-6 rounded-2xl border-2 border-transparent hover:border-green-500 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {room.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">ID: {room.id}</p>
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
                      Xona ID
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {selectedRoom.id}
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <td className="px-4 py-3 font-medium text-gray-700">
                      O‘quvchilar soni
                    </td>
                    <td className="px-4 py-3 text-gray-600">?</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium text-gray-700">
                      O‘qituvchi
                    </td>
                    <td className="px-4 py-3 text-gray-600">?</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">
                      Guruh nomi
                    </td>
                    <td className="px-4 py-3 text-gray-600">?</td>
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
                onChange={(e) => setname(e.target.value)}
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
