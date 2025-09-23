import React, { useEffect, useState } from "react";
import axios from "axios";
import { TiPlusOutline } from "react-icons/ti";
import { FiX } from "react-icons/fi";

const weekOptions = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    startTime: "",
    endTime: "",
    weekDays: [],
    teacherId: "",
    roomId: "",
  });

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://167.86.121.42:8080",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Teams fetch
  useEffect(() => {
    if (!token) {
      setError("Token topilmadi!");
      setLoading(false);
      return;
    }

    api
      .get("/group?page=0&size=50")
      .then((res) => {
        const arr = res?.data?.data?.body ?? [];
        setTeams(arr);
        setFilteredTeams(arr);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Guruhlarni yuklashda xatolik yuz berdi!");
        setLoading(false);
      });
  }, [token]);

  // Search filter
  useEffect(() => {
    const normalizedSearch = (search || "").toLowerCase().trim();
    const filtered = teams.filter(
      (team) =>
        (team.name || "").toLowerCase().includes(normalizedSearch) ||
        (team.teacherName || "").toLowerCase().includes(normalizedSearch)
    );
    setFilteredTeams(filtered);
  }, [search, teams]);

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
    setForm((prev) => {
      const exists = prev.weekDays.includes(value);
      return {
        ...prev,
        weekDays: exists
          ? prev.weekDays.filter((d) => d !== value)
          : [...prev.weekDays, value],
      };
    });
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Jamoa nomini kiriting!");
    try {
      await axios.post(
        "http://167.86.121.42:8080/group",
        {
          ...form,
          teacherId: Number(form.teacherId),
          roomId: Number(form.roomId),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Guruh qo‘shildi!");
      setAddModal(false);
      // Refresh teams
      const res = await api.get("/group?page=0&size=50");
      setTeams(res.data?.data?.body ?? []);
      setFilteredTeams(res.data?.data?.body ?? []);
      setForm({
        name: "",
        startTime: "",
        endTime: "",
        weekDays: [],
        teacherId: "",
        roomId: "",
      });
    } catch (err) {
      console.error(err);
      alert("Guruh qo‘shishda xatolik!");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="px-6">
      <div className="flex items-center justify-between mt-6 mb-4">
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <TiPlusOutline size={20} /> Yangi Guruh
        </button>
        <input
          type="text"
          placeholder="Guruh yoki o‘qituvchi bo‘yicha qidirish..."
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
              O‘qituvchi
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              O‘quvchilar soni
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                  {team.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {team.teacherName || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {team.studentCount ?? 0}
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
              <strong>O‘qituvchi:</strong> {selectedTeam.teacherName || "-"}
            </p>
            <p>
              <strong>O‘quvchilar soni:</strong>{" "}
              {selectedTeam.studentCount ?? 0}
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
              Yangi jamoa qo‘shish
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
                placeholder="Teacher ID"
                value={form.teacherId}
                onChange={handleFormChange}
                className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="number"
                name="roomId"
                placeholder="Room ID"
                value={form.roomId}
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

export default Teams;
