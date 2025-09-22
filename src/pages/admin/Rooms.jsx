import React, { useEffect, useState } from "react";
import axios from "axios";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://167.86.121.42:8080/room", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRooms(res?.data?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setLoading(false);
      });
  }, [token]);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🏫 Xonalar</h1>

      {/* Loading Spinner */}
      {loading ? (
        <div className="mt-80 flex items-center justify-center bg-[#F3F4F6]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#208a00]"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => handleRoomClick(room)}
              className="cursor-pointer bg-white p-6 rounded-2xl border-2 border-transparent 
                        hover:border-green-500 shadow-md hover:shadow-xl 
                        transition transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {room.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">ID: {room.id}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[400px] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-400 p-4">
              <h2 className="text-xl font-bold text-white">
                {selectedRoom.name}
              </h2>
            </div>

            {/* Modal Body */}
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

            {/* Modal Footer */}
            <div className="p-4 flex justify-end bg-gray-50">
              <button
                onClick={() => setSelectedRoom(null)}
                className="px-5 py-2 rounded-lg bg-red-500 text-white font-medium 
                           hover:bg-red-600 transition"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
