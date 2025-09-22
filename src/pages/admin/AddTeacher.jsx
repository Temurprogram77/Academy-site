import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const AddTeacher = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://167.86.121.42:8080/auth/saveUser?role=TEACHER",
        {
          fullName,
          phoneNumber,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("O‘qituvchi muvaffaqiyatli qo‘shildi!");
        navigate("/admin-dashboard/teachers");
      }
    } catch (err) {
      console.error(err);
      setError(
        "Xatolik yuz berdi. Iltimos, ma'lumotlarni tekshirib qayta urinib ko‘ring."
      );
      toast.error("Xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
      <Toaster position="top-right" />
      <h2 className="text-xl font-semibold mb-4">Yangi o‘qituvchi qo‘shish</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="To‘liq ism"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Telefon raqam (misol: 998901234567)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          {loading ? "Yuklanmoqda..." : "Qo‘shish"}
        </button>
      </form>
    </div>
  );
};

export default AddTeacher;
