import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTeam = () => {
  const [form, setForm] = useState({
    name: "",
    startTime: "",
    endTime: "",
    weekDays: [],
    teacherId: "",
    roomId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
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
          ? prev.weekDays.filter((day) => day !== value)
          : [...prev.weekDays, value],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Jamoa nomini kiriting");
      return;
    }

    if (!token) {
      setError("Token topilmadi. Iltimos, qayta tizimga kiring.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://167.86.121.42:8080/group",
        {
          ...form,
          teacherId: Number(form.teacherId),
          roomId: Number(form.roomId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log("AddTeam success:", res.status, res.data);
      navigate("/admin-dashboard/teams");
    } catch (err) {
      console.error("AddTeam error full:", err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            err.response.data ||
            `Server javobi: ${err.response.status}`
        );
      } else if (err.request) {
        setError("Serverdan javob olinmadi. Tarmoq yoki CORS muammosi.");
      } else {
        setError(err.message || "Noma'lum xato yuz berdi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const weekOptions = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

  return (
    <div className="flex justify-center items-center my-6 bg-gray-100 px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Yangi jamoa qo‘shish
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Jamoa nomi</label>
          <input
            type="text"
            name="name"
            placeholder="Jamoa nomini kiriting..."
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Start time */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Boshlanish vaqti</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* End time */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Tugash vaqti</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Week days */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Hafta kunlari</label>
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
        </div>

        {/* TeacherId */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Teacher ID</label>
          <input
            type="number"
            name="teacherId"
            placeholder="Ustoz ID"
            value={form.teacherId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* RoomId */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Room ID</label>
          <input
            type="number"
            name="roomId"
            placeholder="Xona ID"
            value={form.roomId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Yuborilmoqda..." : "Qo‘shish"}
        </button>
      </form>
    </div>
  );
};

export default AddTeam;
