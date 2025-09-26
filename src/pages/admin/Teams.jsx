import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { TiPlusOutline } from "react-icons/ti";
import { FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const weekOptions = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const api = axios.create({ baseURL: "https://nazorat.sferaacademy.uz/api" });

const Teams = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    startTime: "",
    endTime: "",
    weekDays: [],
    roomId: "",
    teacherId: "",
  });

  const [filteredTeams, setFilteredTeams] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (!token) {
      toast.error("❌ Token topilmadi.");
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchTeachers = useCallback(async () => {
    try {
      const res = await api.get("/user/search?role=TEACHER&page=0&size=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data?.data?.body || []);
    } catch (err) {
      console.error(err);
      toast.error("❌ Ustozlar yuklanmadi!");
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchTeachers();
  }, [token, fetchTeachers]);

  const fetchTeams = async () => {
    const groupsRes = await api.get("/group/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const roomsRes = await api.get("/room", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRooms(roomsRes?.data?.data ?? []);
    return groupsRes?.data?.data ?? [];
  };

  const {
    data: teamsData,
    isLoading,
    isError,
    refetch,
  } = useQuery(["teams"], fetchTeams, {
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const teams = useMemo(() => teamsData ?? [], [teamsData]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setFilteredTeams(
        teams.filter((t) =>
          t.name?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }, 300);
    return () => clearTimeout(delay);
  }, [search, teams]);

  const openTeamModal = (team) => {
    setSelectedTeam(team);
    setModalOpen(true);
  };

  // Add team
  const handleAddTeam = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      teacherId: Number(form.teacherId),
      roomId: Number(form.roomId),
    };
    try {
      const res = await api.post("/group", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200 || res.status === 201) {
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
      } else toast.error("❌ Guruh qo‘shilmadi!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Guruh qo‘shishda xatolik!");
    }
  };

  // Delete team
  const handleDeleteTeam = async (id) => {
    if (!window.confirm("Rostdan ham guruhni o‘chirmoqchimisiz?")) return;
    try {
      await api.delete(`/group/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Guruh o‘chirildi!");
      setModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("❌ Guruh o‘chirishda xatolik!");
    }
  };

  // Open edit modal
  const handleOpenEdit = () => {
    if (!selectedTeam) return;
    setForm({
      name: selectedTeam.name,
      startTime: selectedTeam.startTime,
      endTime: selectedTeam.endTime,
      weekDays: selectedTeam.weekDays || [],
      teacherId: selectedTeam.teacherId,
      roomId: selectedTeam.roomId,
    });
    setEditModal(true);
    setModalOpen(false);
  };

  // Update team
  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;
    const payload = {
      ...form,
      teacherId: Number(form.teacherId),
      roomId: Number(form.roomId),
    };
    try {
      await api.put(`/group/${selectedTeam.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Guruh yangilandi!");
      setEditModal(false);
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
      toast.error("❌ Guruh yangilashda xatolik!");
    }
  };

  if (isLoading)
    return (
      <div className="mt-40 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
      </div>
    );
  if (isError)
    return (
      <div className="text-red-500 p-6">Ma’lumotlarni yuklashda xatolik!</div>
    );

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
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
              Guruh nomi
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
              O‘quvchilar soni
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
              Ustoz
            </th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team, idx) => (
              <tr
                key={team.id || idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {team.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {team.studentCount ?? 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {team.teacherName || "-"}
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
                colSpan="4"
                className="text-center px-6 py-4 text-sm text-gray-500"
              >
                Hech qanday guruh topilmadi
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Team modal */}
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
              <strong>O‘quvchilar soni:</strong> {selectedTeam.studentCount}
            </p>
            {selectedTeam.roomName && (
              <p>
                <strong>Xona:</strong> {selectedTeam.roomName}
              </p>
            )}
            {(selectedTeam.startTime || selectedTeam.endTime) && (
              <p>
                <strong>Dars vaqti:</strong> {selectedTeam.startTime || ""}{" "}
                {selectedTeam.startTime && selectedTeam.endTime ? "-" : ""}{" "}
                {selectedTeam.endTime || ""}
              </p>
            )}
            {selectedTeam.weekDays?.length > 0 && (
              <p>
                <strong>Haftada kunlari:</strong>{" "}
                {selectedTeam.weekDays.join(", ")}
              </p>
            )}
            {selectedTeam.teacherName && (
              <p>
                <strong>Ustoz:</strong> {selectedTeam.teacherName}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => handleDeleteTeam(selectedTeam.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                O‘chirish
              </button>
              <button
                onClick={handleOpenEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Tahrirlash
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Team modal */}
      {addModal && (
        <TeamFormModal
          title="Yangi guruh qo‘shish"
          form={form}
          setForm={setForm}
          teachers={teachers}
          rooms={rooms}
          onClose={() => setAddModal(false)}
          onSubmit={handleAddTeam}
        />
      )}

      {/* Edit Team modal */}
      {editModal && (
        <TeamFormModal
          title="Guruhni tahrirlash"
          form={form}
          setForm={setForm}
          teachers={teachers}
          rooms={rooms}
          onClose={() => setEditModal(false)}
          onSubmit={handleUpdateTeam}
        />
      )}
    </div>
  );
};

const TeamFormModal = ({
  title,
  form,
  setForm,
  teachers,
  rooms,
  onClose,
  onSubmit,
}) => {
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

  const handleTimeInput = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) value = value.slice(0, 2) + ":" + value.slice(2);
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
          {title}
        </h2>
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
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
            type="text"
            name="startTime"
            placeholder="00:00"
            value={form.startTime}
            onChange={handleTimeInput}
            maxLength={5}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            name="endTime"
            placeholder="00:00"
            value={form.endTime}
            onChange={handleTimeInput}
            maxLength={5}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {weekOptions.map((day) => (
              <label
                key={day}
                className={`flex items-center cursor-pointer transition-all duration-200 rounded-full px-3 py-1 text-sm font-medium border border-green-400 ${
                  form.weekDays.includes(day)
                    ? "bg-green-500 text-white scale-105"
                    : "bg-white text-green-700"
                } hover:bg-green-400 hover:text-white hover:scale-105`}
              >
                <input
                  type="checkbox"
                  value={day}
                  checked={form.weekDays.includes(day)}
                  onChange={handleWeekDaysChange}
                  className="hidden"
                />
                {day.slice(0, 3)}
              </label>
            ))}
          </div>
          <select
            name="teacherId"
            value={form.teacherId}
            onChange={handleFormChange}
            className="border bg-transparent px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Ustoz tanlang</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.fullName}
              </option>
            ))}
          </select>
          <select
            name="roomId"
            value={form.roomId}
            onChange={handleFormChange}
            className="bg-transparent border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Xona tanlang</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 shadow-md"
          >
            {title.includes("qo‘shish") ? "Qo‘shish" : "Yangilash"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Teams;
