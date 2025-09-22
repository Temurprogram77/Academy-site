import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import toast, { Toaster } from "react-hot-toast";

const AddParent = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Regex qoidalari
  const nameRegex = /^.{3,}$/;
  const phoneRegex = /^998\d{9}$/;
  const passwordRegex = /^.{6,}$/;

  const handleAddParent = async () => {
    if (!nameRegex.test(fullName)) {
      toast.error("Ism kamida 3 ta belgidan iborat bo‘lishi kerak!");
      return;
    }
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Telefon raqam noto‘g‘ri! Misol: 998901234567");
      return;
    }
    if (!passwordRegex.test(password)) {
      toast.error("Parol kamida 6 ta belgidan iborat bo‘lishi kerak!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://167.86.121.42:8080/auth/saveUser?role=PARENT",
        { fullName, phoneNumber, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Ota-ona muvaffaqiyatli qo‘shildi!");
        navigate("/admin-dashboard/parents");
      }
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi. Ma'lumotlarni tekshirib qayta urinib ko‘ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
      <Toaster />
      <h2 className="text-xl font-semibold mb-4">Yangi ota-ona qo‘shish</h2>

      <div className="flex flex-col gap-4">
        {/* Ism */}
        <input
          type="text"
          placeholder="To‘liq ism"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Telefon */}
        <PhoneInput
          country={'uz'}
          value={phoneNumber}
          onChange={(phone) => setPhoneNumber(phone)}
          inputClass="w-full border px-0 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          containerClass="w-full"
          buttonClass="hidden"
          placeholder="Telefon raqam"
          enableAreaCodes={true}
          disableDropdown={true}
        />

        {/* Parol */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </span>
        </div>

        <button
          onClick={handleAddParent}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          {loading ? "Yuklanmoqda..." : "Qo‘shish"}
        </button>
      </div>
    </div>
  );
};

export default AddParent;
