import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TeacherPage = () => {
  const { id } = useParams(); // URL dan ID ni olish
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://167.86.121.42:8080",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!token) {
      setError("Token topilmadi!");
      setLoading(false);
      return;
    }

    api
      .get(`/user/${id}`) // ID bo‘yicha ustozni olish
      .then((res) => {
        setTeacher(res.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Teacher error:", err);
        setError("Kechirasiz, ma’lumotlarni yuklashda xatolik yuz berdi!");
        setLoading(false);
      });
  }, [id, token]);

  if (loading) {
    return (
      <div className="mt-40 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Ustoz topilmadi</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Orqaga
      </button>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex items-center gap-4">
          {teacher.imageUrl ? (
            <img
              src={teacher.imageUrl}
              alt="teacher"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
              No Image
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {teacher.fullName}
            </h2>
            <p className="text-gray-600">{teacher.role}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Telefon:</span>{" "}
            {teacher.phone || "Noma’lum"}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {teacher.email || "Noma’lum"}
          </p>
          <p>
            <span className="font-semibold">Username:</span>{" "}
            {teacher.username || "Noma’lum"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;
