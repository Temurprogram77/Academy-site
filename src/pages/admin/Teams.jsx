import React, { useState, useEffect } from "react";
import axios from "axios";
import { TiPlusOutline } from "react-icons/ti";
import { FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const weekOptions = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const api = axios.create({
  baseURL: "http://167.86.121.42:8080",
});

const Teams = () => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    startTime: "",
    endTime: "",
    weekDays: [],
    roomId: "",
    teacherId: "",
  });

  const token = localStorage.getItem("token");

  // React Query fetch
  const fetchTeams = async ({ queryKey }) => {
    const [searchQuery] = queryKey;
    const [groupsRes, roomsRes] = await Promise.all([
      api.get(`/group?name=${searchQuery}&page=0&size=50`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      api.get("/room", { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    const groupsArr = groupsRes?.data?.data?.body ?? [];
    const roomsArr = roomsRes?.data?.data ?? [];

    const detailedGroups = await Promise.all(
      groupsArr.map(async (g) => {
        try {
          const res = await api.get(`/group/${g.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return res.data?.data || g;
        } catch (err) {
          console.error(`Guruh ${g.id} ma’lumotini olishda xatolik:`, err);
          return g;
        }
      })
    );

    return { teams: detailedGroups, rooms: roomsArr };
  };

  const { data, isLoading, isError, refetch } = useQuery(
    ["teams", search.trim()],
    fetchTeams,
    {
      staleTime: 1000 * 60 * 5, // 5 daqiqa cache
      cacheTime: 1000 * 60 * 10, // 10 daqiqa
      keepPreviousData: true,
    }
  );

  const teams = data?.teams || [];
  const rooms = data?.rooms || [];

  // Search debouncing
  useEffect(() => {
    const delay = setTimeout(() => refetch(), 500);
    return () => clearTimeout(delay);
  }, [search, refetch]);

  const openTeamModal = (team) => {
    setSelectedTeam(team);
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeekDaysChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      weekDays: prev.weekDays.includes(value)
        ? prev.weekDays.filter((d) => d !== value)
        : [...prev.weekDays, value],
    }));
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("⚠ Guruh nomini kiriting!");
    if (!form.roomId) return toast.error("⚠ Xona tanlang!");
    if (!form.teacherId) return toast.error("⚠ Ustoz ID sini kiriting!");

    try {
      await api.post(
        "/group",
        {
          name: form.name,
          startTime: form.startTime,
          endTime: form.endTime,
          weekDays: form.weekDays,
          teacherId: Number(form.teacherId),
          roomId: Number(form.roomId),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Guruh qo‘shildi!");
      setAddModal(false);
      setForm({
        name: "",
        startTime: "",
        endTime: "",
        weekDays: [],
        roomId: "",
        teacherId: "",
      });
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("❌ Guruh qo‘shishda xatolik!");
    }
  };

  if (isLoading)
    return (
      <div className="mt-40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
      </div>
    );
  if (isError)
    return <div className="text-red-500">Ma’lumotlarni yuklashda xatolik!</div>;

  return (
    <div className="px-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mt-6 mb-4">
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 shadow-md transition"
        >
          <TiPlusOutline size={20} /> Yangi Guruh
        </button>
        <input
          type="text"
          placeholder="Guruh nomidan qidiring..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <table className="min-w-full divide-y divide-gray-200 my-10 border shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-[#5DB444] to-[#31e000] text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Guruh nomi
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              O‘quvchilar soni
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Xona
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Dars vaqti
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Kunlari
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Ustoz ID
            </th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {teams.length > 0 ? (
            teams.map((team, idx) => (
              <tr
                key={team.id || idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                  {team.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {team.studentCount ?? 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {team.roomName || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {team.startTime} - {team.endTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {team.weekDays?.join(", ") || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {team.teacherId || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    className="text-[#5DB444] hover:text-green-700 font-medium"
                    onClick={() => openTeamModal(team)}
                  >
                    Ko‘proq
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center px-6 py-4 text-sm text-gray-500"
              >
                Hech qanday guruh topilmadi
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Ko‘proq modal */}
      {modalOpen && selectedTeam && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-96 relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              {selectedTeam.name}
            </h2>
            <p>
              <strong>O‘quvchilar soni:</strong>{" "}
              {selectedTeam.studentCount ?? 0}
            </p>
            <p>
              <strong>Xona:</strong> {selectedTeam.roomName || "-"}
            </p>
            <p>
              <strong>Dars vaqti:</strong> {selectedTeam.startTime} -{" "}
              {selectedTeam.endTime}
            </p>
            <p>
              <strong>Haftada kunlari:</strong>{" "}
              {selectedTeam.weekDays?.join(", ") || "-"}
            </p>
            <p>
              <strong>Ustoz ID:</strong> {selectedTeam.teacherId || "-"}
            </p>
          </div>
        </div>
      )}

      {/* Add Team modal */}
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
              Yangi guruh qo‘shish
            </h2>
            <form className="flex flex-col gap-3" onSubmit={handleAddTeam}>
              <input
                type="text"
                name="name"
                placeholder="Guruh nomi"
                value={form.name}
                onChange={handleFormChange}
                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleFormChange}
                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleFormChange}
                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <div className="flex flex-wrap gap-2">
                {weekOptions.map((day) => (
                  <label key={day} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      value={day}
                      checked={form.weekDays.includes(day)}
                      onChange={handleWeekDaysChange}
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
              <input
                type="number"
                name="teacherId"
                placeholder="Ustoz ID"
                value={form.teacherId}
                onChange={handleFormChange}
                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <select
                name="roomId"
                value={form.roomId}
                onChange={handleFormChange}
                className="border px-4 py-2 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Xona tanlang</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 shadow-md"
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

export default Teams;
