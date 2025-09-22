import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopStudent from "../components/TopStudent";

const TeacherGroups = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://167.86.121.42:8080/user/teacher-dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setDashboard(res.data?.data || null);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(
            `Xato: ${err.response?.status || ""} So‘rov bajarilmadi`
          );
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
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
        {error && (
          <p className="text-red-500 bg-white/30 backdrop-blur-md p-3 rounded-md mb-6">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-[1rem]">
          <div className="bg-white/80 backdrop-blur-md border-[2px] rounded-xl p-5 shadow-lg hover:shadow-2xl transition-shadow duration-500">
            <p className="text-gray-700 mb-2 text-[1.2rem]">
              <span className="font-medium">Guruhlar soni</span>
            </p>
            <h2 className="text-4xl font-semibold text-gray-800 mb-2">
              {dashboard.groupCount}
            </h2>
          </div>

          <div className="bg-white/80 backdrop-blur-md border-[2px] rounded-xl p-5 shadow-lg hover:shadow-2xl transition-shadow duration-500">
            <p className="text-gray-700 mb-2 text-[1.2rem]">
              <span className="font-medium">O'quvchilar soni</span>
            </p>
            <h2 className="text-4xl font-semibold text-gray-800 mb-2">
              {dashboard.studentCount}
            </h2>
          </div>
        </div>

        <TopStudent />
      </div>
    </div>
  );
};

export default TeacherGroups;
