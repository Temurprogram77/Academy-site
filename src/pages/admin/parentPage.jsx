import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser } from "react-icons/fi";

const formatPhoneNumber = (phone) => {
  if (!phone) return "Noma'lum";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone;
};

const ParentPage = () => {
  const { id } = useParams(); // URL dan id olish
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://167.86.121.42:8080",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!id) {
      setError("Ota-ona ID topilmadi!");
      setLoading(false);
      return;
    }

    api
      .get(`/user/${id}`)
      .then((res) => {
        setParent(res?.data?.data || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ParentPage error:", err);
        setError("Ma’lumotni yuklashda xatolik yuz berdi!");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="mt-80 flex items-center justify-center bg-[#F3F4F6]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#208a00]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  if (!parent) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Ota-ona topilmadi</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <div className="flex items-center gap-4">
        {parent.imageUrl ? (
          <img
            src={parent.imageUrl}
            alt="parent"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
            <FiUser className="text-gray-500" size={32} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {parent.fullName || "Ism kiritilmagan"}
          </h1>
          <p className="text-gray-600">{parent.role || "PARENT"}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <p>
          <span className="font-semibold">Telefon:</span>{" "}
          {formatPhoneNumber(parent.phone)}
        </p>
        <p>
          <span className="font-semibold">Email:</span>{" "}
          {parent.email || "Kiritilmagan"}
        </p>
        <p>
          <span className="font-semibold">Username:</span>{" "}
          {parent.username || "Kiritilmagan"}
        </p>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Orqaga
        </button>
        <button
          onClick={() => navigate(`/parent-edit/${parent.id}`)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Tahrirlash
        </button>
      </div>
    </div>
  );
};

export default ParentPage;
