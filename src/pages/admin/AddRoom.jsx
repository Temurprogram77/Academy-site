import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Xona nomini kiriting");
      return;
    }

    if (!token) {
      setError("Token topilmadi. Ilovaga qayta tizimga kiring.");
      return;
    }

    setLoading(true);
    try {
      // ⚡️ API "name"ni query orqali kutayotgan bo‘lishi mumkin
      const res = await axios.post(
        `http://167.86.121.42:8080/room?name=${encodeURIComponent(name)}`,
        {}, // body bo'sh, chunki query orqali yuborayapmiz
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log("AddRoom success:", res.status, res.data);
    } catch (err) {
      console.error("AddRoom error full:", err);

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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Yangi xona qo‘shish
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Xona nomi</label>
          <input
            type="text"
            placeholder="Xona nomini kiriting..."
            value={name}
            onChange={(e) => setName(e.target.value)}
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

export default AddRoom;
