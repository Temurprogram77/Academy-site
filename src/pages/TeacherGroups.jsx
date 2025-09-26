import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import TopStudent from "../components/TopStudent";

const fetchTeacherDashboard = async (token) => {
  const { data } = await axios.get(
    "http://167.86.121.42:8080/user/teacher-dashboard",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data?.data || null;
};

const TeacherGroups = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const { data: dashboard, isLoading, isError, error } = useQuery({
    queryKey: ["teacher-dashboard", token],
    queryFn: () => fetchTeacherDashboard(token),
    retry: false,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!token,
    onError: (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-red-500 bg-white/30 backdrop-blur-md p-3 rounded-md">
          Xato: {error.response?.status || ""} So‘rov bajarilmadi
        </p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <h1 className="text-2xl font-bold text-gray-600">
          Hozircha statistik ma’lumot mavjud emas!
        </h1>
      </div>
    );
  }

  return (
    <div className="mt-[3rem]">
      <div className="max-w-[1300px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-[1rem]">
          <div className="bg-white/80 backdrop-blur-md border-[2px] rounded-xl p-5 shadow-lg hover:shadow-2xl transition-shadow duration-500">
            <p className="text-gray-700 mb-2 text-[1.2rem]">
              <span className="font-medium">Guruhlar soni</span>
            </p>
            <h2 className="text-4xl font-semibold text-gray-800 mb-2">{dashboard.groupCount}</h2>
          </div>
          <div className="bg-white/80 backdrop-blur-md border-[2px] rounded-xl p-5 shadow-lg hover:shadow-2xl transition-shadow duration-500">
            <p className="text-gray-700 mb-2 text-[1.2rem]">
              <span className="font-medium">O‘quvchilar soni</span>
            </p>
            <h2 className="text-4xl font-semibold text-gray-800 mb-2">{dashboard.studentCount}</h2>
          </div>
        </div>
        <div className="w-full">
          <TopStudent />
        </div>
      </div>
    </div>
  );
};

export default TeacherGroups;