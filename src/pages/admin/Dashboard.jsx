import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminTable from "../../components/AdminTable";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState(null); // APIdan keladigan ma'lumot
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      // 1️⃣ avval localStorage cache tekshirish
      const cachedData = localStorage.getItem("dashboardCache");
      if (cachedData) {
        setData(JSON.parse(cachedData));
        setLoading(false);
      }

      try {
        const res = await axios.get(
          "https://nazorat.sferaacademy.uz/api/user/admin-dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setData(res.data.data);
          // 2️⃣ serverdan kelgan ma’lumotni cache ga saqlash
          localStorage.setItem("dashboardCache", JSON.stringify(res.data.data));
        } else {
          if (!cachedData) setError("Ma'lumot olishda xatolik yuz berdi.");
        }
      } catch (err) {
        console.error(err);
        if (!cachedData) setError("Kechirasiz hozirda server bilan xatolik.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="mt-80 flex items-center justify-center bg-[#F3F4F6]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#208a00]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          className="p-4 box bg-white rounded shadow cursor-pointer"
          onClick={() => navigate("/admin-dashboard/rooms")}
        >
          <p className="text-gray-500">Xonalar</p>
          <p className="text-3xl font-semibold">{data.roomCount}</p>
        </div>
        <div
          className="p-4 bg-white rounded shadow cursor-pointer"
          onClick={() => navigate("/admin-dashboard/teams")}
        >
          <p className="text-gray-500">Guruhlar</p>
          <p className="text-3xl font-semibold">{data.groupCount}</p>
        </div>
        <div
          className="p-4 bg-white rounded shadow cursor-pointer"
          onClick={() => navigate("/admin-dashboard/students")}
        >
          <p className="text-gray-500">O‘quvchilar</p>
          <p className="text-3xl font-semibold">{data.studentCount}</p>
        </div>
        <div
          className="p-4 bg-white rounded shadow cursor-pointer"
          onClick={() => navigate("/admin-dashboard/teachers")}
        >
          <p className="text-gray-500">O‘qituvchilar</p>
          <p className="text-3xl font-semibold">{data.teacherCount}</p>
        </div>
        <div
          className="p-4 bg-white rounded shadow cursor-pointer"
          onClick={() => navigate("/admin-dashboard/parents")}
        >
          <p className="text-gray-500">Ota-onalar</p>
          <p className="text-3xl font-semibold">{data.parentCount}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <AdminTable />
      </div>
    </div>
  );
};

export default Dashboard;
