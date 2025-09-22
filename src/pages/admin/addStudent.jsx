import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast, { Toaster } from "react-hot-toast";

const AddStudent = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [imgUrl, setImgUrl] = useState(""); 
  const [groupId, setGroupId] = useState(""); 
  const [groups, setGroups] = useState([]); // 📌 Guruhlar
  const [parentPhone, setParentPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const defaultImg = "https://i.ibb.co/6t0KxkX/default-user.png"; 

  // 📌 Guruhlarni olib kelish
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://167.86.121.42:8080/group/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success) {
          setGroups(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
        toast.error("Guruhlarni yuklashda xatolik!");
      }
    };
    fetchGroups();
  }, [token]);

  // Regex qoidalari
  const nameRegex = /^.{3,}$/;
  const phoneRegex = /^998\d{9}$/;
  const passwordRegex = /^.{6,}$/;

  const handleAddStudent = async () => {
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
    if (!groupId) {
      toast.error("Guruhni tanlang!");
      return;
    }
    if (parentPhone && !phoneRegex.test(parentPhone)) {
      toast.error("Ota-ona telefon raqami noto‘g‘ri!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://167.86.121.42:8080/auth/saveStudent",
        {
          fullName,
          phone: phoneNumber,
          imgUrl: imgUrl.trim() !== "" ? imgUrl : defaultImg,
          password,
          groupId: Number(groupId), // 📌 select-dan tanlangan id yuboriladi
          parentPhone: parentPhone || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("O‘quvchi muvaffaqiyatli qo‘shildi!");
        navigate("/admin-dashboard/students", { state: { refresh: true } });
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
      <h2 className="text-xl font-semibold mb-4">Yangi o‘quvchi qo‘shish</h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="To‘liq ism"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <PhoneInput
          country={"uz"}
          value={phoneNumber}
          onChange={(phone) => setPhoneNumber(phone)}
          inputClass="w-full border w-[400px] px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Telefon raqam"
          enableAreaCodes={true}
          disableDropdown={true}
        />

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

        <input
          type="text"
          placeholder="Rasm URL (ixtiyoriy)"
          value={imgUrl}
          onChange={(e) => setImgUrl(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* 📌 Guruh select */}
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none bg-transparent focus:ring-2 focus:ring-green-500"
        >
          <option value="">Guruhni tanlang</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        <PhoneInput
          country={"uz"}
          value={parentPhone}
          onChange={(phone) => setParentPhone(phone)}
          inputClass="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ota-ona telefon raqami (ixtiyoriy)"
          enableAreaCodes={true}
          disableDropdown={true}
        />

        <button
          onClick={handleAddStudent}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          {loading ? "Yuklanmoqda..." : "Qo‘shish"}
        </button>
      </div>
    </div>
  );
};

export default AddStudent;
